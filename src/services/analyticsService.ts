import { prisma } from '../index';
import { generateCaseAnalysis } from '../utils/ai';

export class AnalyticsService {
  // Calculate case complexity score based on various factors
  static async calculateComplexityScore(caseId: string): Promise<number> {
    const caseData = await prisma.case.findUnique({
      where: { id: caseId },
      include: {
        documents: true,
        ipcSections: { include: { ipcSection: true } },
        documentRequests: true,
        _count: {
          select: {
            documents: true,
            documentRequests: true
          }
        }
      }
    });

    if (!caseData) return 0;

    let complexityScore = 0;

    // Base complexity from case type
    const typeComplexity = {
      'MURDER': 9,
      'RAPE': 8,
      'FRAUD': 7,
      'THEFT': 5,
      'ASSAULT': 6,
      'DIVORCE': 4,
      'PROPERTY': 5,
      'CONTRACT': 6,
      'OTHER': 3
    };
    complexityScore += typeComplexity[caseData.type as keyof typeof typeComplexity] || 3;

    // Add complexity based on number of IPC sections
    complexityScore += Math.min(caseData.ipcSections.length * 0.5, 3);

    // Add complexity based on number of documents
    complexityScore += Math.min(caseData._count.documents * 0.2, 2);

    // Add complexity based on urgency
    const urgencyMultiplier = {
      'HIGH': 1.5,
      'MEDIUM': 1.0,
      'LOW': 0.8
    };
    complexityScore *= urgencyMultiplier[caseData.urgency as keyof typeof urgencyMultiplier] || 1.0;

    return Math.min(Math.round(complexityScore * 10) / 10, 10);
  }

  // Calculate risk level based on case factors
  static async calculateRiskLevel(caseId: string): Promise<'LOW' | 'MEDIUM' | 'HIGH'> {
    const complexityScore = await this.calculateComplexityScore(caseId);
    
    if (complexityScore >= 7) return 'HIGH';
    if (complexityScore >= 4) return 'MEDIUM';
    return 'LOW';
  }

  // Predict case outcome using AI and historical data
  static async predictCaseOutcome(caseId: string): Promise<{ outcome: string; confidence: number }> {
    try {
      const caseData = await prisma.case.findUnique({
        where: { id: caseId },
        include: {
          documents: { where: { extractedText: { not: null } } },
          ipcSections: { include: { ipcSection: true } },
          judge: { select: { name: true } },
          lawyer: { select: { name: true } }
        }
      });

      if (!caseData) {
        return { outcome: 'UNKNOWN', confidence: 0 };
      }

      // Get similar historical cases
      const similarCases = await this.getSimilarHistoricalCases(caseData);
      
      // Prepare context for AI analysis
      const context = {
        caseType: caseData.type,
        caseSubtype: caseData.subtype,
        urgency: caseData.urgency,
        ipcSections: caseData.ipcSections.map(s => s.ipcSection.sectionCode),
        documentCount: caseData.documents.length,
        similarCases: similarCases.slice(0, 5) // Top 5 similar cases
      };

      // Use AI to predict outcome
      const prompt = `Based on the following case data and similar historical cases, predict the most likely outcome:

Case Data:
- Type: ${context.caseType} (${context.caseSubtype})
- Urgency: ${context.urgency}
- IPC Sections: ${context.ipcSections.join(', ')}
- Documents: ${context.documentCount}

Similar Historical Cases:
${similarCases.map(c => `- ${c.caseNumber}: ${c.type} -> ${c.outcome} (${c.duration} days)`).join('\n')}

Predict the outcome as one of: WON, LOST, SETTLED, DISMISSED
Also provide a confidence score (0-1) for your prediction.

Format your response as: OUTCOME: [prediction] CONFIDENCE: [score]`;

      // Prepare case data for analysis
      const analysisData = {
        type: context.caseType,
        subtype: context.caseSubtype,
        ipcSections: caseData.ipcSections.map(s => ({
          sectionCode: s.ipcSection.sectionCode,
          description: s.ipcSection.description
        })),
        documents: caseData.documents.map(d => ({
          documentType: d.documentType,
          extractedText: d.extractedText
        }))
      };

      const aiResponse = await generateCaseAnalysis(analysisData);
      
      // Parse AI response
      const outcome = aiResponse.prediction.toUpperCase();
      const confidence = parseFloat(aiResponse.confidence);

      return { outcome, confidence: Math.min(Math.max(confidence, 0), 1) };

    } catch (error) {
      console.error('Error predicting case outcome:', error);
      return { outcome: 'UNKNOWN', confidence: 0 };
    }
  }

  // Get similar historical cases
  static async getSimilarHistoricalCases(caseData: any): Promise<any[]> {
    return await prisma.historicalCase.findMany({
      where: {
        type: caseData.type,
        // Add more similarity criteria as needed
      },
      orderBy: [
        { outcome: 'asc' },
        { duration: 'asc' }
      ],
      take: 10
    });
  }

