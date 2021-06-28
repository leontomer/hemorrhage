const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).json({ errors: [{ msg: "Invalid token" }] });
  }
  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    req.user = decoded.user;
    if (
      decoded.user.role !== "User" &&
      decoded.user.role !== "Admin" &&
      decoded.user.role !== "Doctor"
    ) {
      return res
        .status(401)
        .json({ errors: [{ msg: "You are not authorized" }] });
    }
    next();
  } catch (err) {
    res.status(500).json({ errors: [{ msg: err.message }] });
  }
};
