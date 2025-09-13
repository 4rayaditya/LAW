import { GoogleGenerativeAI } from '@google/generative-ai';
import pdfParse from 'pdf-parse';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const extractTextFromPDF = async (pdfBuffer: Buffer): Promise<string> => {
  try {
    const data = await pdfParse(pdfBuffer);
    return data.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
};

export const queryDocumentsWithAI = async (
  documents: Array<{ extractedText: string | null; fileName: string; documentType: string }>,
  userQuery: string
): Promise<string> => {
  try {
    // Prepare context from all documents
    let context = '';
    
    documents.forEach((doc, index) => {
      if (doc.extractedText) {
        context += `\n--- Document ${index + 1}: ${doc.fileName} (${doc.documentType}) ---\n`;
        context += doc.extractedText;
        context += '\n';
      }
    });

    if (!context.trim()) {
      return 'No text content found in the uploaded documents. Please ensure documents contain readable text.';
    }

    // Create the prompt for Gemini
    const prompt = `You are an expert legal assistant specializing in Indian law. Based ONLY on the following context from case documents, answer the user's question. Be precise, cite relevant sections when applicable, and maintain legal accuracy.

Context from case documents:
${context}

User Question: ${userQuery}

Please provide a comprehensive answer based solely on the provided context. If the context doesn't contain enough information to answer the question, please state that clearly.`;

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return response.text();
  } catch (error) {
    console.error('Error querying AI:', error);
    throw new Error('Failed to process AI query');
  }
};

export const generateCaseAnalysis = async (
  caseData: {
    type: string;
    subtype: string;
    ipcSections: Array<{ sectionCode: string; description: string }>;
    documents: Array<{ documentType: string; extractedText: string | null }>;
  }
): Promise<{ prediction: string; confidence: string; recommendations: string[] }> => {
  try {
    // This is a mock implementation for demo purposes
    // In production, this would use a trained ML model
    
    const mockAnalysis = {
      prediction: `Based on historical data for similar ${caseData.subtype} cases under IPC Section ${caseData.ipcSections[0]?.sectionCode || 'N/A'}, strategies focusing on challenging forensic evidence have a higher success probability.`,
      confidence: '78%',
      recommendations: [
        'File for bail application within 7 days',
        'Request detailed forensic report from prosecution',
        'Gather witness statements to establish alibi',
        'Review CCTV footage for timeline verification',
        'Consider plea bargaining if evidence is strong'
      ]
    };

    // In a real implementation, you would:
    // 1. Train a model on historical case data
    // 2. Use case features (type, IPC sections, evidence types)
    // 3. Return actual predictions with confidence scores
    
    return mockAnalysis;
  } catch (error) {
    console.error('Error generating case analysis:', error);
    throw new Error('Failed to generate case analysis');
  }
};
