const jwt = require("jsonwebtoken");

function adminAuth(req, res, next) {
  const token = req.cookies.Token || (req.headers.authorization && req.headers.authorization.split(" ")[1]);
  console.log({token});
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token Invalid" });
  }

}

module.exports = adminAuth; 


