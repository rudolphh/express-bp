require("dotenv").config("../.env");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createUser } = require("../seeder");

// handler for login route
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      throw new Error("no username or password given");

    const [results] = await req.db.query(
      "SELECT * FROM user WHERE username=:username",
      { username }
    );
    const user = results[0];
    const passwordMatching = await bcrypt.compare(password, user.password);

    if (!passwordMatching) throw new Error("password mismatch");

    const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
      expiresIn: "10m",
    });
    const refresh_token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
      expiresIn: "30m",
    });

    res.send({ token, refresh_token });
  } catch (err) {
    console.error(err);
    res.send({ error: err.message });
  }
  req.db.release();
};

// handler for register route
const register = async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password)
      throw new Error("no username or password given");

    // do validation here

    const insertedId = await createUser(req.db, username, password);
    const token = jwt.sign({ id: insertedId }, process.env.SECRET_KEY, {
      expiresIn: "10m",
    });
    const refresh_token = jwt.sign({ id: insertedId }, process.env.SECRET_KEY, {
      expiresIn: "30m",
    });

    res.status(201).send({ token, refresh_token });
  } catch (err) {
    console.error(err);
    res.send({ error: err.message });
  }
  req.db.release();
};

// export these functions as an object to be brought into a router
module.exports = { login, register };
