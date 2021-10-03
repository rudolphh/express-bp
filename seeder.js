const mysqlPool = require("./database/dbPool");
const bcrypt = require("bcrypt");

const createUser = async (connection, username, password) => {
  // enable mysql2 named placeholders syntax
  connection.config.namedPlaceholders = true;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    let now = new Date(); // get current date time
    //adjust for timezone
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    //convert to timestamp format
    now = now.toISOString().slice(0, 19).replace("T", " ");

    const [results] = await connection.query(
      `INSERT INTO user (username, password, created_date, updated_date) 
        VALUES (:username, :hashedPassword, :now, :now)`,
      { username, hashedPassword, now }
    );

    return results.insertId;
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
            username VARCHAR(15) UNIQUE NOT NULL,
            password CHAR(60) NOT NULL,
            created_date TIMESTAMP,
            updated_date TIMESTAMP,
            PRIMARY KEY ( id )
        );`);

    // add record to user table
    createUser(connection, "imi", "loveDaddy3");
    createUser(connection, "rudy", "loveGod1");
    createUser(connection, "honey", "loveLove33");
  } catch (err) {
    console.error(err);
  }
};

module.exports = { seedDatabase, createUser };
