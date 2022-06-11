var express = require("express");
const { signUp } = require("../controller/user");
var router = express.Router();

/* GET users listing. */
router.get("/", signUp);

module.exports = router;
