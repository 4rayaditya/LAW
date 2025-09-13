import express from 'express';
import { body, validationResult, param } from 'express-validator';
import { prisma } from '../index';
import { authenticateToken, AuthRequest, requireJudge, requireLawyer } from '../middleware/auth';

const router = express.Router();

// Get all users (Judge and Lawyer only)
router.get('/', authenticateToken, [
  // Allow both judges and lawyers to view users
], async (req: AuthRequest, res: express.Response) => {
  try {
    // Check if user has permission to view all users
    if (req.user!.role !== 'JUDGE' && req.user!.role !== 'LAWYER') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { role, search, page = 1, limit = 20 } = req.query;

    const where: any = {};
    if (role) where.role = role;
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } },
        { barId: { contains: search as string, mode: 'insensitive' } },
        { courtId: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          barId: true,
          courtId: true,
          createdAt: true,
          _count: {
            select: {
              casesAsJudge: true,
              casesAsLawyer: true,
              casesAsClient: true
            }
          }
        },
        orderBy: { name: 'asc' },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit)
      }),
      prisma.user.count({ where })
    ]);

    return res.json({
      users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user by ID
router.get('/:id', authenticateToken, [
  param('id').isUUID()
], async (req: AuthRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;

    // Check if user can access this profile
    if (req.user!.id !== id && req.user!.role !== 'JUDGE' && req.user!.role !== 'LAWYER') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        barId: true,
        courtId: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            casesAsJudge: true,
            casesAsLawyer: true,
            casesAsClient: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Create user (Judge only - for creating lawyers and other judges)
router.post('/', authenticateToken, requireJudge, [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().isLength({ min: 2 }),
  body('role').isIn(['JUDGE', 'LAWYER']),
  body('barId').optional().trim(),
  body('courtId').optional().trim()
], async (req: AuthRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, name, role, barId, courtId } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role as 'JUDGE' | 'LAWYER',
        barId: barId || null,
        courtId: courtId || null
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        barId: true,
        courtId: true,
        createdAt: true
      }
    });

    return res.status(201).json({
      message: 'User created successfully',
      user
    });
  } catch (error) {
    console.error('Create user error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user (Judge only)
router.put('/:id', authenticateToken, requireJudge, [
  param('id').isUUID(),
  body('name').optional().trim().isLength({ min: 2 }),
  body('barId').optional().trim(),
  body('courtId').optional().trim(),
  body('role').optional().isIn(['JUDGE', 'LAWYER', 'CLIENT'])
], async (req: AuthRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, barId, courtId, role } = req.body;

    const updateData: any = {};
    if (name) updateData.name = name;
    if (barId !== undefined) updateData.barId = barId;
    if (courtId !== undefined) updateData.courtId = courtId;
    if (role) updateData.role = role;

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        barId: true,
        courtId: true,
        updatedAt: true
      }
    });

    return res.json({
      message: 'User updated successfully',
      user
    });
  } catch (error) {
    console.error('Update user error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user statistics
router.get('/:id/stats', authenticateToken, [
  param('id').isUUID()
], async (req: AuthRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;

    // Check if user can access this data
    if (req.user!.id !== id && req.user!.role !== 'JUDGE' && req.user!.role !== 'LAWYER') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: { role: true }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let stats: any = {};

    if (user.role === 'JUDGE') {
      const [totalCases, activeCases, closedCases, pendingCases] = await Promise.all([
        prisma.case.count({ where: { judgeId: id } }),
        prisma.case.count({ where: { judgeId: id, status: 'ACTIVE' } }),
        prisma.case.count({ where: { judgeId: id, status: 'CLOSED' } }),
        prisma.case.count({ where: { judgeId: id, status: 'PENDING' } })
      ]);

      stats = {
        totalCases,
        activeCases,
        closedCases,
        pendingCases
      };
    } else if (user.role === 'LAWYER') {
      const [totalCases, activeCases, closedCases, totalDocuments, approvedDocuments] = await Promise.all([
        prisma.case.count({ where: { lawyerId: id } }),
        prisma.case.count({ where: { lawyerId: id, status: 'ACTIVE' } }),
        prisma.case.count({ where: { lawyerId: id, status: 'CLOSED' } }),
        prisma.document.count({ where: { case: { lawyerId: id } } }),
        prisma.document.count({ where: { case: { lawyerId: id }, isApprovedByLawyer: true } })
      ]);

      stats = {
        totalCases,
        activeCases,
        closedCases,
        totalDocuments,
        approvedDocuments,
        approvalRate: totalDocuments > 0 ? Math.round((approvedDocuments / totalDocuments) * 100) : 0
      };
    } else if (user.role === 'CLIENT') {
      const [totalCases, activeCases, closedCases, totalDocuments, pendingRequests] = await Promise.all([
        prisma.case.count({ where: { clientId: id } }),
        prisma.case.count({ where: { clientId: id, status: 'ACTIVE' } }),
        prisma.case.count({ where: { clientId: id, status: 'CLOSED' } }),
        prisma.document.count({ where: { case: { clientId: id } } }),
        prisma.documentRequest.count({ where: { case: { clientId: id }, isCompleted: false } })
      ]);

      stats = {
        totalCases,
        activeCases,
        closedCases,
        totalDocuments,
        pendingRequests
      };
    }

    return res.json({ userId: id, stats });
  } catch (error) {
    console.error('Get user stats error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's recent activity
router.get('/:id/activity', authenticateToken, [
  param('id').isUUID()
], async (req: AuthRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { limit = 10 } = req.query;

    // Check if user can access this data
    if (req.user!.id !== id && req.user!.role !== 'JUDGE' && req.user!.role !== 'LAWYER') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: { role: true }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let activities: any[] = [];

    if (user.role === 'LAWYER') {
      // Get recent cases, documents, and requests
      const [recentCases, recentDocuments, recentRequests] = await Promise.all([
        prisma.case.findMany({
          where: { lawyerId: id },
          select: {
            id: true,
            caseNumber: true,
            title: true,
            createdAt: true,
            type: true
          },
          orderBy: { createdAt: 'desc' },
          take: Number(limit)
        }),
        prisma.document.findMany({
          where: { case: { lawyerId: id } },
          select: {
            id: true,
            fileName: true,
            documentType: true,
            uploadedAt: true,
            isApprovedByLawyer: true,
            case: { select: { caseNumber: true, title: true } }
          },
          orderBy: { uploadedAt: 'desc' },
          take: Number(limit)
        }),
        prisma.documentRequest.findMany({
          where: { requestedById: id },
          select: {
            id: true,
            documentType: true,
            requestedAt: true,
            isCompleted: true,
            case: { select: { caseNumber: true, title: true } }
          },
          orderBy: { requestedAt: 'desc' },
          take: Number(limit)
        })
      ]);

      activities = [
        ...recentCases.map(c => ({ type: 'case_created', data: c, timestamp: c.createdAt })),
        ...recentDocuments.map(d => ({ type: 'document_uploaded', data: d, timestamp: d.uploadedAt })),
        ...recentRequests.map(r => ({ type: 'document_requested', data: r, timestamp: r.requestedAt }))
      ];
    } else if (user.role === 'CLIENT') {
      // Get recent cases and documents
      const [recentCases, recentDocuments] = await Promise.all([
        prisma.case.findMany({
          where: { clientId: id },
          select: {
            id: true,
            caseNumber: true,
            title: true,
            createdAt: true,
            type: true
          },
          orderBy: { createdAt: 'desc' },
          take: Number(limit)
        }),
        prisma.document.findMany({
          where: { uploadedById: id },
          select: {
            id: true,
            fileName: true,
            documentType: true,
            uploadedAt: true,
            isApprovedByLawyer: true,
            case: { select: { caseNumber: true, title: true } }
          },
          orderBy: { uploadedAt: 'desc' },
          take: Number(limit)
        })
      ]);

      activities = [
        ...recentCases.map(c => ({ type: 'case_assigned', data: c, timestamp: c.createdAt })),
        ...recentDocuments.map(d => ({ type: 'document_uploaded', data: d, timestamp: d.uploadedAt }))
      ];
    }

    // Sort by timestamp and limit
    activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    activities = activities.slice(0, Number(limit));

    return res.json({ userId: id, activities });
  } catch (error) {
    console.error('Get user activity error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
