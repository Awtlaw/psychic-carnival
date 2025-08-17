import 'dotenv/config';
import passport from 'passport';
import { signAccessRefreshTokens } from '../utils/jwt.js';

export const authenticateUser = function (req, res, next) {
  passport.authenticate('login', async (err, user, info) => {
    try {
      if (err) {
        console.error('Passport error:', err);
        return res.status(500).json({ success: false, message: err.message });
      }
      if (!user) {
        console.warn('Login failed:', info?.message);
        return res.status(401).json({
          success: false,
          message: info?.message || 'Invalid credentials',
        });
      }
      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);
        const secret = process.env.JWT_SECRET;
        const accessTokenPayload = {
          sub: user.id,
          email: user.email,
          role: user.role,
        };
        const accessTokenOptions = { expiresIn: process.env.JWT_EXPIRES_IN };
        const refreshTokenPayload = { sub: user.id };
        const refreshTokenOptions = {
          expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
        };
        signAccessRefreshTokens(
          secret,
          accessTokenPayload,
          refreshTokenPayload,
          accessTokenOptions,
          refreshTokenOptions,
        )(req, res, next);
      });
    } catch (e) {
      return next(e);
    }
  })(req, res, next);
};
