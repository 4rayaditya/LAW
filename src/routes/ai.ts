import express from 'express';
import { body, validationResult, param } from 'express-validator';
import { prisma } from '../index';
import { authenticateToken, AuthRequest, requireLawyer } from '../middleware/auth';
import { queryDocumentsWithAI, generateCaseAnalysis, extractTextFromPDF } from '../utils/ai';
import { getFileFromStorage } from '../utils/storage';

const router = express.Router();

// AI Query endpoint (Lawyer only)
router.post('/query/:caseId', authenticateToken, requireLawyer, [
  param('caseId').isUUID(),
  body('query').trim().isLength({ min: 5 })
], async (req: AuthRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { caseId } = req.params;
    const { query } = req.body;

    // Verify case exists and lawyer has access
    const caseData = await prisma.case.findUnique({
      where: { id: caseId, lawyerId: req.user!.id }
    });

    if (!caseData) {
      return res.status(404).json({ error: 'Case not found or access denied' });
    }

    // Get all documents for the case
    const documents = await prisma.document.findMany({
      where: { caseId },
      select: {
        id: true,
        fileName: true,
        documentType: true,
        extractedText: true,
        fileUrl: true
      }
    });

    if (documents.length === 0) {
      return res.status(400).json({ 
        error: 'No documents found for this case. Please upload documents first.' 
      });
    }

    // Process documents to extract text if not already extracted
    const processedDocuments = await Promise.all(
      documents.map(async (doc) => {
        let extractedText = doc.extractedText;

        // If no extracted text, try to extract from file
        if (!extractedText && doc.fileUrl) {
          try {
            const fileBuffer = await getFileFromStorage(doc.fileUrl);
            
            // Check if it's a PDF
            if (doc.fileName.toLowerCase().endsWith('.pdf')) {
              extractedText = await extractTextFromPDF(fileBuffer);
              
              // Update the document with extracted text
              await prisma.document.update({
                where: { id: doc.id },
                data: { extractedText }
              });
            }
          } catch (error) {
            console.error(`Error extracting text from ${doc.fileName}:`, error);
            extractedText = `[Error extracting text from ${doc.fileName}]`;
          }
        }

        return {
          fileName: doc.fileName,
          documentType: doc.documentType,
          extractedText: extractedText || `[No text content available for ${doc.fileName}]`
        };
      })
    );

    // Query AI with all document text
    const aiResponse = await queryDocumentsWithAI(processedDocuments, query);

    return res.json({
      query,
      response: aiResponse,
      documentsProcessed: processedDocuments.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('AI query error:', error);
    return res.status(500).json({ error: 'Failed to process AI query' });
  }
});

// Predictive Analysis endpoint (Lawyer only)
router.get('/predict/:caseId', authenticateToken, requireLawyer, [
  param('caseId').isUUID()
], async (req: AuthRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { caseId } = req.params;

    // Verify case exists and lawyer has access
    const caseData = await prisma.case.findUnique({
      where: { id: caseId, lawyerId: req.user!.id },
      include: {
        ipcSections: {
          include: {
            ipcSection: true
          }
        },
        documents: {
          select: {
            documentType: true,
            extractedText: true
          }
        }
      }
    });

    if (!caseData) {
      return res.status(404).json({ error: 'Case not found or access denied' });
    }

    // Prepare case data for analysis
    const caseAnalysisData = {
      type: caseData.type,
      subtype: caseData.subtype,
      ipcSections: caseData.ipcSections.map(cs => ({
        sectionCode: cs.ipcSection.sectionCode,
        description: cs.ipcSection.description
      })),
      documents: caseData.documents.map(doc => ({
        documentType: doc.documentType,
        extractedText: doc.extractedText
      }))
    };

    // Generate predictive analysis
    const analysis = await generateCaseAnalysis(caseAnalysisData);

    return res.json({
      caseId,
      analysis,
      generatedAt: new Date().toISOString(),
      note: "This is a mock analysis for demonstration. In production, this would use a trained ML model."
    });
  } catch (error) {
    console.error('Predictive analysis error:', error);
    return res.status(500).json({ error: 'Failed to generate predictive analysis' });
  }
});

