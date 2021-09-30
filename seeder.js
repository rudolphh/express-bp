const mysqlPool = require("./database/dbPool");
const bcrypt = require("bcrypt");

const createUser = async (connection, username, password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    let now = new Date(); // get current date time
    //adjust for timezone
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    //convert to timestamp format
    now = now.toISOString().slice(0, 19).replace("T", " ");
    await connection.query(`
            INSERT INTO user (username, password, creation_date, updated_date) 
            VALUES ('${username}', '${hashedPassword}', '${now}', '${now}');`);
  } catch (err) {
    console.error(err);
  }
};

const seedDatabase = async () => {
  try {
    const connection = await mysqlPool.getConnection();

    // create database schema
    await connection.query("CREATE DATABASE IF NOT EXISTS express_bp_db");

    // drop user table if exists
    await connection.query(`
        DROP TABLE IF EXISTS user;`);

    // create user table in database
    await connection.query(`
        CREATE TABLE IF NOT EXISTS user (
            id INT NOT NULL AUTO_INCREMENT,
            username VARCHAR(15) NOT NULL,
            password CHAR(60) NOT NULL,
            creation_date TIMESTAMP,
            updated_date TIMESTAMP,
            PRIMARY KEY ( id )
        );`);

    // add record to user table
    createUser(connection, "imi", "blahblah3");
    createUser(connection, "rudy", "loveGod1");
    
  } catch (err) {
    console.error(err);
  }
};

module.exports = seedDatabase;
