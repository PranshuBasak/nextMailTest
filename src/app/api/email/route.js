import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { htmlBody, toEmail, toSubject } = await request.json();

    if (!htmlBody || !toEmail || !toSubject) {
      return NextResponse.json(
        { error: 'Missing required fields: Please provide email, subject, and content' },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: toEmail,
      subject: toSubject,
      html: htmlBody,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    
    return NextResponse.json(
      { message: 'Email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