// Get case insights and statistics
router.get('/insights/:caseId', authenticateToken, requireLawyer, [
  param('caseId').isUUID()
], async (req: AuthRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { caseId } = req.params;

    // Verify case exists and lawyer has access
    const caseData = await prisma.case.findUnique({
      where: { id: caseId, lawyerId: req.user!.id },
      include: {
        documents: {
          select: {
            documentType: true,
            isApprovedByLawyer: true,
            isSharedWithJudge: true,
            uploadedAt: true
          }
        },
        documentRequests: {
          select: {
            isCompleted: true,
            requestedAt: true
          }
        }
      }
    });

    if (!caseData) {
      return res.status(404).json({ error: 'Case not found or access denied' });
    }

    // Calculate insights
    const totalDocuments = caseData.documents.length;
    const approvedDocuments = caseData.documents.filter(d => d.isApprovedByLawyer).length;
    const sharedDocuments = caseData.documents.filter(d => d.isSharedWithJudge).length;
    const pendingRequests = caseData.documentRequests.filter(r => !r.isCompleted).length;
    const completedRequests = caseData.documentRequests.filter(r => r.isCompleted).length;

    const documentTypes = caseData.documents.reduce((acc, doc) => {
      acc[doc.documentType] = (acc[doc.documentType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const insights = {
      caseId,
      summary: {
        totalDocuments,
        approvedDocuments,
        sharedDocuments,
        pendingRequests,
        completedRequests,
        approvalRate: totalDocuments > 0 ? Math.round((approvedDocuments / totalDocuments) * 100) : 0,
        completionRate: (pendingRequests + completedRequests) > 0 ? 
          Math.round((completedRequests / (pendingRequests + completedRequests)) * 100) : 0
      },
      documentBreakdown: documentTypes,
      timeline: {
        caseCreated: caseData.createdAt,
        lastDocumentUpload: caseData.documents.length > 0 ? 
          Math.max(...caseData.documents.map(d => d.uploadedAt.getTime())) : null,
        hearingDate: caseData.hearingDate
      },
      recommendations: [
        totalDocuments === 0 ? "Upload initial case documents" : null,
        pendingRequests > 0 ? `Complete ${pendingRequests} pending document requests` : null,
        approvedDocuments > 0 && sharedDocuments === 0 ? "Share approved documents with judge" : null,
        caseData.hearingDate && new Date(caseData.hearingDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) ? 
          "Hearing date is approaching - ensure all documents are ready" : null
      ].filter(Boolean)
    };

    return res.json(insights);
  } catch (error) {
    console.error('Get insights error:', error);
    return res.status(500).json({ error: 'Failed to generate insights' });
  }
});

// Bulk document analysis
router.post('/analyze-documents/:caseId', authenticateToken, requireLawyer, [
  param('caseId').isUUID(),
  body('analysisType').isIn(['summary', 'evidence', 'timeline', 'contradictions'])
], async (req: AuthRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { caseId } = req.params;
    const { analysisType } = req.body;

    // Verify case exists and lawyer has access
    const caseData = await prisma.case.findUnique({
      where: { id: caseId, lawyerId: req.user!.id }
    });

    if (!caseData) {
      return res.status(404).json({ error: 'Case not found or access denied' });
    }

    // Get all documents with extracted text
    const documents = await prisma.document.findMany({
      where: { 
        caseId,
        extractedText: { not: null }
      },
      select: {
        fileName: true,
        documentType: true,
        extractedText: true
      }
    });

    if (documents.length === 0) {
      return res.status(400).json({ 
        error: 'No documents with extracted text found for analysis' 
      });
    }

    // Create analysis prompt based on type
    let analysisPrompt = '';
    switch (analysisType) {
      case 'summary':
        analysisPrompt = 'Provide a comprehensive summary of all the case documents, highlighting key facts, evidence, and important details.';
        break;
      case 'evidence':
        analysisPrompt = 'Analyze all documents and identify key evidence, witness statements, and supporting materials. Categorize them by strength and relevance.';
        break;
      case 'timeline':
        analysisPrompt = 'Create a chronological timeline of events based on the information in all documents.';
        break;
      case 'contradictions':
        analysisPrompt = 'Identify any contradictions, inconsistencies, or conflicting information across the documents.';
        break;
    }

    // Process documents for AI analysis
    const processedDocuments = documents.map(doc => ({
      fileName: doc.fileName,
      documentType: doc.documentType,
      extractedText: doc.extractedText!
    }));

    const analysis = await queryDocumentsWithAI(processedDocuments, analysisPrompt);

    return res.json({
      caseId,
      analysisType,
      analysis,
      documentsAnalyzed: documents.length,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Document analysis error:', error);
    return res.status(500).json({ error: 'Failed to analyze documents' });
  }
});

export default router;
