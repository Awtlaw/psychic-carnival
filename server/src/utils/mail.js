import 'dotenv/config';
import { createTransport } from 'nodemailer';

const options = {
  port: Number(process.env.SMTP_PORT),
  host: process.env.SMTP_HOST,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
};

const transporter = createTransport(options);

export function sendBookingMail(mail, name, date, period, reason) {
  const bookingMail = {
    from: `HealthConnect Team <${process.env.SMTP_USER}>`,
    to: mail,
    subject: 'Your Appointment Has Been Scheduled - HealthConnect',
    text: `
        Hello ${name},
        
        Your appointment has been successfully scheduled.

        📅 Date: ${date}
        🕒 Time: ${period}
        📍 Location: HealthConnect Clinic, 12 Main Street, Accra
        🩺 Reason for Visit: ${reason}
        
        Please arrive 10 minutes early and bring any relevant medical documents.
      
        Thank you,
        HealthConnect Team
        `,
  };

  transporter.sendMail(bookingMail, function (err, info) {
    if (err) console.log(err);
    console.log('Message sent:', info.messageId);
  });
}

export function sendReminderMail(mail, name, date, period, reason) {
  const reminderMail = {
    from: `HealthConnect Team <${process.env.SMTP_USER}>`,
    to: mail,
    subject: 'Your Appointment Has Been Scheduled - HealthConnect',
    text: `
    
    Hello ${name},
    
    This is a reminder about your upcoming appointment.
    
    📅 Date: ${date}
    🕒 Time: ${period}
    📍 Location: HealthConnect Clinic, 12 Main Street, Accra
    🩺 Reason for Visit: ${reason}
    
    Please arrive 10 minutes early and bring any relevant medical documents.
    
    Best regards,  
    HealthConnect Team
    `,
  };

  transporter.sendMail(reminderMail, function (err, info) {
    if (err) console.log(err);
    console.log('Message sent:', info?.messageId);
  });
}
