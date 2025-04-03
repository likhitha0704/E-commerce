const jwt = require('jsonwebtoken');

const verifyAdmin = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: "Access denied, no token provided" });

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = decoded;

    if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ error: "Access denied" });
      }

    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token" });
  }
};

// ✅ Correct Export
module.exports = { verifyAdmin };
