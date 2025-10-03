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

export function sendBookingMail(mail, name, date, period, reason, doc) {
  const bookingMail = {
    from: `HealthConnect Team <${process.env.SMTP_USER}>`,
    to: mail,
    subject: 'Your Appointment Has Been Scheduled - HealthConnect',
    text: `
        Hello ${name},
        
        Your appointment has been successfully scheduled.

        📅 Date: ${date}
        🕒 Time: ${period}
        📍 Location:Accra Technical University, 12 Main Street, Accra
        🩺 Reason for Visit: ${reason}
        👨🏾‍⚕ Assigned Doctor: ${doc}
        
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

export function sendReminderMail(mail, name, date, period, reason, doc) {
  const reminderMail = {
    from: `HealthConnect Team <${process.env.SMTP_USER}>`,
    to: mail,
    subject: 'Your Appointment Has Been Scheduled - HealthConnect',
    text: `
    
    Hello ${name},
    
    This is a reminder about your upcoming appointment.
    
    📅 Date: ${date}
    🕒 Time: ${period}
    📍 Location: Accra Technical University, 12 Main Street, Accra
    🩺 Reason for Visit: ${reason}
    👨🏾‍⚕ Assigned Doctor: ${doc}
    
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

export function sendDocDetails(mail, password, name) {
  const detailsMail = {
    from: `HealthConnect Team <${process.env.SMTP_USER}>`,
    to: mail,
    subject: 'Your Account Has Been Created - HealthConnect',
    text: `
    
    Hello ${name},
    
    Kindly note your doctor's account has been created.
    Login with your email and the default password: ${password}
    Please change your password after logging in to secure your account.

    Best regards,  
    HealthConnect Team
    `,
  };

  transporter.sendMail(detailsMail, function (err, info) {
    if (err) console.log(err);
    console.log('Message sent:', info?.messageId);
  });
}
export async function sendPasswordResetEmail(mail, resetUrl) {
  const resetMail = {
    from: `HealthConnect Team <${process.env.SMTP_USER}>`,
    to: mail,
    subject: '🔒 Password Reset Request - HealthConnect',
    text: `
Hello,

You requested a password reset.

🔗 Reset Link: ${resetUrl}

If you did not make this request, please ignore this email.

Best regards,  
HealthConnect Team
    `,
    html: `
      <p>Hello,</p>
      <p>You requested a password reset.</p>
      <p>This link will expire in 15 minutes for your security.</p>
      <p>🔗 <a href="${resetUrl}">${resetUrl}</a></p>
      <p>If you did not make this request, please ignore this email.</p>
      <p>Best regards,<br>HealthConnect Team</p>
    `,
  };

  try {
    const info = await transporter.sendMail(resetMail);
    console.log(`Password reset email sent to ${mail}`);
    return info;
  } catch (err) {
    console.error('Error sending password reset email:', err);
    throw err;
  }
}
