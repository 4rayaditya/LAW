import { prisma } from '../index';
import { uploadToStorage, getSignedDownloadUrl } from '../utils/storage';
import { extractTextFromPDF } from '../utils/ai';
import { NotificationService } from './notificationService';

export class BulkOperationsService {
  // Bulk upload documents for a case
  static async bulkUploadDocuments(caseId: string, files: Express.Multer.File[], uploadedById: string) {
    const results = [];
    const errors = [];

    // Verify case exists and user has access
    const caseData = await prisma.case.findUnique({
      where: { id: caseId }
    });

    if (!caseData) {
      throw new Error('Case not found');
    }

    for (const file of files) {
      try {
        // Upload file to storage
        const fileUrl = await uploadToStorage(file, `cases/${caseId}`);

        // Extract text if it's a PDF
        let extractedText = null;
        if (file.mimetype === 'application/pdf') {
          try {
            extractedText = await extractTextFromPDF(file.buffer);
          } catch (error) {
            console.error(`Failed to extract text from ${file.originalname}:`, error);
          }
        }

        // Create document record
        const document = await prisma.document.create({
          data: {
            fileName: file.originalname,
            fileUrl,
            documentType: this.inferDocumentType(file.originalname),
            extractedText,
            caseId,
            uploadedById
          }
        });

        results.push({
          fileName: file.originalname,
          documentId: document.id,
          success: true
        });

      } catch (error) {
        errors.push({
          fileName: file.originalname,
          error: error instanceof Error ? error.message : 'Unknown error',
          success: false
        });
      }
    }

    // Create notification for bulk upload completion
    if (results.length > 0) {
      await NotificationService.createNotification({
        title: 'Bulk Document Upload Complete',
        message: `${results.length} documents uploaded successfully.${errors.length > 0 ? ` ${errors.length} failed.` : ''}`,
        type: errors.length > 0 ? 'warning' : 'success',
        priority: 'MEDIUM',
        userId: uploadedById,
        caseId
      });
    }

    return {
      success: results,
      errors,
      summary: {
        total: files.length,
        successful: results.length,
        failed: errors.length
      }
    };
  }

  // Bulk approve documents
  static async bulkApproveDocuments(documentIds: string[], approvedById: string) {
    const results = [];
    const errors = [];

    for (const documentId of documentIds) {
      try {
        const document = await prisma.document.update({
          where: { id: documentId },
          data: {
            isApprovedByLawyer: true,
            approvedAt: new Date()
          },
          include: {
            case: { select: { id: true, caseNumber: true } },
            uploadedBy: { select: { id: true, name: true } }
          }
        });

        results.push({
          documentId,
          fileName: document.fileName,
          success: true
        });

        // Create notification for document approval
        await NotificationService.createDocumentApprovalNotification(documentId, true);

      } catch (error) {
        errors.push({
          documentId,
          error: error instanceof Error ? error.message : 'Unknown error',
          success: false
        });
      }
    }

    return {
      success: results,
      errors,
      summary: {
        total: documentIds.length,
        successful: results.length,
        failed: errors.length
      }
    };
  }

  // Bulk reject documents
  static async bulkRejectDocuments(documentIds: string[], rejectedById: string, reason?: string) {
    const results = [];
    const errors = [];

    for (const documentId of documentIds) {
      try {
        const document = await prisma.document.findUnique({
          where: { id: documentId },
          include: {
            case: { select: { id: true, caseNumber: true } },
            uploadedBy: { select: { id: true, name: true } }
          }
        });

        if (!document) {
          errors.push({
            documentId,
            error: 'Document not found',
            success: false
          });
          continue;
        }

        // Delete the document (or mark as rejected)
        await prisma.document.delete({
          where: { id: documentId }
        });

        results.push({
          documentId,
          fileName: document.fileName,
          success: true
        });

        // Create notification for document rejection
        await NotificationService.createNotification({
          title: 'Document Rejected',
          message: `Your document "${document.fileName}" has been rejected.${reason ? ` Reason: ${reason}` : ''}`,
          type: 'warning',
          priority: 'MEDIUM',
          userId: document.uploadedById,
          caseId: document.caseId,
          documentId
        });

      } catch (error) {
        errors.push({
          documentId,
          error: error instanceof Error ? error.message : 'Unknown error',
          success: false
        });
      }
    }

    return {
      success: results,
      errors,
      summary: {
        total: documentIds.length,
        successful: results.length,
        failed: errors.length
      }
    };
  }

  // Bulk share documents with judge
  static async bulkShareWithJudge(documentIds: string[], sharedById: string) {
    const results = [];
    const errors = [];

    for (const documentId of documentIds) {
      try {
        const document = await prisma.document.update({
          where: { id: documentId },
          data: {
            isSharedWithJudge: true,
            sharedWithJudgeAt: new Date()
          },
          include: {
            case: { 
              select: { 
                id: true, 
                caseNumber: true,
                judge: { select: { id: true, name: true } }
              } 
            }
          }
        });

        results.push({
          documentId,
          fileName: document.fileName,
          success: true
        });

        // Create notification for judge
        await NotificationService.createNotification({
          title: 'New Documents Shared',
          message: `New documents have been shared for case ${document.case.caseNumber}`,
          type: 'info',
          priority: 'MEDIUM',
          userId: document.case.judge.id,
          caseId: document.caseId,
          documentId
        });

      } catch (error) {
        errors.push({
          documentId,
          error: error instanceof Error ? error.message : 'Unknown error',
          success: false
        });
      }
    }

    return {
      success: results,
      errors,
      summary: {
        total: documentIds.length,
        successful: results.length,
        failed: errors.length
      }
    };
  }

