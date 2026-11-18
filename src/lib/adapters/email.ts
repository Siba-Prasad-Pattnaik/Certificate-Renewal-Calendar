import { z } from 'zod';
import { ContactInfo } from '../zod/types';

// Email adapter interface
export interface EmailAdapter {
  // Send contact form email
  sendContactMessage(data: ContactInfo): Promise<{ success: boolean; messageId?: string; error?: string }>;
  
  // Send transactional email (password reset, notifications, etc.)
  sendTransactionalEmail(options: {
    to: string;
    subject: string;
    templateId?: string;
    data?: Record<string, unknown>;
    text?: string;
    html?: string;
  }): Promise<{ success: boolean; messageId?: string; error?: string }>;
  
  // Send newsletter subscription confirmation
  sendNewsletterConfirmation(email: string, confirmationLink: string): Promise<{ success: boolean; messageId?: string; error?: string }>;
  
  // Health check
  health(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    provider?: 'resend' | 'console' | 'smtp';
    message?: string;
  }>;
}

// Console email adapter - logs emails to console for development
export class ConsoleEmailAdapter implements EmailAdapter {
  private provider: 'console' = 'console';

  async sendContactMessage(data: ContactInfo): Promise<{ success: boolean; messageId?: string; error?: string }> {
    console.log('📧 Contact Email (Console Adapter):', {
      to: 'admin@example.com',
      from: data.email,
      subject: data.subject,
      message: data.message,
      name: data.name,
      timestamp: new Date().toISOString(),
      ip: data.ipAddress,
      userAgent: data.userAgent
    });

    return {
      success: true,
      messageId: `console_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    };
  }

  async sendTransactionalEmail(options: {
    to: string;
    subject: string;
    templateId?: string;
    data?: Record<string, unknown>;
    text?: string;
    html?: string;
  }): Promise<{ success: boolean; messageId?: string; error?: string }> {
    console.log('📧 Transactional Email (Console Adapter):', {
      to: options.to,
      subject: options.subject,
      templateId: options.templateId,
      data: options.data,
      timestamp: new Date().toISOString()
    });

    if (options.text) {
      console.log('Text content:', options.text.substring(0, 200) + (options.text.length > 200 ? '...' : ''));
    }

    if (options.html) {
      console.log('HTML content length:', options.html.length);
    }

    return {
      success: true,
      messageId: `console_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    };
  }

  async sendNewsletterConfirmation(email: string, confirmationLink: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    console.log('📧 Newsletter Confirmation (Console Adapter):', {
      to: email,
      subject: 'Confirm your newsletter subscription',
      confirmationLink,
      timestamp: new Date().toISOString()
    });

    return {
      success: true,
      messageId: `console_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    };
  }

  async health(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    provider?: 'resend' | 'console' | 'smtp';
    message?: string;
  }> {
    return {
      status: 'healthy',
      provider: this.provider,
      message: 'Console email adapter is running (emails are logged to console)'
    };
  }
}

// Resend email adapter - uses Resend API for production
export class ResendEmailAdapter implements EmailAdapter {
  private apiKey: string;
  private fromEmail: string;
  private provider: 'resend' = 'resend';

  constructor(apiKey: string, fromEmail: string = 'portfolio@resend.dev') {
    if (!apiKey) {
      throw new Error('Resend API key is required');
    }
    this.apiKey = apiKey;
    this.fromEmail = fromEmail;
  }

  private async makeResendRequest(endpoint: string, body: unknown) {
    try {
      const response = await fetch('https://api.resend.com' + endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Resend API error: ${response.status} ${error}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Resend API request failed:', error);
      throw error;
    }
  }

  async sendContactMessage(data: ContactInfo): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const response = await this.makeResendRequest('/emails', {
        from: `${data.name} <${data.email}>`,
        to: [this.fromEmail],
        subject: `Contact Form: ${data.subject}`,
        text: `Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}\n\n---\nIP: ${data.ipAddress || 'unknown'}\nUser Agent: ${data.userAgent || 'unknown'}`,
        html: `
          <h2>New Contact Message</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Subject:</strong> ${data.subject}</p>
          <h3>Message:</h3>
          <p>${data.message.replace(/\n/g, '<br>')}</p>
          <hr>
          <p><small>IP: ${data.ipAddress || 'unknown'}</small></p>
          <p><small>User Agent: ${data.userAgent || 'unknown'}</small></p>
          <p><small>Received: ${new Date().toLocaleString()}</small></p>
        `
      });

      return {
        success: true,
        messageId: response.id
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async sendTransactionalEmail(options: {
    to: string;
    subject: string;
    templateId?: string;
    data?: Record<string, unknown>;
    text?: string;
    html?: string;
  }): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const body: any = {
        from: this.fromEmail,
        to: [options.to],
        subject: options.subject
      };

      if (options.templateId) {
        body.template_id = options.templateId;
        if (options.data) {
          body.data = options.data;
        }
      } else {
        if (options.text) {
          body.text = options.text;
        }
        if (options.html) {
          body.html = options.html;
        }
      }

      const response = await this.makeResendRequest('/emails', body);

      return {
        success: true,
        messageId: response.id
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async sendNewsletterConfirmation(email: string, confirmationLink: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const response = await this.makeResendRequest('/emails', {
        from: this.fromEmail,
        to: [email],
        subject: 'Confirm your newsletter subscription',
        text: `Please confirm your newsletter subscription by clicking this link: ${confirmationLink}`,
        html: `
          <h2>Confirm Your Subscription</h2>
          <p>Thank you for subscribing to our newsletter!</p>
          <p>Please confirm your subscription by clicking the button below:</p>
          <p><a href="${confirmationLink}" style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px;">Confirm Subscription</a></p>
          <p>Or copy and paste this link into your browser:<br><code>${confirmationLink}</code></p>
          <p>If you didn't request this subscription, please ignore this email.</p>
        `
      });

      return {
        success: true,
        messageId: response.id
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async health(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    provider?: 'resend' | 'console' | 'smtp';
    message?: string;
  }> {
    try {
      // Simple API check
      const response = await fetch('https://api.resend.com/emails', {
        method: 'HEAD',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (response.status === 200) {
        return {
          status: 'healthy',
          provider: this.provider,
          message: 'Resend API is accessible'
        };
      } else {
        return {
          status: 'degraded',
          provider: this.provider,
          message: `Resend API returned status ${response.status}`
        };
      }
    } catch (error) {
      return {
        status: 'unhealthy',
        provider: this.provider,
        message: `Resend API check failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
}

// Factory function to create email adapter based on environment
export function createEmailAdapter(): EmailAdapter {
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.EMAIL_FROM || 'portfolio@resend.dev';

  if (resendApiKey) {
    console.log('📧 Using Resend email adapter');
    return new ResendEmailAdapter(resendApiKey, fromEmail);
  } else {
    console.log('📧 Using Console email adapter (RESEND_API_KEY not set)');
    return new ConsoleEmailAdapter();
  }
}

// Default instance export
export const email = createEmailAdapter();