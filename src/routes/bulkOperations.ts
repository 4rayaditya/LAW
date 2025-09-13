import express from 'express';
import { body, param, validationResult } from 'express-validator';
import { prisma } from '../index';
import { authenticateToken, AuthRequest, requireLawyer, requireJudge } from '../middleware/auth';
import { BulkOperationsService } from '../services/bulkOperationsService';
import { upload } from '../utils/storage';

const router = express.Router();

// Bulk upload documents (Client only)
router.post('/documents/upload/:caseId', authenticateToken, upload.array('documents', 10), [
  param('caseId').isUUID(),
  body('documentTypes').optional().isArray()
], async (req: AuthRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { caseId } = req.params;
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    // Verify case exists and user has access
    const caseData = await prisma.case.findUnique({
      where: { id: caseId, clientId: req.user!.id }
    });

    if (!caseData) {
      return res.status(404).json({ error: 'Case not found or access denied' });
    }

    const result = await BulkOperationsService.bulkUploadDocuments(caseId, files, req.user!.id);

    return res.status(201).json({
      message: 'Bulk document upload completed',
      result
    });
  } catch (error) {
    console.error('Bulk upload documents error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Bulk approve documents (Lawyer only)
router.post('/documents/approve', authenticateToken, requireLawyer, [
  body('documentIds').isArray({ min: 1 }),
  body('documentIds.*').isUUID()
], async (req: AuthRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { documentIds } = req.body;

    // Verify all documents belong to cases where user is the lawyer
    const documents = await prisma.document.findMany({
      where: {
        id: { in: documentIds },
        case: { lawyerId: req.user!.id }
      }
    });

    if (documents.length !== documentIds.length) {
      return res.status(403).json({ error: 'Access denied to some documents' });
    }

    const result = await BulkOperationsService.bulkApproveDocuments(documentIds, req.user!.id);

    return res.json({
      message: 'Bulk document approval completed',
      result
    });
  } catch (error) {
    console.error('Bulk approve documents error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Bulk reject documents (Lawyer only)
router.post('/documents/reject', authenticateToken, requireLawyer, [
  body('documentIds').isArray({ min: 1 }),
  body('documentIds.*').isUUID(),
  body('reason').optional().trim()
], async (req: AuthRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { documentIds, reason } = req.body;

    // Verify all documents belong to cases where user is the lawyer
    const documents = await prisma.document.findMany({
      where: {
        id: { in: documentIds },
        case: { lawyerId: req.user!.id }
      }
    });

    if (documents.length !== documentIds.length) {
      return res.status(403).json({ error: 'Access denied to some documents' });
    }

    const result = await BulkOperationsService.bulkRejectDocuments(documentIds, req.user!.id, reason);

    return res.json({
      message: 'Bulk document rejection completed',
      result
    });
  } catch (error) {
    console.error('Bulk reject documents error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Bulk share documents with judge (Lawyer only)
router.post('/documents/share-with-judge', authenticateToken, requireLawyer, [
  body('documentIds').isArray({ min: 1 }),
  body('documentIds.*').isUUID()
], async (req: AuthRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { documentIds } = req.body;

    // Verify all documents belong to cases where user is the lawyer
    const documents = await prisma.document.findMany({
      where: {
        id: { in: documentIds },
        case: { lawyerId: req.user!.id }
      }
    });

    if (documents.length !== documentIds.length) {
      return res.status(403).json({ error: 'Access denied to some documents' });
    }

    const result = await BulkOperationsService.bulkShareWithJudge(documentIds, req.user!.id);

    return res.json({
      message: 'Bulk document sharing completed',
      result
    });
  } catch (error) {
    console.error('Bulk share documents error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Bulk create document requests (Lawyer only)
router.post('/document-requests/:caseId', authenticateToken, requireLawyer, [
  param('caseId').isUUID(),
  body('requests').isArray({ min: 1 }),
  body('requests.*.documentType').trim().notEmpty(),
  body('requests.*.description').optional().trim()
], async (req: AuthRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { caseId } = req.params;
    const { requests } = req.body;

    // Verify case exists and user is the lawyer
    const caseData = await prisma.case.findUnique({
      where: { id: caseId, lawyerId: req.user!.id }
    });

    if (!caseData) {
      return res.status(404).json({ error: 'Case not found or access denied' });
    }

    const result = await BulkOperationsService.bulkCreateDocumentRequests(caseId, requests, req.user!.id);

    return res.status(201).json({
      message: 'Bulk document requests created',
      result
    });
  } catch (error) {
    console.error('Bulk create document requests error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Bulk update case status (Judge only)
router.post('/cases/update-status', authenticateToken, requireJudge, [
  body('caseIds').isArray({ min: 1 }),
  body('caseIds.*').isUUID(),
  body('status').isIn(['ACTIVE', 'CLOSED', 'PENDING'])
], async (req: AuthRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { caseIds, status } = req.body;

    // Verify all cases are assigned to the judge
    const cases = await prisma.case.findMany({
      where: {
        id: { in: caseIds },
        judgeId: req.user!.id
      }
    });

    if (cases.length !== caseIds.length) {
      return res.status(403).json({ error: 'Access denied to some cases' });
    }

    const result = await BulkOperationsService.bulkUpdateCaseStatus(caseIds, status, req.user!.id);

    return res.json({
      message: 'Bulk case status update completed',
      result
    });
  } catch (error) {
    console.error('Bulk update case status error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get bulk operation status
router.get('/status/:operationId', authenticateToken, [
  param('operationId').isUUID()
], async (req: AuthRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { operationId } = req.params;
    const status = await BulkOperationsService.getBulkOperationStatus(operationId);

    return res.json({ status });
  } catch (error) {
    console.error('Get bulk operation status error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
