import { prisma } from '../index';
import { NotificationService } from './notificationService';

export class CaseTransferService {
  // Request case transfer
  static async requestCaseTransfer(data: {
    caseId: string;
    fromUserId: string;
    toUserId: string;
    reason: string;
    notes?: string;
  }) {
    // Verify the case exists and the user has permission to transfer it
    const caseData = await prisma.case.findUnique({
      where: { id: data.caseId },
      include: {
        lawyer: { select: { id: true, name: true } },
        client: { select: { id: true, name: true } }
      }
    });

    if (!caseData) {
      throw new Error('Case not found');
    }

    // Verify the requesting user is the current lawyer
    if (caseData.lawyerId !== data.fromUserId) {
      throw new Error('Only the assigned lawyer can request case transfer');
    }

    // Verify the target user is a lawyer
    const targetUser = await prisma.user.findUnique({
      where: { id: data.toUserId }
    });

    if (!targetUser || targetUser.role !== 'LAWYER') {
      throw new Error('Case can only be transferred to another lawyer');
    }

    // Check if there's already a pending transfer for this case
    const existingTransfer = await prisma.caseTransfer.findFirst({
      where: {
        caseId: data.caseId,
        status: 'PENDING'
      }
    });

    if (existingTransfer) {
      throw new Error('There is already a pending transfer request for this case');
    }

    // Create the transfer request
    const transfer = await prisma.caseTransfer.create({
      data: {
        caseId: data.caseId,
        fromUserId: data.fromUserId,
        toUserId: data.toUserId,
        reason: data.reason,
        notes: data.notes
      },
      include: {
        case: { select: { id: true, caseNumber: true, title: true } },
        fromUser: { select: { id: true, name: true, email: true } },
        toUser: { select: { id: true, name: true, email: true } }
      }
    });

    // Send notifications
    await NotificationService.createCaseTransferNotification(transfer.id);

    return transfer;
  }

  // Approve case transfer
  static async approveCaseTransfer(transferId: string, approvedBy: string) {
    const transfer = await prisma.caseTransfer.findUnique({
      where: { id: transferId },
      include: {
        case: true,
        fromUser: { select: { id: true, name: true } },
        toUser: { select: { id: true, name: true } }
      }
    });

    if (!transfer) {
      throw new Error('Transfer request not found');
    }

    if (transfer.status !== 'PENDING') {
      throw new Error('Transfer request is not pending');
    }

    // Verify the approver has permission (should be the receiving lawyer or a judge)
    const approver = await prisma.user.findUnique({
      where: { id: approvedBy }
    });

    if (!approver || (approver.role !== 'LAWYER' && approver.role !== 'JUDGE')) {
      throw new Error('Only lawyers or judges can approve case transfers');
    }

    if (approver.role === 'LAWYER' && transfer.toUserId !== approvedBy) {
      throw new Error('Only the receiving lawyer can approve the transfer');
    }

    // Update the transfer status
    const updatedTransfer = await prisma.caseTransfer.update({
      where: { id: transferId },
      data: {
        status: 'APPROVED',
        approvedAt: new Date()
      }
    });

    // Update the case to assign it to the new lawyer
    await prisma.case.update({
      where: { id: transfer.caseId },
      data: { lawyerId: transfer.toUserId }
    });

    // Create notifications for all parties
    await Promise.all([
      // Notify the original lawyer
      NotificationService.createNotification({
        title: 'Case Transfer Approved',
        message: `Your transfer request for case ${transfer.case.caseNumber} has been approved. The case is now assigned to ${transfer.toUser.name}.`,
        type: 'success',
        priority: 'MEDIUM',
        userId: transfer.fromUserId,
        caseId: transfer.caseId
      }),
      // Notify the new lawyer
      NotificationService.createNotification({
        title: 'Case Assigned',
        message: `You have been assigned case ${transfer.case.caseNumber}: "${transfer.case.title}" from ${transfer.fromUser.name}.`,
        type: 'info',
        priority: 'HIGH',
        userId: transfer.toUserId,
        caseId: transfer.caseId
      }),
      // Notify the client
      NotificationService.createNotification({
        title: 'Case Transfer Completed',
        message: `Your case ${transfer.case.caseNumber} has been transferred to a new lawyer: ${transfer.toUser.name}.`,
        type: 'info',
        priority: 'MEDIUM',
        userId: transfer.case.clientId,
        caseId: transfer.caseId
      })
    ]);

    return updatedTransfer;
  }

