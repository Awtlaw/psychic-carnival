import jwt from 'jsonwebtoken';

export function ProtectRoute(req, res, next) {
  const authorizationHeader = req.headers.authorization;
  if (authorizationHeader === undefined)
    return res.status(401).json({
      success: false,
      message: 'Unauthorized request',
    });
  const token = authorizationHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET;
  jwt.verify(token, secret, (err, payload) => {
    req.user = payload;
    if (err)
      return res.status(401).json({ success: false, message: err.message });
  });
  req.user.tk = token;
  next();
}
