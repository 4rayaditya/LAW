import express from 'express';
import { body, validationResult } from 'express-validator';
import { prisma } from '../index';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { queryDocumentsWithAI, generateCaseAnalysis } from '../utils/ai';

const router = express.Router();

// Chatbot endpoint for general legal assistance
router.post('/query', authenticateToken, [
  body('query').trim().notEmpty().withMessage('Query is required'),
  body('caseId').optional().isUUID(),
  body('context').optional().isString()
], async (req: AuthRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { query, caseId, context = 'general' } = req.body;

    let response: string;

    if (caseId && context === 'case_analysis') {
      // Case-specific analysis
      const caseData = await prisma.case.findFirst({
        where: {
          id: caseId,
          OR: [
            { judgeId: req.user!.id },
            { lawyerId: req.user!.id },
            { clientId: req.user!.id }
          ]
        },
        include: {
          documents: {
            where: { extractedText: { not: null } },
            select: { documentType: true, extractedText: true, fileName: true }
          },
          ipcSections: {
            include: { ipcSection: { select: { sectionCode: true, description: true } } }
          },
          lawyer: { select: { name: true, barId: true } },
          client: { select: { name: true } },
          judge: { select: { name: true } }
        }
      });

      if (!caseData) {
        return res.status(404).json({ error: 'Case not found or access denied' });
      }

      // Prepare case data for AI analysis
      const analysisData = {
        type: caseData.type,
        subtype: caseData.subtype,
        ipcSections: caseData.ipcSections.map(s => ({
          sectionCode: s.ipcSection.sectionCode,
          description: s.ipcSection.description
        })),
        documents: caseData.documents.map(d => ({
          documentType: d.documentType,
          extractedText: d.extractedText
        }))
      };

      // Generate comprehensive case analysis
      const aiAnalysis = await generateCaseAnalysis(analysisData);
      
      // Create a detailed response based on the query
      response = await generateContextualResponse(query, {
        caseData,
        aiAnalysis,
        context: 'case_analysis'
      });

    } else {
      // General legal assistance
      response = await generateGeneralLegalResponse(query);
    }

    return res.json({
      response,
      timestamp: new Date().toISOString(),
      context: context
    });

  } catch (error) {
    console.error('Chatbot query error:', error);
    return res.status(500).json({ error: 'Failed to process query' });
  }
});

// Generate contextual response based on query type
async function generateContextualResponse(query: string, data: any): Promise<string> {
  const { caseData, aiAnalysis, context } = data;
  
  const queryLower = query.toLowerCase();
  
  if (queryLower.includes('summarize') || queryLower.includes('summary')) {
    return generateCaseSummary(caseData, aiAnalysis);
  } else if (queryLower.includes('analyze') || queryLower.includes('analysis')) {
    return generateDocumentAnalysis(caseData, aiAnalysis);
  } else if (queryLower.includes('precedent') || queryLower.includes('case law')) {
    return generatePrecedentAnalysis(caseData, aiAnalysis);
  } else if (queryLower.includes('risk') || queryLower.includes('challenge')) {
    return generateRiskAssessment(caseData, aiAnalysis);
  } else if (queryLower.includes('evidence') || queryLower.includes('proof')) {
    return generateEvidenceAnalysis(caseData, aiAnalysis);
  } else {
    return generateGeneralCaseResponse(query, caseData, aiAnalysis);
  }
}

function generateCaseSummary(caseData: any, aiAnalysis: any): string {
  return `# Case Summary: ${caseData.title}

## Case Details
- **Case Number:** ${caseData.caseNumber}
- **Type:** ${caseData.type} - ${caseData.subtype}
- **Status:** ${caseData.status}
- **Urgency:** ${caseData.urgency}
- **Filed Date:** ${new Date(caseData.createdAt).toLocaleDateString()}

## Parties Involved
- **Judge:** ${caseData.judge?.name || 'Not assigned'}
- **Lawyer:** ${caseData.lawyer?.name || 'Not assigned'} (Bar ID: ${caseData.lawyer?.barId || 'N/A'})
- **Client:** ${caseData.client?.name || 'Not assigned'}

## Legal Framework
**IPC Sections:**
${caseData.ipcSections.map((s: any) => `- ${s.ipcSection.sectionCode}: ${s.ipcSection.description}`).join('\n')}

## Key Documents
${caseData.documents.map((d: any) => `- ${d.fileName} (${d.documentType})`).join('\n')}

## AI Analysis
${aiAnalysis.summary || 'Analysis in progress...'}

## Recommendations
${aiAnalysis.recommendations?.join('\n- ') || 'No specific recommendations available at this time.'}`;
}

function generateDocumentAnalysis(caseData: any, aiAnalysis: any): string {
  const documentTypes = [...new Set(caseData.documents.map((d: any) => d.documentType))];
  
  return `# Document Analysis for ${caseData.title}

## Document Overview
- **Total Documents:** ${caseData.documents.length}
- **Document Types:** ${documentTypes.join(', ')}

## Key Evidence
${caseData.documents.map((d: any) => {
  const hasText = d.extractedText && d.extractedText.length > 50;
  return `### ${d.fileName}
- **Type:** ${d.documentType}
- **Status:** ${hasText ? 'Text extracted' : 'Processing required'}
- **Relevance:** ${hasText ? 'High' : 'Pending analysis'}`;
}).join('\n')}

## AI Insights
${aiAnalysis.insights || 'Document analysis in progress...'}

## Critical Findings
${aiAnalysis.criticalFindings?.join('\n- ') || 'No critical findings identified yet.'}`;
}

