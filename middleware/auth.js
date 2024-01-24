const auth = (req, res, next) => {
  try {
    if (!req.session.user) {
      return res.status(400).json({ message: "Login required" });
    }
    let jsonParse = JSON.parse(req.session.user);

    req.session.user = jsonParse;
    console.log("====================================");
    console.log(req.session);
    console.log("====================================");
    next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export default auth;
