import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) {
      return res.status(401).json({
        message: "Access denied as no authentication token present in request",
      });
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) {
      return res
        .status(401)
        .json({ message: "Access denied as token verification failed" });
    }
    console.log("====================================");
    console.log(verified);
    console.log("====================================");
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

//     next();
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// };

// export default auth;
