const mongoDb = require("../mongodb");

exports.tableStatus = async (req, res) => {
  let tableStats = await mongoDb
    .get("tables")
    .find()
    .project({ _id: 0 })
    .toArray();
  if (!tableStats?.length) {
    return res.status(200).send([]);
  }
  return res.status(200).send(tableStats);
};

exports.tableInformation = (req, res) => {};
