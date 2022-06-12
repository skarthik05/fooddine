const jwt = require("jsonwebtoken");
const { config } = require("../global");

exports.authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, config.jwt.ACCESSTOKEN, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      } else {
        req.user = user;
      }
      next();
    });
  } else {
    res.sendStatus(401);
  }
};
