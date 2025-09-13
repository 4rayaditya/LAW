// Communication service for email and SMS notifications
// This is a mock implementation - replace with actual email/SMS providers

export interface EmailData {
  to: string;
  subject: string;
  body: string;
  html?: string;
}

export interface SMSData {
  to: string;
  message: string;
}

export class CommunicationService {
  // Mock email service - replace with actual provider (SendGrid, AWS SES, etc.)
  static async sendEmail(data: EmailData): Promise<boolean> {
    try {
      console.log('📧 Email sent:', {
        to: data.to,
        subject: data.subject,
        body: data.body
      });
      
      // In production, integrate with actual email service:
      // - SendGrid: https://sendgrid.com/
      // - AWS SES: https://aws.amazon.com/ses/
      // - Nodemailer with SMTP
      
      return true;
    } catch (error) {
      console.error('Email sending failed:', error);
      return false;
    }
  }

  // Mock SMS service - replace with actual provider (Twilio, AWS SNS, etc.)
  static async sendSMS(data: SMSData): Promise<boolean> {
    try {
      console.log('📱 SMS sent:', {
        to: data.to,
        message: data.message
      });
      
      // In production, integrate with actual SMS service:
      // - Twilio: https://www.twilio.com/
      // - AWS SNS: https://aws.amazon.com/sns/
      // - Indian SMS providers like MSG91, TextLocal
      
      return true;
    } catch (error) {
      console.error('SMS sending failed:', error);
      return false;
    }
  }

  // Send hearing reminder email
  static async sendHearingReminderEmail(userEmail: string, caseData: any, hearingDate: Date) {
    const subject = `Hearing Reminder - Case ${caseData.caseNumber}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Hearing Reminder</h2>
        <p>Dear ${caseData.userName},</p>
        <p>This is a reminder that you have a hearing scheduled:</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Case Details</h3>
          <p><strong>Case Number:</strong> ${caseData.caseNumber}</p>
          <p><strong>Title:</strong> ${caseData.title}</p>
          <p><strong>Hearing Date:</strong> ${hearingDate.toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${hearingDate.toLocaleTimeString()}</p>
        </div>
        <p>Please ensure you are prepared and arrive on time.</p>
        <p>Best regards,<br>NyaySphere Team</p>
      </div>
    `;

    return await this.sendEmail({
      to: userEmail,
      subject,
      body: `Hearing reminder for case ${caseData.caseNumber} on ${hearingDate.toLocaleDateString()}`,
      html
    });
  }

  // Send document approval notification
  static async sendDocumentApprovalEmail(userEmail: string, documentData: any, approved: boolean) {
    const status = approved ? 'approved' : 'rejected';
    const subject = `Document ${status.charAt(0).toUpperCase() + status.slice(1)} - ${documentData.fileName}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: ${approved ? '#059669' : '#dc2626'};">
          Document ${status.charAt(0).toUpperCase() + status.slice(1)}
        </h2>
        <p>Dear User,</p>
        <p>Your document has been ${status}:</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Document Details</h3>
          <p><strong>File Name:</strong> ${documentData.fileName}</p>
          <p><strong>Document Type:</strong> ${documentData.documentType}</p>
          <p><strong>Status:</strong> <span style="color: ${approved ? '#059669' : '#dc2626'}; font-weight: bold;">
            ${status.charAt(0).toUpperCase() + status.slice(1)}
          </span></p>
        </div>
        ${!approved ? '<p>Please review the feedback and resubmit the document if necessary.</p>' : ''}
        <p>Best regards,<br>NyaySphere Team</p>
      </div>
    `;

    return await this.sendEmail({
      to: userEmail,
      subject,
      body: `Your document ${documentData.fileName} has been ${status}`,
      html
    });
  }
}

// Export individual functions for easier use
export const sendEmail = CommunicationService.sendEmail;
export const sendSMS = CommunicationService.sendSMS;
