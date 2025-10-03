// src/controllers/authController.js
import Joi from 'joi';
import {
  requestPasswordReset,
  resetPassword,
} from '../services/passwordResetService.js';

const forgotSchema = Joi.object({
  email: Joi.string().email().required(),
});

const resetSchema = Joi.object({
  token: Joi.string().required(),
  newPassword: Joi.string().min(8).max(128).required(), // adjust policy
});

export async function forgotPasswordHandler(req, res) {
  try {
    const { error, value } = forgotSchema.validate(req.body);
    if (error) return res.status(400).json({ error: 'Invalid request' });

    // Always respond the same to avoid username/email enumeration
    await requestPasswordReset(value.email);
    return res.json({
      message: 'If the email exists, a reset link has been sent.',
    });
  } catch (err) {
    console.error('forgotPasswordHandler error:', err);
    // Still return generic error so attackers don't know internals
    return res
      .status(500)
      .json({ message: 'If the email exists, a reset link has been sent.' });
  }
}

export async function resetPasswordHandler(req, res) {
  try {
    const { error, value } = resetSchema.validate(req.body);
    if (error) return res.status(400).json({ error: 'Invalid request' });

    await resetPassword(value.token, value.newPassword);
    return res.json({ message: 'Password has been reset successfully.' });
  } catch (err) {
    console.error('resetPasswordHandler error:', err);
    // Be specific for expired/invalid tokens but avoid user enumeration
    return res
      .status(400)
      .json({ error: err.message || 'Failed to reset password' });
  }
}
