const jwt = require('jsonwebtoken');
const { db } = require('../config/database');

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Missing or invalid authorization header' }
    });
  }

  const token = authHeader.split(' ')[1];

  // Check if token is blacklisted
  const blacklisted = db.prepare('SELECT id FROM blacklisted_tokens WHERE token = ?').get(token);
  if (blacklisted) {
    return res.status(401).json({
      success: false,
      error: { code: 'TOKEN_REVOKED', message: 'Token has been revoked' }
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    req.token = token;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: { code: 'INVALID_TOKEN', message: 'Invalid or expired token' }
    });
  }
}

module.exports = { authenticate };
