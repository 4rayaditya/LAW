import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { prisma } from '../index';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { NotificationService } from '../services/notificationService';

const router = express.Router();

// Get user notifications
router.get('/', authenticateToken, [
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('unreadOnly').optional().isBoolean()
], async (req: AuthRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { limit = 50, unreadOnly = false } = req.query;
    const where: any = { userId: req.user!.id };
    
    if (unreadOnly === 'true') {
      where.isRead = false;
    }

    const notifications = await prisma.notification.findMany({
      where,
      include: {
        case: { select: { id: true, caseNumber: true, title: true } },
        document: { select: { id: true, fileName: true } }
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' }
      ],
      take: Number(limit)
    });

    const unreadCount = await NotificationService.getUnreadCount(req.user!.id);

    return res.json({
      notifications,
      unreadCount,
      total: notifications.length
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Mark notification as read
router.patch('/:id/read', authenticateToken, [
  param('id').isUUID()
], async (req: AuthRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;

    // Verify notification belongs to user
    const notification = await prisma.notification.findFirst({
      where: { id, userId: req.user!.id }
    });

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    const updatedNotification = await NotificationService.markAsRead(id);

    return res.json({
      message: 'Notification marked as read',
      notification: updatedNotification
    });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Mark all notifications as read
router.patch('/mark-all-read', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const result = await NotificationService.markAllAsRead(req.user!.id);

    return res.json({
      message: 'All notifications marked as read',
      updatedCount: result.count
    });
  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get unread count
router.get('/unread-count', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const count = await NotificationService.getUnreadCount(req.user!.id);

    return res.json({ unreadCount: count });
  } catch (error) {
    console.error('Get unread count error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Create notification (admin only)
router.post('/', authenticateToken, [
  body('title').trim().notEmpty(),
  body('message').trim().notEmpty(),
  body('type').isIn(['reminder', 'alert', 'info', 'success', 'warning']),
  body('priority').isIn(['HIGH', 'MEDIUM', 'LOW']),
  body('userId').isUUID(),
  body('caseId').optional().isUUID(),
  body('documentId').optional().isUUID(),
  body('scheduledAt').optional().isISO8601()
], async (req: AuthRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Only allow judges to create notifications
    if (req.user!.role !== 'JUDGE') {
      return res.status(403).json({ error: 'Only judges can create notifications' });
    }

    const notification = await NotificationService.createNotification(req.body);

    return res.status(201).json({
      message: 'Notification created successfully',
      notification
    });
  } catch (error) {
    console.error('Create notification error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete notification
router.delete('/:id', authenticateToken, [
  param('id').isUUID()
], async (req: AuthRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;

    // Verify notification belongs to user
    const notification = await prisma.notification.findFirst({
      where: { id, userId: req.user!.id }
    });

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    await prisma.notification.delete({
      where: { id }
    });

    return res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Delete notification error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Process scheduled notifications (cron job endpoint)
router.post('/process-scheduled', async (req: express.Request, res: express.Response) => {
  try {
    // This endpoint should be protected with a secret key in production
    const processedCount = await NotificationService.processScheduledNotifications();

    return res.json({
      message: 'Scheduled notifications processed',
      processedCount
    });
  } catch (error) {
    console.error('Process scheduled notifications error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
