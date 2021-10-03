require("dotenv").config("../.env");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createUser } = require("../seeder");

const createTokens = (payload) => {
  //jwt.sign takes a payload, most often string or object,
  // a secret key we grab from our user defined (.env) environment variables
  // and some options like 'expiresIn' for when the token will be invalid
  const token = jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: "10m",
  });
  const refresh_token = jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: "30m",
  });
  return [token, refresh_token];
};

// handler for login route
const login = async (req, res) => {
  // req.body is an object which contains the body values sent in the post request
  // we use destructuring here to extract the values into variables
  const { username, password } = req.body;
  // do validation here or use library

  try {
    if (!username || !password)
      throw new Error("no username or password given");

    // using namedPlaceholders in mysql2 we can use the :field syntax
    // as a placeholder in the sql statement and in the next argument
    // to query pass an object with properties corresponding to those placeholders
    const [results] = await req.db.query(
      "SELECT * FROM user WHERE username=:username",
      { username }
    );

    if (results.length === 0)
      throw new Error("username or password are invalid");

    // since results returns an array, the first value is the user
    const user = results[0];

    const passwordMatching = await bcrypt.compare(password, user.password);
    if (!passwordMatching) throw new Error("username or password are invalid");

    const [token, refresh_token] = createTokens({ id: user.id });
    user.password = undefined;// remove password field before sending user info
    res.send({ user, token, refresh_token });
  } catch (err) {
    console.error(err);
    res.send({ error: err.message });
  }
  // release the db connection given from the pool in dbConnection middleware
  req.db.release();
};

// handler for register route
const register = async (req, res) => {
  const { username, password } = req.body;
  // do validation here or use library

  try {
    if (!username || !password)
      throw new Error("no username or password given");

    // here we just reuse the function created in seeder instead of having
    // to do it all again here.
    const insertedId = await createUser(req.db, username, password);
    if(!insertedId) throw new Error("Username already exists");

    const [token, refresh_token] = createTokens({ id: insertedId });
    res.status(201).send({ id: insertedId, token, refresh_token });
  } catch (err) {
    console.error(err);
    res.send({ error: err.message });
  }
  req.db.release();
};

// export these functions as an object to be brought into a router
module.exports = { login, register };
