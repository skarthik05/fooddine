const mongodb = require("../mongodb");
exports.createOrder = (req, res) => {};

exports.listOrder = async (req, res) => {
  let orderList = await mongodb.get("orders").find().toArray();
  console.log({ orderList });
};
