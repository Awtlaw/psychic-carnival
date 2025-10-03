import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { prisma } from './prismaClient.js';
import { sendPasswordResetEmail } from './utils/mail.js';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_RESET_SECRET || process.env.JWT_SECRET;
const JWT_ISSUER = process.env.JWT_ISSUER || 'healthconnect';
const EXPIRY_SECONDS = Number(process.env.RESET_TOKEN_EXPIRY_SECONDS || 3000);
const BCRYPT_SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS || 12);

function hashJti(jti) {
  return crypto.createHash('sha256').update(jti).digest('hex');
}
// Add these functions BEFORE your route handlers in passwordResetService.js

export async function requestPasswordReset(email) {
  let user =
    (await prisma.admin.findUnique({ where: { email } })) ||
    (await prisma.doctor.findUnique({ where: { email } })) ||
    (await prisma.patient.findUnique({ where: { email } }));

  if (!user) {
    console.warn(
      `Password reset requested for non-existing email: ${email}, ignoring.`,
    );
    return {
      message:
        'Check your inbox for reset instructions (if your account exists).',
    };
  }

  const jti = uuidv4();
  const payload = {
    sub: user.id,
    jti,
    role: user.role, // important
  };

  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: EXPIRY_SECONDS,
    issuer: JWT_ISSUER,
  });

  const resetTokenHash = hashJti(jti);
  const expiryDate = new Date(Date.now() + EXPIRY_SECONDS * 1000);

  // Update password reset info depending on role
  const updateData = {
    resetTokenHash,
    resetTokenExpiry: expiryDate,
  };

  if (user.role === 'ADMIN') {
    await prisma.admin.update({
      where: { id: user.id },
      data: updateData,
    });
  } else if (user.role === 'DOCTOR') {
    await prisma.doctor.update({
      where: { id: user.id },
      data: updateData,
    });
  } else if (user.role === 'PATIENT') {
    await prisma.patient.update({
      where: { id: user.id },
      data: updateData,
    });
  }

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${encodeURIComponent(token)}`;

  await sendPasswordResetEmail(user.email, resetUrl);

  return { message: 'If the email exists, a reset link has been sent.' };
}

export async function resetPassword(token, newPassword) {
  // Verify JWT signature & expiry
  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET, { issuer: JWT_ISSUER });
  } catch (err) {
    throw new Error('Invalid or expired token', err);
  }

  const userId = decoded.sub;
  const jti = decoded.jti;
  const role = decoded.role;

  if (!userId || !jti || !role) throw new Error('Invalid token payload');

  // Find user by role
  let user;
  if (role === 'ADMIN') {
    user = await prisma.admin.findUnique({ where: { id: userId } });
  } else if (role === 'DOCTOR') {
    user = await prisma.doctor.findUnique({ where: { id: userId } });
  } else if (role === 'PATIENT') {
    user = await prisma.patient.findUnique({ where: { id: userId } });
  }

  if (!user || !user.resetTokenHash || !user.resetTokenExpiry) {
    throw new Error('Invalid or already used token');
  }

  // Check expiry
  const now = new Date();
  if (user.resetTokenExpiry < now) {
    throw new Error('Token expired');
  }

  // Compare hashed jti
  const expectedHash = hashJti(jti);
  if (
    !crypto.timingSafeEqual(
      Buffer.from(expectedHash, 'utf8'),
      Buffer.from(user.resetTokenHash, 'utf8'),
    )
  ) {
    throw new Error('Invalid token');
  }

  // Hash new password
  const passwordHash = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS);

  // Prepare update data
  const updateData = {
    pwd: passwordHash,
    resetTokenHash: null,
    resetTokenExpiry: null,
  };

  // Update password for correct model
  if (role === 'ADMIN') {
    await prisma.admin.update({ where: { id: userId }, data: updateData });
  } else if (role === 'DOCTOR') {
    await prisma.doctor.update({ where: { id: userId }, data: updateData });
  } else if (role === 'PATIENT') {
    await prisma.patient.update({ where: { id: userId }, data: updateData });
  }

  return { message: 'Password reset successful' };
}
// At the end of passwordResetService.js, add these route handlers:
export async function handlePasswordResetRequest(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    const result = await requestPasswordReset(email);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
}

export async function handlePasswordReset(req, res) {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Token and new password are required',
      });
    }

    const result = await resetPassword(token, newPassword);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Password reset failed',
    });
  }
}
