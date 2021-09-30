require('dotenv').config('../.env');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// handler for login route
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if(!username || !password)
            throw new Error('no username or password given');

        const [results] = await req.db.query("SELECT * FROM user WHERE username=:username", { username });
        const user = results[0]
        const passwordMatching = await bcrypt.compare(password, user.password);

        if(!passwordMatching) throw new Error('password mismatch')
        
        const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: '10m'});
        const refresh_token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: '30m'});

        res.send({ token, refresh_token });
    } catch (err) {
        console.error(err);
        res.send({ error: err.message });
    }
  
};

// handler for register route
const register = async (req, res) => {
  try {
    const [results] = await req.db.query("SELECT * FROM user WHERE id=:id", {id: 1});
    res.send(results);
  } catch (err) {
    console.error(err);
  }
  req.db.release();
};

// export these functions as an object to be brought into a router
module.exports = { login, register };
