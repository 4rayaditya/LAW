import express from 'express';
import { param, query, validationResult } from 'express-validator';
import { prisma } from '../index';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { AnalyticsService } from '../services/analyticsService';

const router = express.Router();

// Get dashboard analytics for user
router.get('/dashboard', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const analytics = await AnalyticsService.getDashboardAnalytics(req.user!.id, req.user!.role);

    return res.json({ analytics });
  } catch (error) {
    console.error('Get dashboard analytics error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get case performance metrics
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

    const metrics = await AnalyticsService.getCasePerformanceMetrics(caseId);

    return res.json({ metrics });
  } catch (error) {
    console.error('Get case performance metrics error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Update case analytics (internal use)
router.post('/case/:caseId/update', authenticateToken, [
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

    const analytics = await AnalyticsService.updateCaseAnalytics(caseId);

    return res.json({
      message: 'Case analytics updated successfully',
      analytics
    });
  } catch (error) {
    console.error('Update case analytics error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get historical case data for predictions
router.get('/historical-cases', authenticateToken, [
  query('type').optional().isString(),
  query('limit').optional().isInt({ min: 1, max: 100 })
], async (req: AuthRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { type, limit = 50 } = req.query;
    const where: any = {};
    
    if (type) {
      where.type = type;
    }

    const historicalCases = await prisma.historicalCase.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: Number(limit)
    });

    return res.json({ historicalCases });
  } catch (error) {
    console.error('Get historical cases error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get case complexity analysis
router.get('/case/:caseId/complexity', authenticateToken, [
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

    const complexityScore = await AnalyticsService.calculateComplexityScore(caseId);
    const riskLevel = await AnalyticsService.calculateRiskLevel(caseId);

    return res.json({
      complexityScore,
      riskLevel,
      analysis: {
        factors: {
          caseType: caseData.type,
          urgency: caseData.urgency,
          documentCount: 0, // This would be calculated from actual documents
          ipcSections: 0 // This would be calculated from actual IPC sections
        }
      }
    });
  } catch (error) {
    console.error('Get case complexity error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get case outcome prediction
router.get('/case/:caseId/prediction', authenticateToken, [
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

    const prediction = await AnalyticsService.predictCaseOutcome(caseId);

    return res.json({ prediction });
  } catch (error) {
    console.error('Get case prediction error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get system-wide analytics (Judge only)
router.get('/system', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    // Only judges can access system-wide analytics
    if (req.user!.role !== 'JUDGE') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const [
      totalCases,
      activeCases,
      closedCases,
      totalUsers,
      totalLawFirms,
      totalDocuments,
      caseAnalytics
    ] = await Promise.all([
      prisma.case.count(),
      prisma.case.count({ where: { status: 'ACTIVE' } }),
      prisma.case.count({ where: { status: 'CLOSED' } }),
      prisma.user.count(),
      prisma.lawFirm.count({ where: { isActive: true } }),
      prisma.document.count(),
      prisma.caseAnalytics.findMany({
        include: { case: { select: { id: true, caseNumber: true, title: true } } }
      })
    ]);

    // Calculate system metrics
    const successRate = caseAnalytics.length > 0 
      ? (caseAnalytics.filter(a => a.predictedOutcome === 'WON').length / caseAnalytics.length) * 100
      : 0;

    const avgComplexity = caseAnalytics.length > 0
      ? caseAnalytics.reduce((sum, a) => sum + (a.complexityScore || 0), 0) / caseAnalytics.length
      : 0;

    const highRiskCases = caseAnalytics.filter(a => a.riskLevel === 'HIGH').length;

    return res.json({
      overview: {
        totalCases,
        activeCases,
        closedCases,
        totalUsers,
        totalLawFirms,
        totalDocuments
      },
      analytics: {
        successRate: Math.round(successRate * 10) / 10,
        averageComplexity: Math.round(avgComplexity * 10) / 10,
        highRiskCases,
        predictedWins: caseAnalytics.filter(a => a.predictedOutcome === 'WON').length
      }
    });
  } catch (error) {
    console.error('Get system analytics error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
