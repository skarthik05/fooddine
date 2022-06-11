const { listMenu } = require("../controller/menu");

var router = require("express").Router();

//listing menu
router.get("/", listMenu);

module.exports = router;
