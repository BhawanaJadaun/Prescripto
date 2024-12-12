import jwt from 'jsonwebtoken';

const authDoctor = (req, res, next) => {
  try {
    // Extract token from the Authorization header
    const dToken = req.headers.authorization?.split(' ')[1];

    if (!dToken) {
      console.log("Token is missing");
      return res.status(401).json({ success: false, message: "Authorization token is missing" });
    }

    // Verify the token
    const token_decode = jwt.verify(dToken, process.env.JWT_SECRET);

    // Attach doctor ID to req.body
    req.body.docId = token_decode.id;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ success: false, message: error.message });
  }
};

export default authDoctor;
