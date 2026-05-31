const mysql2 = require("mysql2");
require("dotenv").config();

const pool = mysql2
    .createPool({
        host: process.env.HOST || "localhost",
        user: process.env.USER || "root",
        password: process.env.PASSWORD || "root",
        port: process.env.PORT || 3306,
        database: process.env.DATABASE || "world"
    })
    .promise();

module.exports = pool;
