import jwt from 'jsonwebtoken';

export function ProtectRoute(req, res, next) {
  const authorizationHeader = req.headers.authorization;
  if (authorizationHeader === undefined)
    return res.status(401).json({
      status: 'error',
      message: 'Unauthorized',
    });
  const token = authorizationHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET;
  jwt.verify(token, secret, (err, payload) => {
    req.user = payload;
    if (err)
      return res
        .status(401)
        .json({ status: 'error', message: 'Could not verify JWT' });
  });
  next();
}
