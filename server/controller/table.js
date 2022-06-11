const mongoDb = require("../mongodb");

exports.tableStatus = async (req, res) => {
  try {
    let tableStats = await mongoDb
      .get("tables")
      .find()
      .project({ _id: 0 })
      .toArray();
    if (!tableStats?.length) {
      return res.status(200).send([]);
    }
    return res.status(200).send(tableStats);
  } catch (error) {
    return res.sendStatus(500);
  }
};

exports.tableInformation = (req, res) => {};
