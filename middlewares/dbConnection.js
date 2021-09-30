const mysqlPool = require('../database/dbPool');

const dbConnection = async (req, res, next) => {
    const connection = await mysqlPool.getConnection();
    req.db = connection;
    next();
};

module.exports = dbConnection;