  // Reject case transfer
  static async rejectCaseTransfer(transferId: string, rejectedBy: string, reason?: string) {
    const transfer = await prisma.caseTransfer.findUnique({
      where: { id: transferId },
      include: {
        case: { select: { id: true, caseNumber: true, title: true } },
        fromUser: { select: { id: true, name: true } },
        toUser: { select: { id: true, name: true } }
      }
    });

    if (!transfer) {
      throw new Error('Transfer request not found');
    }

    if (transfer.status !== 'PENDING') {
      throw new Error('Transfer request is not pending');
    }

    // Update the transfer status
    const updatedTransfer = await prisma.caseTransfer.update({
      where: { id: transferId },
      data: {
        status: 'REJECTED',
        notes: reason ? `${transfer.notes || ''}\nRejection reason: ${reason}`.trim() : transfer.notes
      }
    });

    // Notify the original lawyer
    await NotificationService.createNotification({
      title: 'Case Transfer Rejected',
      message: `Your transfer request for case ${transfer.case.caseNumber} has been rejected.${reason ? ` Reason: ${reason}` : ''}`,
      type: 'warning',
      priority: 'MEDIUM',
      userId: transfer.fromUserId,
      caseId: transfer.caseId
    });

    return updatedTransfer;
  }

  // Get transfer requests for a user
  static async getTransferRequests(userId: string, type: 'sent' | 'received' | 'all' = 'all') {
    const where: any = {};
    
    if (type === 'sent') {
      where.fromUserId = userId;
    } else if (type === 'received') {
      where.toUserId = userId;
    } else {
      where.OR = [
        { fromUserId: userId },
        { toUserId: userId }
      ];
    }

    return await prisma.caseTransfer.findMany({
      where,
      include: {
        case: { 
          select: { 
            id: true, 
            caseNumber: true, 
            title: true,
            status: true,
            urgency: true
          } 
        },
        fromUser: { select: { id: true, name: true, email: true } },
        toUser: { select: { id: true, name: true, email: true } }
      },
      orderBy: { requestedAt: 'desc' }
    });
  }

  // Get transfer history for a case
  static async getCaseTransferHistory(caseId: string) {
    return await prisma.caseTransfer.findMany({
      where: { caseId },
      include: {
        fromUser: { select: { id: true, name: true, email: true } },
        toUser: { select: { id: true, name: true, email: true } }
      },
      orderBy: { requestedAt: 'desc' }
    });
  }

  // Get pending transfer requests for a lawyer
  static async getPendingTransferRequests(userId: string) {
    return await prisma.caseTransfer.findMany({
      where: {
        toUserId: userId,
        status: 'PENDING'
      },
      include: {
        case: { 
          select: { 
            id: true, 
            caseNumber: true, 
            title: true,
            status: true,
            urgency: true,
            hearingDate: true
          } 
        },
        fromUser: { select: { id: true, name: true, email: true, barId: true } }
      },
      orderBy: { requestedAt: 'desc' }
    });
  }

  // Cancel a pending transfer request
  static async cancelTransferRequest(transferId: string, userId: string) {
    const transfer = await prisma.caseTransfer.findUnique({
      where: { id: transferId }
    });

    if (!transfer) {
      throw new Error('Transfer request not found');
    }

    if (transfer.status !== 'PENDING') {
      throw new Error('Only pending transfer requests can be cancelled');
    }

    if (transfer.fromUserId !== userId) {
      throw new Error('Only the requesting lawyer can cancel the transfer request');
    }

    return await prisma.caseTransfer.update({
      where: { id: transferId },
      data: { status: 'REJECTED' }
    });
  }
}