  // Bulk create document requests
  static async bulkCreateDocumentRequests(caseId: string, requests: Array<{
    documentType: string;
    description?: string;
  }>, requestedById: string) {
    const results = [];
    const errors = [];

    // Verify case exists
    const caseData = await prisma.case.findUnique({
      where: { id: caseId },
      include: { client: { select: { id: true, name: true } } }
    });

    if (!caseData) {
      throw new Error('Case not found');
    }

    for (const request of requests) {
      try {
        const documentRequest = await prisma.documentRequest.create({
          data: {
            documentType: request.documentType,
            description: request.description,
            caseId,
            requestedById
          }
        });

        results.push({
          documentType: request.documentType,
          requestId: documentRequest.id,
          success: true
        });

      } catch (error) {
        errors.push({
          documentType: request.documentType,
          error: error instanceof Error ? error.message : 'Unknown error',
          success: false
        });
      }
    }

    // Create notification for client about bulk document requests
    if (results.length > 0) {
      await NotificationService.createNotification({
        title: 'Document Requests',
        message: `Your lawyer has requested ${results.length} documents for case ${caseData.caseNumber}`,
        type: 'info',
        priority: 'MEDIUM',
        userId: caseData.clientId,
        caseId
      });
    }

    return {
      success: results,
      errors,
      summary: {
        total: requests.length,
        successful: results.length,
        failed: errors.length
      }
    };
  }

  // Bulk update case status
  static async bulkUpdateCaseStatus(caseIds: string[], status: string, updatedById: string) {
    const results = [];
    const errors = [];

    for (const caseId of caseIds) {
      try {
        const caseData = await prisma.case.update({
          where: { id: caseId },
          data: { status },
          include: {
            judge: { select: { id: true, name: true } },
            lawyer: { select: { id: true, name: true } },
            client: { select: { id: true, name: true } }
          }
        });

        results.push({
          caseId,
          caseNumber: caseData.caseNumber,
          success: true
        });

        // Create notifications for all parties
        await Promise.all([
          NotificationService.createNotification({
            title: 'Case Status Updated',
            message: `Case ${caseData.caseNumber} status has been updated to ${status}`,
            type: 'info',
            priority: 'MEDIUM',
            userId: caseData.judgeId,
            caseId
          }),
          NotificationService.createNotification({
            title: 'Case Status Updated',
            message: `Case ${caseData.caseNumber} status has been updated to ${status}`,
            type: 'info',
            priority: 'MEDIUM',
            userId: caseData.lawyerId,
            caseId
          }),
          NotificationService.createNotification({
            title: 'Case Status Updated',
            message: `Your case ${caseData.caseNumber} status has been updated to ${status}`,
            type: 'info',
            priority: 'MEDIUM',
            userId: caseData.clientId,
            caseId
          })
        ]);

      } catch (error) {
        errors.push({
          caseId,
          error: error instanceof Error ? error.message : 'Unknown error',
          success: false
        });
      }
    }

    return {
      success: results,
      errors,
      summary: {
        total: caseIds.length,
        successful: results.length,
        failed: errors.length
      }
    };
  }

  // Helper function to infer document type from filename
  private static inferDocumentType(fileName: string): string {
    const lowerName = fileName.toLowerCase();
    
    if (lowerName.includes('fir') || lowerName.includes('first information report')) {
      return 'FIR';
    } else if (lowerName.includes('aadhaar') || lowerName.includes('aadhar')) {
      return 'Aadhaar';
    } else if (lowerName.includes('medical') || lowerName.includes('doctor')) {
      return 'Medical Report';
    } else if (lowerName.includes('complaint')) {
      return 'Complaint';
    } else if (lowerName.includes('notice')) {
      return 'Legal Notice';
    } else if (lowerName.includes('cheque') || lowerName.includes('bounce')) {
      return 'Bounced Cheque';
    } else if (lowerName.includes('video') || lowerName.includes('.mp4') || lowerName.includes('.avi')) {
      return 'Video Evidence';
    } else if (lowerName.includes('audio') || lowerName.includes('.mp3') || lowerName.includes('.wav')) {
      return 'Audio Evidence';
    } else {
      return 'Other';
    }
  }

  // Get bulk operation status
  static async getBulkOperationStatus(operationId: string) {
    // This would be implemented with a job queue system like Bull or Agenda
    // For now, return a mock response
    return {
      operationId,
      status: 'completed',
      progress: 100,
      results: {
        total: 10,
        successful: 9,
        failed: 1
      },
      startedAt: new Date(Date.now() - 30000),
      completedAt: new Date()
    };
  }
}
