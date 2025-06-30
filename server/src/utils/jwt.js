import jwt from 'jsonwebtoken';

export function signAccessRefreshTokens(
  secret,
  accessTokenPayload,
  refreshTokenPayload,
  accessTokenOptions,
  refreshTokenOptions,
) {
  return (req, res, next) => {
    jwt.sign(accessTokenPayload, secret, accessTokenOptions, (err, access) => {
      if (err) {
        const error = new Error(`Could not sign access JWT: ${err.message}`);
        return next(error);
      }

      jwt.sign(
        refreshTokenPayload,
        secret,
        refreshTokenOptions,
        (err, refresh) => {
          if (err) {
            const error = new Error(
              `Could not sign access JWT: ${err.message}`,
            );
            return next(error);
          }
          return res.json({
            message: 'success',
            accessToken: access,
            refreshToken: refresh,
          });
        },
      );
    });
  };
}
