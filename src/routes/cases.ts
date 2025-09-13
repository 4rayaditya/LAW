import express from 'express';
import { body, validationResult, param } from 'express-validator';
import { prisma } from '../index';
import { authenticateToken, AuthRequest, requireLawyer, requireJudge, requireLawyerOrJudge } from '../middleware/auth';

const router = express.Router();

// Create a new case (Lawyer only)
router.post('/', authenticateToken, requireLawyer, [
  body('title').trim().isLength({ min: 5 }),
  body('type').trim().notEmpty(),
  body('subtype').trim().notEmpty(),
  body('clientId').isUUID(),
  body('judgeId').isUUID(),
  body('urgency').isIn(['HIGH', 'MEDIUM', 'LOW']),
  body('hearingDate').optional().isISO8601(),
  body('description').optional().trim(),
  body('ipcSections').optional().isArray(),
  body('ipcSections.*.sectionCode').optional().trim(),
  body('ipcSections.*.description').optional().trim()
], async (req: AuthRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      type,
      subtype,
      clientId,
      judgeId,
      urgency,
      hearingDate,
      description,
      ipcSections = []
    } = req.body;

    // Verify client and judge exist
    const [client, judge] = await Promise.all([
      prisma.user.findUnique({ where: { id: clientId, role: 'CLIENT' } }),
      prisma.user.findUnique({ where: { id: judgeId, role: 'JUDGE' } })
    ]);

    if (!client) {
      return res.status(400).json({ error: 'Client not found' });
    }

    if (!judge) {
      return res.status(400).json({ error: 'Judge not found' });
    }

    // Generate case number
    const caseCount = await prisma.case.count();
    const caseNumber = `CASE-${new Date().getFullYear()}-${String(caseCount + 1).padStart(6, '0')}`;

    // Create case with IPC sections
    const caseData = await prisma.case.create({
      data: {
        caseNumber,
        title,
        type,
        subtype,
        urgency: urgency as 'HIGH' | 'MEDIUM' | 'LOW',
        hearingDate: hearingDate ? new Date(hearingDate) : null,
        description,
        judgeId,
        lawyerId: req.user!.id,
        clientId,
        ipcSections: {
          create: ipcSections.map((section: any) => ({
            ipcSection: {
              connectOrCreate: {
                where: { sectionCode: section.sectionCode },
                create: {
                  sectionCode: section.sectionCode,
                  description: section.description || `IPC Section ${section.sectionCode}`
                }
              }
            }
          }))
        }
      },
      include: {
        judge: { select: { id: true, name: true, email: true } },
        lawyer: { select: { id: true, name: true, email: true, barId: true } },
        client: { select: { id: true, name: true, email: true } },
        ipcSections: {
          include: {
            ipcSection: true
          }
        }
      }
    });

    return res.status(201).json({
      message: 'Case created successfully',
      case: caseData
    });
  } catch (error) {
    console.error('Create case error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get cases for a lawyer
router.get('/lawyer/:id', authenticateToken, [
  param('id').isUUID()
], async (req: AuthRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { status, urgency, type, page = 1, limit = 10 } = req.query;

    // Check if user can access this lawyer's cases
    if (req.user!.role !== 'LAWYER' && req.user!.id !== id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const where: any = { lawyerId: id };
    
    if (status) where.status = status;
    if (urgency) where.urgency = urgency;
    if (type) where.type = type;

    const [cases, total] = await Promise.all([
      prisma.case.findMany({
        where,
        include: {
          judge: { select: { id: true, name: true } },
          client: { select: { id: true, name: true } },
          ipcSections: {
            include: {
              ipcSection: true
            }
          },
          _count: {
            select: {
              documents: true,
              documentRequests: true
            }
          }
        },
        orderBy: [
          { urgency: 'desc' },
          { hearingDate: 'asc' },
          { createdAt: 'desc' }
        ],
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit)
      }),
      prisma.case.count({ where })
    ]);

    return res.json({
      cases,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get lawyer cases error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get cases for a client
router.get('/client/:id', authenticateToken, [
  param('id').isUUID()
], async (req: AuthRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;

    // Check if user can access this client's cases
    if (req.user!.role !== 'CLIENT' && req.user!.id !== id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const cases = await prisma.case.findMany({
      where: { clientId: id },
      include: {
        judge: { select: { id: true, name: true } },
        lawyer: { select: { id: true, name: true, barId: true } },
        ipcSections: {
          include: {
            ipcSection: true
          }
        },
        documentRequests: {
          where: { isCompleted: false },
          orderBy: { requestedAt: 'desc' }
        },
        _count: {
          select: {
            documents: true
          }
        }
      },
      orderBy: [
        { urgency: 'desc' },
        { hearingDate: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    return res.json({ cases });
  } catch (error) {
    console.error('Get client cases error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get cases for a judge
router.get('/judge/:id', authenticateToken, requireJudge, [
  param('id').isUUID()
], async (req: AuthRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { status, urgency, type, page = 1, limit = 10 } = req.query;

    const where: any = { judgeId: id };
    
    if (status) where.status = status;
    if (urgency) where.urgency = urgency;
    if (type) where.type = type;

    const [cases, total] = await Promise.all([
      prisma.case.findMany({
        where,
        include: {
          lawyer: { select: { id: true, name: true, barId: true } },
          client: { select: { id: true, name: true } },
          ipcSections: {
            include: {
              ipcSection: true
            }
          },
          documents: {
            where: { isSharedWithJudge: true },
            select: { id: true, fileName: true, documentType: true, sharedWithJudgeAt: true }
          },
          _count: {
            select: {
              documents: {
                where: { isSharedWithJudge: true }
              }
            }
          }
        },
        orderBy: [
          { urgency: 'desc' },
          { hearingDate: 'asc' },
          { createdAt: 'desc' }
        ],
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit)
      }),
      prisma.case.count({ where })
    ]);

    return res.json({
      cases,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get judge cases error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get case details
router.get('/:id', authenticateToken, [
  param('id').isUUID()
], async (req: AuthRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;

    const caseData = await prisma.case.findUnique({
      where: { id },
      include: {
        judge: { select: { id: true, name: true, email: true, courtId: true } },
        lawyer: { select: { id: true, name: true, email: true, barId: true } },
        client: { select: { id: true, name: true, email: true } },
        ipcSections: {
          include: {
            ipcSection: true
          }
        },
        documents: {
          include: {
            uploadedBy: { select: { id: true, name: true, role: true } }
          },
          orderBy: { uploadedAt: 'desc' }
        },
        documentRequests: {
          include: {
            requestedBy: { select: { id: true, name: true } }
          },
          orderBy: { requestedAt: 'desc' }
        }
      }
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

    return res.json({ case: caseData });
  } catch (error) {
    console.error('Get case details error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Update case status (Judge only)
router.put('/:id/status', authenticateToken, requireJudge, [
  param('id').isUUID(),
  body('status').isIn(['ACTIVE', 'CLOSED', 'PENDING'])
], async (req: AuthRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { status } = req.body;

    const caseData = await prisma.case.findUnique({
      where: { id, judgeId: req.user!.id }
    });

    if (!caseData) {
      return res.status(404).json({ error: 'Case not found or access denied' });
    }

    const updatedCase = await prisma.case.update({
      where: { id },
      data: { status: status as 'ACTIVE' | 'CLOSED' | 'PENDING' },
      include: {
        judge: { select: { id: true, name: true } },
        lawyer: { select: { id: true, name: true, barId: true } },
        client: { select: { id: true, name: true } }
      }
    });

    return res.json({
      message: 'Case status updated successfully',
      case: updatedCase
    });
  } catch (error) {
    console.error('Update case status error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all users for case assignment
router.get('/users/available', authenticateToken, requireLawyerOrJudge, async (req: AuthRequest, res: express.Response) => {
  try {
    const { role, search } = req.query;

    const where: any = {};
    if (role) where.role = role;
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        barId: true,
        courtId: true
      },
      orderBy: { name: 'asc' }
    });

    res.json({ users });
  } catch (error) {
    console.error('Get available users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