function generatePrecedentAnalysis(caseData: any, aiAnalysis: any): string {
  return `# Legal Precedent Analysis

## Relevant Case Law
Based on the case type (${caseData.type}) and IPC sections involved, here are relevant precedents:

### Similar Cases
${aiAnalysis.similarCases?.map((c: any) => 
  `- **${c.caseNumber}**: ${c.outcome} (${c.duration} days)`
).join('\n') || 'No similar cases found in database.'}

### Legal Principles
${aiAnalysis.legalPrinciples?.join('\n- ') || 'Legal principles analysis in progress...'}

### Precedent Recommendations
${aiAnalysis.precedentRecommendations?.join('\n- ') || 'Precedent analysis ongoing...'}`;
}

function generateRiskAssessment(caseData: any, aiAnalysis: any): string {
  return `# Risk Assessment for ${caseData.title}

## Case Complexity
- **Complexity Score:** ${aiAnalysis.complexityScore || 'Calculating...'}
- **Risk Level:** ${aiAnalysis.riskLevel || 'Assessing...'}

## Potential Risks
### Legal Risks
${aiAnalysis.legalRisks?.join('\n- ') || 'Legal risk assessment in progress...'}

### Procedural Risks
${aiAnalysis.proceduralRisks?.join('\n- ') || 'Procedural risk analysis ongoing...'}

### Evidence Risks
${aiAnalysis.evidenceRisks?.join('\n- ') || 'Evidence risk evaluation pending...'}

## Mitigation Strategies
${aiAnalysis.mitigationStrategies?.join('\n- ') || 'Mitigation strategies being developed...'}`;
}

function generateEvidenceAnalysis(caseData: any, aiAnalysis: any): string {
  return `# Evidence Analysis for ${caseData.title}

## Evidence Overview
- **Total Evidence Items:** ${caseData.documents.length}
- **Strong Evidence:** ${aiAnalysis.strongEvidence || 'Analyzing...'}
- **Weak Evidence:** ${aiAnalysis.weakEvidence || 'Evaluating...'}

## Evidence Strength
${caseData.documents.map((d: any) => {
  const strength = d.extractedText && d.extractedText.length > 100 ? 'Strong' : 'Pending';
  return `- **${d.fileName}**: ${strength} (${d.documentType})`;
}).join('\n')}

## Key Evidence Points
${aiAnalysis.keyEvidencePoints?.join('\n- ') || 'Evidence analysis in progress...'}

## Evidence Gaps
${aiAnalysis.evidenceGaps?.join('\n- ') || 'Evidence gap analysis ongoing...'}`;
}

function generateGeneralCaseResponse(query: string, caseData: any, aiAnalysis: any): string {
  return `# Response to: "${query}"

## Case Context
This query relates to case **${caseData.title}** (${caseData.caseNumber}).

## AI Analysis
${aiAnalysis.summary || 'Analysis in progress...'}

## Specific Response
Based on the case details and available information:

${aiAnalysis.recommendations?.join('\n- ') || 'Detailed analysis in progress...'}

## Next Steps
${aiAnalysis.nextSteps?.join('\n- ') || 'Recommendations being developed...'}`;
}

async function generateGeneralLegalResponse(query: string): Promise<string> {
  // For general legal queries without specific case context
  const queryLower = query.toLowerCase();
  
  if (queryLower.includes('ipc') || queryLower.includes('criminal')) {
    return `# Criminal Law Information

Based on your query about criminal law, here's some general information:

## Indian Penal Code (IPC)
The IPC is the main criminal code of India, covering various offenses and their punishments.

## Common IPC Sections
- **Section 420**: Cheating and dishonestly inducing delivery of property
- **Section 406**: Criminal breach of trust
- **Section 498A**: Cruelty by husband or relatives of husband
- **Section 376**: Punishment for rape

## Legal Process
1. **FIR Registration**: First Information Report
2. **Investigation**: Police investigation
3. **Chargesheet**: Formal charges
4. **Trial**: Court proceedings
5. **Judgment**: Final decision

For specific case-related queries, please provide more context or case details.`;
  }
  
  if (queryLower.includes('civil') || queryLower.includes('contract')) {
    return `# Civil Law Information

## Civil Law Overview
Civil law deals with disputes between individuals or organizations.

## Common Civil Matters
- **Contract Disputes**: Breach of contract, non-payment
- **Property Disputes**: Land, inheritance, partition
- **Family Law**: Divorce, custody, maintenance
- **Consumer Disputes**: Product defects, service issues

## Legal Remedies
- **Damages**: Monetary compensation
- **Injunctions**: Court orders to stop actions
- **Specific Performance**: Forcing contract fulfillment
- **Declaratory Relief**: Court declaration of rights

For specific case analysis, please provide case details.`;
  }
  
  return `# General Legal Assistance

Thank you for your query: "${query}"

## How I Can Help
I can assist with:
- **Case Analysis**: Summarize and analyze legal cases
- **Document Review**: Extract key information from legal documents
- **Legal Research**: Find relevant precedents and case law
- **Risk Assessment**: Evaluate case strengths and weaknesses
- **Evidence Analysis**: Review and categorize evidence

## Getting Started
To provide more specific assistance, please:
1. Share case details or case ID
2. Upload relevant documents
3. Ask specific legal questions

I'm here to help with your legal research and case analysis needs!`;
}

export default router;
