import jwt from 'jsonwebtoken';

const authUser = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ 
      success: false, 
      message: "Not authorized. Login again" 
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded JWT Payload:", decoded); // Debug log, remove in production

    // Attach the user ID to the request body
    req.body.userId = decoded.id;

    next(); // Proceed to the next middleware
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    res.status(401).json({ 
      success: false, 
      message: "Invalid token. Please log in again" 
    });
  }
};

export default authUser;
