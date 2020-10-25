const mysql = require("mysql");

const mysqlconecct = mysql.createConnection({
  host: "remotemysql.com",
  database: "88yaGEqpOx",
  user: "88yaGEqpOx",
  password: "yHSc4MzckG",
  port: 3306,
});

mysqlconecct.connect(function (err) {
  if (err) {
    console.log(err);
    return;
  } else {
    console.log("Db is connect");
  }
});

module.exports = mysqlconecct;