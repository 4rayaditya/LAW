import { prisma } from '../index';

export class LawFirmService {
  // Create a new law firm
  static async createLawFirm(data: {
    name: string;
    address?: string;
    phone?: string;
    email?: string;
    licenseNumber?: string;
  }) {
    return await prisma.lawFirm.create({
      data: {
        name: data.name,
        address: data.address,
        phone: data.phone,
        email: data.email,
        licenseNumber: data.licenseNumber
      }
    });
  }

  // Get all law firms
  static async getAllLawFirms(includeInactive: boolean = false) {
    return await prisma.lawFirm.findMany({
      where: includeInactive ? {} : { isActive: true },
      include: {
        members: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            barId: true
          }
        },
        _count: {
          select: {
            members: true,
            cases: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });
  }

  // Get law firm by ID
  static async getLawFirmById(id: string) {
    return await prisma.lawFirm.findUnique({
      where: { id },
      include: {
        members: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            barId: true,
            phone: true,
            isActive: true,
            lastLogin: true
          }
        },
        cases: {
          include: {
            judge: { select: { id: true, name: true } },
            client: { select: { id: true, name: true } },
            _count: {
              select: {
                documents: true,
                documentRequests: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: {
            members: true,
            cases: true
          }
        }
      }
    });
  }

  // Add member to law firm
  static async addMemberToLawFirm(lawFirmId: string, userId: string) {
    // Verify the user is a lawyer
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user || user.role !== 'LAWYER') {
      throw new Error('Only lawyers can be added to law firms');
    }

    return await prisma.user.update({
      where: { id: userId },
      data: { lawFirmId },
      include: {
        lawFirm: { select: { id: true, name: true } }
      }
    });
  }

  // Remove member from law firm
  static async removeMemberFromLawFirm(userId: string) {
    return await prisma.user.update({
      where: { id: userId },
      data: { lawFirmId: null }
    });
  }

  // Update law firm
  static async updateLawFirm(id: string, data: {
    name?: string;
    address?: string;
    phone?: string;
    email?: string;
    licenseNumber?: string;
    isActive?: boolean;
  }) {
    return await prisma.lawFirm.update({
      where: { id },
      data
    });
  }

  // Get law firm statistics
  static async getLawFirmStatistics(lawFirmId: string) {
    const [
      totalMembers,
      activeMembers,
      totalCases,
      activeCases,
      closedCases,
      totalDocuments,
      pendingDocuments,
      upcomingHearings
    ] = await Promise.all([
      prisma.user.count({
        where: { lawFirmId, role: 'LAWYER' }
      }),
      prisma.user.count({
        where: { lawFirmId, role: 'LAWYER', isActive: true }
      }),
      prisma.case.count({
        where: { lawFirmId }
      }),
      prisma.case.count({
        where: { lawFirmId, status: 'ACTIVE' }
      }),
      prisma.case.count({
        where: { lawFirmId, status: 'CLOSED' }
      }),
      prisma.document.count({
        where: { case: { lawFirmId } }
      }),
      prisma.document.count({
        where: { 
          case: { lawFirmId },
          isApprovedByLawyer: false,
          isSharedWithJudge: false
        }
      }),
      prisma.case.count({
        where: {
          lawFirmId,
          hearingDate: {
            gte: new Date(),
            lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Next 7 days
          }
        }
      })
    ]);

    // Get case analytics for the law firm
    const caseAnalytics = await prisma.caseAnalytics.findMany({
      where: { case: { lawFirmId } },
      include: { case: { select: { id: true, caseNumber: true, title: true } } }
    });

    const successRate = caseAnalytics.length > 0 
      ? (caseAnalytics.filter(a => a.predictedOutcome === 'WON').length / caseAnalytics.length) * 100
      : 0;

    const avgComplexity = caseAnalytics.length > 0
      ? caseAnalytics.reduce((sum, a) => sum + (a.complexityScore || 0), 0) / caseAnalytics.length
      : 0;

    return {
      members: {
        total: totalMembers,
        active: activeMembers
      },
      cases: {
        total: totalCases,
        active: activeCases,
        closed: closedCases
      },
      documents: {
        total: totalDocuments,
        pending: pendingDocuments
      },
      hearings: {
        upcoming: upcomingHearings
      },
      analytics: {
        successRate: Math.round(successRate * 10) / 10,
        averageComplexity: Math.round(avgComplexity * 10) / 10,
        highRiskCases: caseAnalytics.filter(a => a.riskLevel === 'HIGH').length
      }
    };
  }

  // Get law firm cases with filters
  static async getLawFirmCases(lawFirmId: string, filters: {
    status?: string;
    urgency?: string;
    type?: string;
    page?: number;
    limit?: number;
  } = {}) {
    const { status, urgency, type, page = 1, limit = 10 } = filters;
    
    const where: any = { lawFirmId };
    if (status) where.status = status;
    if (urgency) where.urgency = urgency;
    if (type) where.type = type;

    const [cases, total] = await Promise.all([
      prisma.case.findMany({
        where,
        include: {
          judge: { select: { id: true, name: true } },
          client: { select: { id: true, name: true } },
          lawyer: { select: { id: true, name: true, barId: true } },
          ipcSections: {
            include: { ipcSection: true }
          },
          analytics: true,
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
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.case.count({ where })
    ]);

    return {
      cases,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  // Get law firm members
  static async getLawFirmMembers(lawFirmId: string) {
    return await prisma.user.findMany({
      where: { lawFirmId, role: 'LAWYER' },
      select: {
        id: true,
        name: true,
        email: true,
        barId: true,
        phone: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        _count: {
          select: {
            casesAsLawyer: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });
  }

  // Deactivate law firm
  static async deactivateLawFirm(id: string) {
    // First, remove all members from the law firm
    await prisma.user.updateMany({
      where: { lawFirmId: id },
      data: { lawFirmId: null }
    });

    // Then deactivate the law firm
    return await prisma.lawFirm.update({
      where: { id },
      data: { isActive: false }
    });
  }
}
