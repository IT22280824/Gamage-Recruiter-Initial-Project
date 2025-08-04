const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
  // Extract token from Authorization header (format: "Bearer TOKEN")
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Map userId in token payload to req.user.id for consistency in controllers
    req.user = {
      id: decoded.userId,  // your payload uses userId, so map to id
      role: decoded.role,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

exports.adminOnly = (req, res, next) => {
  // Check if user role is admin
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
  next();
};
