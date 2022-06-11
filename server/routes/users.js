var express = require("express");
const { signUp, signOut, recentOrders } = require("../controller/user");
var router = express.Router();

/* GET users listing. */
router.post("/signup", signUp);
router.put("/signout", signOut);
router.post("/recent/orders", recentOrders);
module.exports = router;
