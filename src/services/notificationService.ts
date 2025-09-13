import { prisma } from '../index';
import { sendEmail, sendSMS } from './communicationService';

export interface NotificationData {
  title: string;
  message: string;
  type: 'reminder' | 'alert' | 'info' | 'success' | 'warning';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  userId: string;
  caseId?: string;
  documentId?: string;
  scheduledAt?: Date;
}

export class NotificationService {
  // Create a notification
  static async createNotification(data: NotificationData) {
    return await prisma.notification.create({
      data: {
        title: data.title,
        message: data.message,
        type: data.type,
        priority: data.priority,
        userId: data.userId,
        caseId: data.caseId,
        documentId: data.documentId,
        scheduledAt: data.scheduledAt,
      },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        case: { select: { id: true, caseNumber: true, title: true } },
        document: { select: { id: true, fileName: true } }
      }
    });
  }

  // Create hearing date reminder
  static async createHearingReminder(caseId: string, hearingDate: Date, reminderDays: number[] = [7, 3, 1]) {
    const caseData = await prisma.case.findUnique({
      where: { id: caseId },
      include: {
        judge: { select: { id: true, name: true, email: true, phone: true } },
        lawyer: { select: { id: true, name: true, email: true, phone: true } },
        client: { select: { id: true, name: true, email: true, phone: true } }
      }
    });

    if (!caseData) return;

    const notifications = [];

    for (const days of reminderDays) {
      const reminderDate = new Date(hearingDate);
      reminderDate.setDate(reminderDate.getDate() - days);

      // Create reminder for judge
      notifications.push({
        title: `Hearing Reminder - ${days} day${days > 1 ? 's' : ''} notice`,
        message: `Case ${caseData.caseNumber}: "${caseData.title}" hearing scheduled for ${hearingDate.toLocaleDateString()}`,
        type: 'reminder' as const,
        priority: days === 1 ? 'HIGH' as const : 'MEDIUM' as const,
        userId: caseData.judgeId,
        caseId: caseId,
        scheduledAt: reminderDate
      });

      // Create reminder for lawyer
      notifications.push({
        title: `Hearing Reminder - ${days} day${days > 1 ? 's' : ''} notice`,
        message: `Case ${caseData.caseNumber}: "${caseData.title}" hearing scheduled for ${hearingDate.toLocaleDateString()}`,
        type: 'reminder' as const,
        priority: days === 1 ? 'HIGH' as const : 'MEDIUM' as const,
        userId: caseData.lawyerId,
        caseId: caseId,
        scheduledAt: reminderDate
      });

      // Create reminder for client
      notifications.push({
        title: `Hearing Reminder - ${days} day${days > 1 ? 's' : ''} notice`,
        message: `Your case ${caseData.caseNumber}: "${caseData.title}" hearing is scheduled for ${hearingDate.toLocaleDateString()}`,
        type: 'reminder' as const,
        priority: days === 1 ? 'HIGH' as const : 'MEDIUM' as const,
        userId: caseData.clientId,
        caseId: caseId,
        scheduledAt: reminderDate
      });
    }

    return await prisma.notification.createMany({
      data: notifications
    });
  }

  // Create document approval notification
  static async createDocumentApprovalNotification(documentId: string, approved: boolean) {
    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: {
        case: {
          include: {
            client: { select: { id: true, name: true, email: true, phone: true } },
            lawyer: { select: { id: true, name: true, email: true, phone: true } }
          }
        },
        uploadedBy: { select: { id: true, name: true, email: true, phone: true } }
      }
    });

    if (!document) return;

    const status = approved ? 'approved' : 'rejected';
    const message = approved 
      ? `Your document "${document.fileName}" has been approved by your lawyer.`
      : `Your document "${document.fileName}" has been rejected by your lawyer. Please review and resubmit.`;

    return await this.createNotification({
      title: `Document ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      message,
      type: approved ? 'success' : 'warning',
      priority: 'MEDIUM',
      userId: document.uploadedById,
      caseId: document.caseId,
      documentId: documentId
    });
  }

  // Create case transfer notification
  static async createCaseTransferNotification(transferId: string) {
    const transfer = await prisma.caseTransfer.findUnique({
      where: { id: transferId },
      include: {
        case: { select: { id: true, caseNumber: true, title: true } },
        fromUser: { select: { id: true, name: true, email: true, phone: true } },
        toUser: { select: { id: true, name: true, email: true, phone: true } }
      }
    });

    if (!transfer) return;

    // Notify the receiving lawyer
    await this.createNotification({
      title: 'Case Transfer Request',
      message: `You have received a case transfer request for case ${transfer.case.caseNumber}: "${transfer.case.title}" from ${transfer.fromUser.name}`,
      type: 'info',
      priority: 'HIGH',
      userId: transfer.toUserId,
      caseId: transfer.caseId
    });

    // Notify the client about the transfer
    const caseData = await prisma.case.findUnique({
      where: { id: transfer.caseId },
      include: { client: true }
    });

    if (caseData) {
      await this.createNotification({
        title: 'Case Transfer Notification',
        message: `Your case ${transfer.case.caseNumber}: "${transfer.case.title}" is being transferred to a new lawyer.`,
        type: 'info',
        priority: 'MEDIUM',
        userId: caseData.clientId,
        caseId: transfer.caseId
      });
    }
  }

  // Get user notifications
  static async getUserNotifications(userId: string, limit: number = 50) {
    return await prisma.notification.findMany({
      where: { userId },
      include: {
        case: { select: { id: true, caseNumber: true, title: true } },
        document: { select: { id: true, fileName: true } }
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' }
      ],
      take: limit
    });
  }

  // Mark notification as read
  static async markAsRead(notificationId: string) {
    return await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true }
    });
  }

  // Mark all notifications as read for a user
  static async markAllAsRead(userId: string) {
    return await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true }
    });
  }

  // Get unread notification count
  static async getUnreadCount(userId: string) {
    return await prisma.notification.count({
      where: { userId, isRead: false }
    });
  }

  // Process scheduled notifications (to be called by a cron job)
  static async processScheduledNotifications() {
    const now = new Date();
    const scheduledNotifications = await prisma.notification.findMany({
      where: {
        scheduledAt: { lte: now },
        sentAt: null
      },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        case: { select: { id: true, caseNumber: true, title: true } }
      }
    });

    for (const notification of scheduledNotifications) {
      try {
        // Send email notification
        if (notification.user.email) {
          await sendEmail({
            to: notification.user.email,
            subject: notification.title,
            body: notification.message
          });
        }

        // Send SMS notification for high priority
        if (notification.priority === 'HIGH' && notification.user.phone) {
          await sendSMS({
            to: notification.user.phone,
            message: `${notification.title}: ${notification.message}`
          });
        }

        // Mark as sent
        await prisma.notification.update({
          where: { id: notification.id },
          data: { sentAt: now }
        });

      } catch (error) {
        console.error(`Failed to send notification ${notification.id}:`, error);
      }
    }

    return scheduledNotifications.length;
  }

  // Delete old notifications (cleanup)
  static async cleanupOldNotifications(daysOld: number = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    return await prisma.notification.deleteMany({
      where: {
        createdAt: { lt: cutoffDate },
        isRead: true
      }
    });
  }
}
