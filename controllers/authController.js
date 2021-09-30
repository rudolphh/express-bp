

const login = (req, res) => {
    res.send('login')
};

const register = (req, res) => {
    res.send('register')
};

// export these functions as an object to be brought into a router
module.exports = { login, register };