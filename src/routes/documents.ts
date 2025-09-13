import express from 'express';
import { body, validationResult, param } from 'express-validator';
import { prisma } from '../index';
import { authenticateToken, AuthRequest, requireLawyer, requireClient, requireLawyerOrJudge } from '../middleware/auth';
import { upload, uploadToStorage, getSignedDownloadUrl, deleteFromStorage } from '../utils/storage';

const router = express.Router();

// Upload document (Client only)
router.post('/upload/:caseId', authenticateToken, requireClient, upload.single('document'), [
  param('caseId').isUUID(),
  body('documentType').trim().notEmpty(),
  body('extractedText').optional().trim()
], async (req: AuthRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { caseId } = req.params;
    const { documentType, extractedText } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Verify case exists and user has access
    const caseData = await prisma.case.findUnique({
      where: { id: caseId, clientId: req.user!.id }
    });

    if (!caseData) {
      return res.status(404).json({ error: 'Case not found or access denied' });
    }

    // Upload file to storage
    const fileUrl = await uploadToStorage(req.file, `cases/${caseId}`);

    // Create document record
    const document = await prisma.document.create({
      data: {
        fileName: req.file.originalname,
        fileUrl,
        documentType,
        extractedText: extractedText || null,
        caseId,
        uploadedById: req.user!.id
      },
      include: {
        uploadedBy: { select: { id: true, name: true, role: true } }
      }
    });

    return res.status(201).json({
      message: 'Document uploaded successfully',
      document
    });
  } catch (error) {
    console.error('Upload document error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get documents for a case
router.get('/case/:caseId', authenticateToken, [
  param('caseId').isUUID()
], async (req: AuthRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { caseId } = req.params;
    const { approved, shared } = req.query;

    // Verify case access
    const caseData = await prisma.case.findUnique({
      where: { id: caseId },
      select: { id: true, judgeId: true, lawyerId: true, clientId: true }
    });

    if (!caseData) {
      return res.status(404).json({ error: 'Case not found' });
    }

    // Check access permissions
    const canAccess = 
      caseData.judgeId === req.user!.id ||
      caseData.lawyerId === req.user!.id ||
      caseData.clientId === req.user!.id;

    if (!canAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const where: any = { caseId };
    
    // Filter based on user role and query params
    if (req.user!.role === 'JUDGE') {
      where.isSharedWithJudge = true;
    } else if (req.user!.role === 'LAWYER') {
      if (approved === 'true') where.isApprovedByLawyer = true;
      if (approved === 'false') where.isApprovedByLawyer = false;
    }

    if (shared === 'true') where.isSharedWithJudge = true;
    if (shared === 'false') where.isSharedWithJudge = false;

    const documents = await prisma.document.findMany({
      where,
      include: {
        uploadedBy: { select: { id: true, name: true, role: true } }
      },
      orderBy: { uploadedAt: 'desc' }
    });

    return res.json({ documents });
  } catch (error) {
    console.error('Get documents error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Approve document (Lawyer only)
router.put('/:docId/approve', authenticateToken, requireLawyer, [
  param('docId').isUUID(),
  body('approved').isBoolean()
], async (req: AuthRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { docId } = req.params;
    const { approved } = req.body;

    // Verify document exists and lawyer has access
    const document = await prisma.document.findFirst({
      where: {
        id: docId,
        case: { lawyerId: req.user!.id }
      },
      include: { case: true }
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found or access denied' });
    }

    const updatedDocument = await prisma.document.update({
      where: { id: docId },
      data: {
        isApprovedByLawyer: approved,
        approvedAt: approved ? new Date() : null
      },
      include: {
        uploadedBy: { select: { id: true, name: true, role: true } }
      }
    });

    return res.json({
      message: `Document ${approved ? 'approved' : 'rejected'} successfully`,
      document: updatedDocument
    });
  } catch (error) {
    console.error('Approve document error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Share documents with judge (Lawyer only)
router.post('/share-with-judge', authenticateToken, requireLawyer, [
  body('documentIds').isArray(),
  body('documentIds.*').isUUID()
], async (req: AuthRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { documentIds } = req.body;

    // Verify all documents exist and are approved by the lawyer
    const documents = await prisma.document.findMany({
      where: {
        id: { in: documentIds },
        case: { lawyerId: req.user!.id },
        isApprovedByLawyer: true
      }
    });

    if (documents.length !== documentIds.length) {
      return res.status(400).json({ 
        error: 'Some documents not found or not approved' 
      });
    }

    // Update documents to be shared with judge
    const updatedDocuments = await prisma.document.updateMany({
      where: { id: { in: documentIds } },
      data: {
        isSharedWithJudge: true,
        sharedWithJudgeAt: new Date()
      }
    });

    return res.json({
      message: `${updatedDocuments.count} documents shared with judge successfully`,
      sharedCount: updatedDocuments.count
    });
  } catch (error) {
    console.error('Share documents error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get document download URL
router.get('/:docId/download', authenticateToken, [
  param('docId').isUUID()
], async (req: AuthRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { docId } = req.params;

    // Verify document access
    const document = await prisma.document.findFirst({
      where: {
        id: docId,
        OR: [
          { case: { judgeId: req.user!.id } },
          { case: { lawyerId: req.user!.id } },
          { case: { clientId: req.user!.id } }
        ]
      },
      include: { case: true }
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found or access denied' });
    }

    // Generate signed download URL
    const downloadUrl = await getSignedDownloadUrl(document.fileUrl, 3600); // 1 hour expiry

    return res.json({
      downloadUrl,
      fileName: document.fileName,
      expiresIn: 3600
    });
  } catch (error) {
    console.error('Get download URL error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete document (Client only, if not approved)
router.delete('/:docId', authenticateToken, requireClient, [
  param('docId').isUUID()
], async (req: AuthRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { docId } = req.params;

    // Verify document exists and can be deleted
    const document = await prisma.document.findFirst({
      where: {
        id: docId,
        uploadedById: req.user!.id,
        isApprovedByLawyer: false // Only allow deletion if not approved
      }
    });

    if (!document) {
      return res.status(404).json({ 
        error: 'Document not found, not uploaded by you, or already approved' 
      });
    }

    // Delete from storage
    await deleteFromStorage(document.fileUrl);

    // Delete from database
    await prisma.document.delete({
      where: { id: docId }
    });

    return res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Delete document error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Request document from client (Lawyer only)
router.post('/request/:caseId', authenticateToken, requireLawyer, [
  param('caseId').isUUID(),
  body('documentType').trim().notEmpty(),
  body('description').optional().trim()
], async (req: AuthRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { caseId } = req.params;
    const { documentType, description } = req.body;

    // Verify case exists and lawyer has access
    const caseData = await prisma.case.findUnique({
      where: { id: caseId, lawyerId: req.user!.id }
    });

    if (!caseData) {
      return res.status(404).json({ error: 'Case not found or access denied' });
    }

    // Create document request
    const documentRequest = await prisma.documentRequest.create({
      data: {
        documentType,
        description,
        caseId,
        requestedById: req.user!.id
      },
      include: {
        requestedBy: { select: { id: true, name: true } }
      }
    });

    return res.status(201).json({
      message: 'Document request created successfully',
      request: documentRequest
    });
  } catch (error) {
    console.error('Create document request error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get document requests for a case
router.get('/requests/:caseId', authenticateToken, [
  param('caseId').isUUID()
], async (req: AuthRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { caseId } = req.params;

    // Verify case access
    const caseData = await prisma.case.findUnique({
      where: { id: caseId },
      select: { id: true, judgeId: true, lawyerId: true, clientId: true }
    });

    if (!caseData) {
      return res.status(404).json({ error: 'Case not found' });
    }

    // Check access permissions
    const canAccess = 
      caseData.judgeId === req.user!.id ||
      caseData.lawyerId === req.user!.id ||
      caseData.clientId === req.user!.id;

    if (!canAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const requests = await prisma.documentRequest.findMany({
      where: { caseId },
      include: {
        requestedBy: { select: { id: true, name: true } }
      },
      orderBy: { requestedAt: 'desc' }
    });

    return res.json({ requests });
  } catch (error) {
    console.error('Get document requests error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Mark document request as completed (Client only)
router.put('/requests/:requestId/complete', authenticateToken, requireClient, [
  param('requestId').isUUID()
], async (req: AuthRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { requestId } = req.params;

    // Verify request exists and client has access
    const request = await prisma.documentRequest.findFirst({
      where: {
        id: requestId,
        case: { clientId: req.user!.id }
      },
      include: { case: true }
    });

    if (!request) {
      return res.status(404).json({ error: 'Request not found or access denied' });
    }

    const updatedRequest = await prisma.documentRequest.update({
      where: { id: requestId },
      data: {
        isCompleted: true,
        completedAt: new Date()
      },
      include: {
        requestedBy: { select: { id: true, name: true } }
      }
    });

    return res.json({
      message: 'Document request marked as completed',
      request: updatedRequest
    });
  } catch (error) {
    console.error('Complete document request error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
