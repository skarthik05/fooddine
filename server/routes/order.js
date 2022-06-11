const {
  createOrders,
  listCurrentOrders,
  filterOrders,
  listOrders,
} = require("../controller/order");
const { authenticateJWT } = require("../handler/middleware");

var router = require("express").Router();

//listing order list
router.get("/", listOrders);
router.get("/active", listCurrentOrders);
router.post("/create", authenticateJWT, createOrders);
router.post("/filter", filterOrders);

module.exports = router;
