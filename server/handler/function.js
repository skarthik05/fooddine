exports.dateToISo = () => {
  let d = new Date();
  let date = new Date(
    d.getFullYear(),
    d.getMonth(),
    d.getDate() + 1
  ).toDateString();

  const isoDate = new Date(new Date(date).toISOString());
  return isoDate;
};
function S4() {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}
exports.nanoId = () => (S4() + S4() + "-" + S4()).toLowerCase();
