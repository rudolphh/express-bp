
// handler for login route
const login = (req, res) => {
  res.send("login");
};

// handler for register route
const register = async (req, res) => {
  try {
    const [results] = await req.db.query("SELECT * FROM car WHERE id=?", [1]);
    res.send(results);
  } catch (err) {
    console.error(err);
  }
  req.db.release();
};

// export these functions as an object to be brought into a router
module.exports = { login, register };
