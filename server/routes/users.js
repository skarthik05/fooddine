var express = require("express");
const { signUp, signOut, recentOrders } = require("../controller/user");
const { authenticateJWT } = require("../handler/middleware");
var router = express.Router();

/* GET users listing. */
router.post("/signup", signUp);
router.post("/signout", signOut);
router.post("/recent/orders", authenticateJWT, recentOrders);
module.exports = router;
