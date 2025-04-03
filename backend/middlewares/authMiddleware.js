const jwt = require('jsonwebtoken');

// Middleware to verify user authentication
const verifyUser = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: "Access denied, no token provided" });

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token" });
  }
};

// Middleware to verify admin authentication
const verifyAdmin = (req, res, next) => {
  verifyUser(req, res, () => {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({ error: "Access denied, not an admin" });
    }
  });
};

module.exports = { verifyUser, verifyAdmin };
