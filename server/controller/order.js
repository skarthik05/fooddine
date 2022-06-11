const { dateToISo } = require("../handler/function");
const mongoDb = require("../mongodb");
exports.createOrders = async (req, res) => {
  let { phone = null, tableNumber, items } = req.body;
  for (let item of items) {
    let query = {
      $and: [
        {
          phone: phone,
          tableNumber: tableNumber,
          isCompleted: false,
          item: item.item,
        },
      ],
    };
    await mongoDb
      .get("menus")
      .updateOne({ item: item.item }, { $inc: { count: item.quantity } });
    let orderCheckOrderDetails = await mongoDb.get("orders").findOne(query);
    if (orderCheckOrderDetails) {
      mongoDb
        .get("orders")
        .findOne(query, { $inc: { quantity: item.quantity } });
    } else {
      item["createdOn"] = dateToISo();
      item["phone"] = phone;
      item["isCompleted"] = false;
      mongoDb.get("orders").insertOne(item);
    }
  }
};

exports.listCurrentOrders = async (req, res) => {
  let pipeline = [
    {
      $match: {
        $and: [{ date: dateToISo() }, { isCompleted: false }],
      },
    },
    {
      $group: {
        _id: { tableNumber: "$tableNumber" },
        tables: {
          $addToSet: {
            item: "$item",
            isCompleted: "$isCompleted",
            quantity: "$quantity",
          },
        },
      },
    },
    {
      $project: {
        tableNumber: "$_id.tableNumber",
        _id: 0,
        tables: 1,
      },
    },
  ];
  let orderList = await mongoDb
    .get("orders")
    .aggregate(pipeline)
    .toArray()
    .toArray();
  if (!orderList?.length) {
    return res.status(200).send([]);
  }
  return res.status(200).send(orderList);
};

exports.filterOrders = async (req, res) => {
  let { date = dateToISo() } = req.body;
  let orderDetails = await mongoDb.get("orders").find({ date: date }).toArray();
  if (!orderDetails?.length) {
    return res.status(200).send([]);
  }
  return res.status(200).send(orderDetails);
};

exports.listOrders = async (req, res) => {
  let orderDetails = await mongoDb
    .get("menus")
    .find({})
    .project({ _id: 0, item: 1, price: 1 })
    .sort({ count: -1 })
    .limit(6)
    .toArray();
  if (!orderDetails?.length) {
    return res.status(200).send([]);
  }
  return res.status(200).send(orderDetails);
};
