import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { prisma } from '../index';
import { authenticateToken, AuthRequest, requireJudge } from '../middleware/auth';
import { LawFirmService } from '../services/lawFirmService';

const router = express.Router();

// Get all law firms
router.get('/', authenticateToken, [
  query('includeInactive').optional().isBoolean()
], async (req: AuthRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { includeInactive = false } = req.query;
    const lawFirms = await LawFirmService.getAllLawFirms(includeInactive === 'true');

    return res.json({ lawFirms });
  } catch (error) {
    console.error('Get law firms error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get law firm by ID
router.get('/:id', authenticateToken, [
  param('id').isUUID()
], async (req: AuthRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const lawFirm = await LawFirmService.getLawFirmById(id);

    if (!lawFirm) {
      return res.status(404).json({ error: 'Law firm not found' });
    }

    return res.json({ lawFirm });
  } catch (error) {
    console.error('Get law firm error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Create law firm (Judge only)
router.post('/', authenticateToken, requireJudge, [
  body('name').trim().notEmpty(),
  body('address').optional().trim(),
  body('phone').optional().trim(),
  body('email').optional().isEmail(),
  body('licenseNumber').optional().trim()
], async (req: AuthRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const lawFirm = await LawFirmService.createLawFirm(req.body);

    return res.status(201).json({
      message: 'Law firm created successfully',
      lawFirm
    });
  } catch (error) {
    console.error('Create law firm error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Update law firm (Judge only)
router.put('/:id', authenticateToken, requireJudge, [
  param('id').isUUID(),
  body('name').optional().trim().notEmpty(),
  body('address').optional().trim(),
  body('phone').optional().trim(),
  body('email').optional().isEmail(),
  body('licenseNumber').optional().trim(),
  body('isActive').optional().isBoolean()
], async (req: AuthRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const lawFirm = await LawFirmService.updateLawFirm(id, req.body);

    return res.json({
      message: 'Law firm updated successfully',
      lawFirm
    });
  } catch (error) {
    console.error('Update law firm error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Add member to law firm (Judge only)
router.post('/:id/members', authenticateToken, requireJudge, [
  param('id').isUUID(),
  body('userId').isUUID()
], async (req: AuthRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { userId } = req.body;

    const user = await LawFirmService.addMemberToLawFirm(id, userId);

    return res.json({
      message: 'Member added to law firm successfully',
      user
    });
  } catch (error) {
    console.error('Add member to law firm error:', error);
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    } else {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Remove member from law firm (Judge only)
router.delete('/:id/members/:userId', authenticateToken, requireJudge, [
  param('id').isUUID(),
  param('userId').isUUID()
], async (req: AuthRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId } = req.params;
    const user = await LawFirmService.removeMemberFromLawFirm(userId);

    return res.json({
      message: 'Member removed from law firm successfully',
      user
    });
  } catch (error) {
    console.error('Remove member from law firm error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get law firm members
router.get('/:id/members', authenticateToken, [
  param('id').isUUID()
], async (req: AuthRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const members = await LawFirmService.getLawFirmMembers(id);

    return res.json({ members });
  } catch (error) {
    console.error('Get law firm members error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get law firm cases
router.get('/:id/cases', authenticateToken, [
  param('id').isUUID(),
  query('status').optional().isString(),
  query('urgency').optional().isString(),
  query('type').optional().isString(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], async (req: AuthRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const filters = {
      status: req.query.status as string,
      urgency: req.query.urgency as string,
      type: req.query.type as string,
      page: req.query.page ? Number(req.query.page) : undefined,
      limit: req.query.limit ? Number(req.query.limit) : undefined
    };

    const result = await LawFirmService.getLawFirmCases(id, filters);

    return res.json(result);
  } catch (error) {
    console.error('Get law firm cases error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get law firm statistics
router.get('/:id/statistics', authenticateToken, [
  param('id').isUUID()
], async (req: AuthRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const statistics = await LawFirmService.getLawFirmStatistics(id);

    return res.json({ statistics });
  } catch (error) {
    console.error('Get law firm statistics error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Deactivate law firm (Judge only)
router.delete('/:id', authenticateToken, requireJudge, [
  param('id').isUUID()
], async (req: AuthRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const lawFirm = await LawFirmService.deactivateLawFirm(id);

    return res.json({
      message: 'Law firm deactivated successfully',
      lawFirm
    });
  } catch (error) {
    console.error('Deactivate law firm error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
