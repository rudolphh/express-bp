const mysqlPool = require('../database/dbPool');

const dbConnection = async (req, res, next) => {
    // get a connection from the pool
    const connection = await mysqlPool.getConnection();
    req.db = connection;
    req.db.connection.config.namedPlaceholders = true;
    await req.db.query(`SET SESSION sql_mode = "TRADITIONAL"`);
    await req.db.query(`SET time_zone = '-8:00'`);
    next();
};

module.exports = dbConnection;
