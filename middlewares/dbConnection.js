const mysqlPool = require('../database/dbPool');

const dbConnection = async (req, res, next) => {
    // get a connection from the pool
    const connection = await mysqlPool.getConnection();
    connection.config.namedPlaceholders = true;
    req.db = connection;
    next();
};

module.exports = dbConnection;
