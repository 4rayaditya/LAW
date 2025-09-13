import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { prisma } from '../index';
import { authenticateToken, AuthRequest, requireLawyer, requireJudge } from '../middleware/auth';
import { CaseTransferService } from '../services/caseTransferService';

const router = express.Router();

// Request case transfer (Lawyer only)
router.post('/request', authenticateToken, requireLawyer, [
  body('caseId').isUUID(),
  body('toUserId').isUUID(),
  body('reason').trim().notEmpty(),
  body('notes').optional().trim()
], async (req: AuthRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const transfer = await CaseTransferService.requestCaseTransfer({
      caseId: req.body.caseId,
      fromUserId: req.user!.id,
      toUserId: req.body.toUserId,
      reason: req.body.reason,
      notes: req.body.notes
    });

    return res.status(201).json({
      message: 'Case transfer request created successfully',
      transfer
    });
  } catch (error) {
    console.error('Request case transfer error:', error);
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    } else {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Approve case transfer
router.patch('/:id/approve', authenticateToken, [
  param('id').isUUID()
], async (req: AuthRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const transfer = await CaseTransferService.approveCaseTransfer(id, req.user!.id);

    return res.json({
      message: 'Case transfer approved successfully',
      transfer
    });
  } catch (error) {
    console.error('Approve case transfer error:', error);
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    } else {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Reject case transfer
router.patch('/:id/reject', authenticateToken, [
  param('id').isUUID(),
  body('reason').optional().trim()
], async (req: AuthRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { reason } = req.body;
    const transfer = await CaseTransferService.rejectCaseTransfer(id, req.user!.id, reason);

    return res.json({
      message: 'Case transfer rejected successfully',
      transfer
    });
  } catch (error) {
    console.error('Reject case transfer error:', error);
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    } else {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Cancel transfer request (Lawyer only)
router.patch('/:id/cancel', authenticateToken, requireLawyer, [
  param('id').isUUID()
], async (req: AuthRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const transfer = await CaseTransferService.cancelTransferRequest(id, req.user!.id);

    return res.json({
      message: 'Transfer request cancelled successfully',
      transfer
    });
  } catch (error) {
    console.error('Cancel transfer request error:', error);
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    } else {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Get transfer requests for user
router.get('/my-requests', authenticateToken, [
  query('type').optional().isIn(['sent', 'received', 'all'])
], async (req: AuthRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { type = 'all' } = req.query;
    const transfers = await CaseTransferService.getTransferRequests(req.user!.id, type as any);

    return res.json({ transfers });
  } catch (error) {
    console.error('Get transfer requests error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get pending transfer requests for user
router.get('/pending', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const transfers = await CaseTransferService.getPendingTransferRequests(req.user!.id);

    return res.json({ transfers });
  } catch (error) {
    console.error('Get pending transfer requests error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get case transfer history
router.get('/case/:caseId', authenticateToken, [
  param('caseId').isUUID()
], async (req: AuthRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { caseId } = req.params;

    // Verify user has access to this case
    const caseData = await prisma.case.findFirst({
      where: {
        id: caseId,
        OR: [
          { judgeId: req.user!.id },
          { lawyerId: req.user!.id },
          { clientId: req.user!.id }
        ]
      }
    });

    if (!caseData) {
      return res.status(404).json({ error: 'Case not found or access denied' });
    }

    const transfers = await CaseTransferService.getCaseTransferHistory(caseId);

    return res.json({ transfers });
  } catch (error) {
    console.error('Get case transfer history error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get transfer by ID
router.get('/:id', authenticateToken, [
  param('id').isUUID()
], async (req: AuthRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const transfer = await prisma.caseTransfer.findUnique({
      where: { id },
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
        fromUser: { select: { id: true, name: true, email: true, barId: true } },
        toUser: { select: { id: true, name: true, email: true, barId: true } }
      }
    });

    if (!transfer) {
      return res.status(404).json({ error: 'Transfer request not found' });
    }

    // Verify user has access to this transfer
    if (transfer.fromUserId !== req.user!.id && transfer.toUserId !== req.user!.id) {
      // Check if user is judge or client of the case
      const caseData = await prisma.case.findFirst({
        where: {
          id: transfer.caseId,
          OR: [
            { judgeId: req.user!.id },
            { clientId: req.user!.id }
          ]
        }
      });

      if (!caseData) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    return res.json({ transfer });
  } catch (error) {
    console.error('Get transfer error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get available lawyers for transfer (excluding current lawyer)
router.get('/available-lawyers/:caseId', authenticateToken, [
  param('caseId').isUUID()
], async (req: AuthRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { caseId } = req.params;

    // Get current case to find current lawyer
    const caseData = await prisma.case.findUnique({
      where: { id: caseId },
      select: { lawyerId: true }
    });

    if (!caseData) {
      return res.status(404).json({ error: 'Case not found' });
    }

    // Get all active lawyers except the current one
    const lawyers = await prisma.user.findMany({
      where: {
        role: 'LAWYER',
        isActive: true,
        id: { not: caseData.lawyerId }
      },
      select: {
        id: true,
        name: true,
        email: true,
        barId: true,
        lawFirm: { select: { id: true, name: true } }
      },
      orderBy: { name: 'asc' }
    });

    return res.json({ lawyers });
  } catch (error) {
    console.error('Get available lawyers error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
