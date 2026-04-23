import nodemailer from "nodemailer";

import { IContextCore } from "../interfaces/IContext";

export namespace ServiceMail {
  export async function send(
    c: IContextCore,
    mail: {
      to: string;
      content: string;
      subject: string;
      attachments?: {
        content: Buffer;
        contentType: string;
        filename: string;
      }[];
    },
  ) {
    const transporter = nodemailer.createTransport({
      host: c.env.SMTP_HOST,
      port: c.env.SMTP_PORT,
      auth: {
        user: c.env.SMTP_USERNAME,
        pass: c.env.SMTP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: c.env.SMTP_FROM,
      to: mail.to,
      subject: mail.subject,
      attachments: mail.attachments,
      html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .content { font-size: 16px; color: #333333; line-height: 1.6; }
          .footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #eeeeee; font-size: 12px; color: #888888; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="content">
            ${mail.content}
          </div>
          <div class="footer">
           This email was sent automatically by the system. Please do not reply.
          </div>
        </div>
      </body>
      </html>
    `,
    });
  }
}
