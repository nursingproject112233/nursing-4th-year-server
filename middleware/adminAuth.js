import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) {
      return res.status(401).json({
        message: "Login Required!",
      });
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) {
      return res.status(401).json({ message: "Login Expired!d" });
    }
    if (verified.type == "student") {
      return res.status(401).json({ message: "Unauthorized access" });
    }
    req.user = verified;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default auth;

//old code
// const auth = (req, res, next) => {
//   try {
//     if (!req.user) {
//       return res.status(400).json({ message: "Login required" });
//     }
//     if (req.user.type == "student") {
//       return res.status(401).json({ message: "Unauthorized access" });
//     }
//     next();
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// };

// export default auth;
