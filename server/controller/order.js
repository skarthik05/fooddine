const { dateToISo } = require("../handler/function");
const mongoDb = require("../mongodb");
exports.createOrders = async (req, res) => {
  try {
    let { tableNumber, items } = req.body;
    let { phone } = req.user;
    for (let item of items) {
      let query = {
        $and: [
          {
            phone: phone,
            tableNumber: parseInt(tableNumber),
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
        item["tableNumber"] = tableNumber;
        mongoDb.get("orders").insertOne(item);
      }
    }
    return res.status(200).send(items);
  } catch (error) {
    return res.sendStatus(500);
  }
};

exports.listCurrentOrders = async (req, res) => {
  try {
    let pipeline = [
      {
        $match: {
          $and: [{ createdOn: dateToISo() }, { isCompleted: false }],
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
              phone:"$phone"
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
      .toArray();
   
    if (!orderList?.length) {
      return res.status(200).send([]);
    }
    return res.status(200).send(orderList);
  } catch (error) {
    console.log('====================================');
    console.log(error);
    console.log('====================================');
    return res.sendStatus(500);
  }
};

exports.filterOrders = async (req, res) => {
  try {
    let { date = dateToISo() } = req.body;
    let orderDetails = await mongoDb
      .get("orders")
      .find({ date: date })
      .toArray();
    if (!orderDetails?.length) {
      return res.status(200).send([]);
    }
    return res.status(200).send(orderDetails);
  } catch (error) {
    return res.sendStatus(500);
  }
};

exports.listOrders = async (req, res) => {
  try {
    let orderDetails = await mongoDb
      .get("menus")
      .find({})
      .project({ _id: 0, item: 1, price: 1, count: 1 })
      .sort({ count: -1 })
      .limit(6)
      .toArray();
    if (!orderDetails?.length) {
      return res.status(200).send([]);
    }
    return res.status(200).send(orderDetails);
  } catch (error) {
    return res.sendStatus(500);
  }
};
