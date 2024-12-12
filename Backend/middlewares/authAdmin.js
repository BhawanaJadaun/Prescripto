// authMiddleware.js
import jwt from 'jsonwebtoken';

const authAdmin = (req, res, next) => {
  const atoken = req.headers.authorization?.split(" ")[1];
  if (!atoken) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }
  try {
    const decoded = jwt.verify(atoken, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token." });
  }
};

export default authAdmin;