  // Update case analytics
  static async updateCaseAnalytics(caseId: string) {
    const caseData = await prisma.case.findUnique({
      where: { id: caseId },
      include: {
        documents: true,
        _count: {
          select: {
            documents: true
          }
        }
      }
    });

    if (!caseData) return;

    const complexityScore = await this.calculateComplexityScore(caseId);
    const riskLevel = await this.calculateRiskLevel(caseId);
    const prediction = await this.predictCaseOutcome(caseId);

    const documentStats = {
      total: caseData._count.documents,
      approved: caseData.documents.filter(d => d.isApprovedByLawyer).length,
      pending: caseData.documents.filter(d => !d.isApprovedByLawyer && !d.isSharedWithJudge).length,
      rejected: 0 // This would need to be tracked separately
    };

    // Calculate average processing time (mock implementation)
    const averageProcessingTime = documentStats.total > 0 ? 24 : 0; // hours

    return await prisma.caseAnalytics.upsert({
      where: { caseId },
      update: {
        totalDocuments: documentStats.total,
        approvedDocuments: documentStats.approved,
        pendingDocuments: documentStats.pending,
        rejectedDocuments: documentStats.rejected,
        averageProcessingTime,
        lastActivity: new Date(),
        complexityScore,
        riskLevel,
        predictedOutcome: prediction.outcome,
        confidenceScore: prediction.confidence
      },
      create: {
        caseId,
        totalDocuments: documentStats.total,
        approvedDocuments: documentStats.approved,
        pendingDocuments: documentStats.pending,
        rejectedDocuments: documentStats.rejected,
        averageProcessingTime,
        lastActivity: new Date(),
        complexityScore,
        riskLevel,
        predictedOutcome: prediction.outcome,
        confidenceScore: prediction.confidence
      }
    });
  }

  // Get dashboard analytics for a user
  static async getDashboardAnalytics(userId: string, userRole: string) {
    const whereClause = userRole === 'JUDGE' 
      ? { judgeId: userId }
      : userRole === 'LAWYER'
      ? { lawyerId: userId }
      : { clientId: userId };

    const [
      totalCases,
      activeCases,
      closedCases,
      totalDocuments,
      pendingDocuments,
      upcomingHearings,
      caseAnalytics
    ] = await Promise.all([
      prisma.case.count({ where: whereClause }),
      prisma.case.count({ where: { ...whereClause, status: 'ACTIVE' } }),
      prisma.case.count({ where: { ...whereClause, status: 'CLOSED' } }),
      prisma.document.count({
        where: { case: whereClause }
      }),
      prisma.document.count({
        where: { 
          case: whereClause,
          isApprovedByLawyer: false,
          isSharedWithJudge: false
        }
      }),
      prisma.case.count({
        where: {
          ...whereClause,
          hearingDate: {
            gte: new Date(),
            lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Next 7 days
          }
        }
      }),
      prisma.caseAnalytics.findMany({
        where: { case: whereClause },
        include: { case: { select: { id: true, caseNumber: true, title: true } } }
      })
    ]);

    // Calculate success rate from analytics
    const successRate = caseAnalytics.length > 0 
      ? (caseAnalytics.filter(a => a.predictedOutcome === 'WON').length / caseAnalytics.length) * 100
      : 0;

    // Calculate average complexity
    const avgComplexity = caseAnalytics.length > 0
      ? caseAnalytics.reduce((sum, a) => sum + (a.complexityScore || 0), 0) / caseAnalytics.length
      : 0;

    return {
      overview: {
        totalCases,
        activeCases,
        closedCases,
        totalDocuments,
        pendingDocuments,
        upcomingHearings
      },
      analytics: {
        successRate: Math.round(successRate * 10) / 10,
        averageComplexity: Math.round(avgComplexity * 10) / 10,
        highRiskCases: caseAnalytics.filter(a => a.riskLevel === 'HIGH').length,
        predictedWins: caseAnalytics.filter(a => a.predictedOutcome === 'WON').length
      },
      recentActivity: caseAnalytics.slice(0, 5)
    };
  }

  // Get case performance metrics
  static async getCasePerformanceMetrics(caseId: string) {
    const analytics = await prisma.caseAnalytics.findUnique({
      where: { caseId },
      include: { case: true }
    });

    if (!analytics) return null;

    return {
      complexity: analytics.complexityScore,
      riskLevel: analytics.riskLevel,
      predictedOutcome: analytics.predictedOutcome,
      confidence: analytics.confidenceScore,
      documentStats: {
        total: analytics.totalDocuments,
        approved: analytics.approvedDocuments,
        pending: analytics.pendingDocuments,
        rejected: analytics.rejectedDocuments
      },
      processingTime: analytics.averageProcessingTime,
      lastActivity: analytics.lastActivity
    };
  }
}
