const { tableStatus, tableInformation } = require("../controller/table");

var router = require("express").Router();

//Listing tables
router.get("/", tableStatus);
router.get("/:tableId/info", tableInformation);

module.exports = router;
