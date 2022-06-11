const { createOrder, listOrder } = require("../controller/order");

var router = require("express").Router();

//listing order list
router.get("/", listOrder);
router.post("/create", createOrder);

module.exports = router;
