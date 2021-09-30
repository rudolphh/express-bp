

const login = (req, res) => {
    res.send('login')
};

const register = async (req, res) => {
    const [results] = await req.db.query('SELECT * FROM car')
    res.send(results);
};

// export these functions as an object to be brought into a router
module.exports = { login, register };