const mongoDb = require("../mongodb");
const jwt = require("jsonwebtoken");
const { dateToISo, nanoId } = require("../handler/function");
const { config } = require("../global");
//user auth
exports.signUp = async (req, res) => {
  try {
    let {
      name = null,
      email = null,

      phone = null,
      tableNumber,
      items,
    } = req.body;
    if (name && email && phone) {
      let token = jwt.sign(req.body, config.jwt.ACCESSTOKEN);
      res.status(201).json({ token, items });
      // // dateToISo
      items.forEach((item) => {
        mongoDb
          .get("menus")
          .updateOne({ item: item.item }, { $inc: { count: item.quantity } });
        item["createdOn"] = dateToISo();
        item["phone"] = phone;
        item["isCompleted"] = false;
        item["tableNumber"] = tableNumber;
      });
      let insertDetails = Promise.all([
        mongoDb
          .get("users")
          .updateOne(
            { $or: [{ email: email }, { phone, phone }] },
            { $set: { email, name, phone, token } },
            { upsert: true }
          ),
        mongoDb.get("orders").insertMany(items),
        mongoDb
          .get("tables")
          .updateOne(
            { tableNumber: parseInt(tableNumber) },
            { $set: { isOccupied: true } }
          ),
      ]);
    } else {
      return res.status(409).send("All fields are required");
    }
  } catch (error) {
    return res.sendStatus(500);
  }
};

exports.signOut = async (req, res) => {
  try {
    let { tableNumber, phone } = req.body;
    let updateDetails = await Promise.all([
      mongoDb.get("orders").updateMany(
        {
          $and: [
            { phone: phone },
            { tableNumber: parseInt(tableNumber) },
            { isCompleted: false },
          ],
        },
        { $set: { isCompleted: true } }
      ),
      mongoDb
        .get("tables")
        .updateOne(
          { tableNumber: parseInt(tableNumber) },
          { $set: { isOccupied: false } }
        ),
      mongoDb.get("users").update({ phone: phone }, { $unset: { token: "" } }),
    ]);
    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(500);
  }
};

exports.recentOrders = async (req, res) => {
  try {
    let { email, phone } = req.user;
    if (email && phone) {
      let orderDetails = await mongoDb
        .get("orders")
        .find({ $or: [{ email }, { phone }] })
        .project({ _id: 0, item: 1, price: 1 })
        .sort({ date: -1, quantity: -1 })
        .limit(6)
        .toArray();

      if (!orderDetails?.length) {
        return res.status(200).send([]);
      }
      return res.status(200).send(orderDetails);
    }
    return res.status(409).send("User details required to show recent orders");
  } catch (error) {
    return res.sendStatus(500);
  }
};

exports.predictionModal = async (req, res) => {
  let data = req.body;
  let userAuth = await mongoDb.get("orders").findOne({ phone: phone });
  if (userAuth) {
    let pipelines = [];
    pipelines = [
      {
        $match: {
          $amd: [{ phone: data }, { isCompleted: true }],
        },
      },
      {
        $group: {
          _id: { item: item },
          foods: {
            $addToSet: {
              item: "$item",
              quantity: "$quantity",
              price: "$price",
            },
          },
          count: { $sum: "$quantity" },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        limit: 6,
      },
    ];
    let details = await mongoDb.get("orders").aggregate(pipelines).toArray();
    if (!details?.length) {
      return res.status(200).send([]);
    }
    return res.status(200).send(details);
  } else {
    let details = await mongoDb
      .get("menus")
      .find()
      .project({ _id: 0, item: 1, count: 1 })
      .sort({ count: -1 })
      .limit(10)
      .toArray();
    if (!details?.length) {
      return res.status(200).send([]);
    }
    return res.status(200).send(details);
  }
};
