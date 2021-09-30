require('dotenv').config({ path: '../.env'});
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

    // console.log(req.headers)
    // req.headers is an object with information sent with the request
    // the token is held in the authorization header
    const token = req.headers['authorization'] && req.headers['authorization'].replace('Bearer ', '');

    try {
        if(!token) return res.status(400).send({ error: 'token not provided'});

        // verify the token is valid
        const payload = jwt.verify(token, process.env.SECRET_KEY);
        
        // if invalid it will throw an exception so no need to check it
        // if we're at this point the token was valid and payload has id
        // that we set when we signed it 

        // lets attach that id to the request and pass it to the "next"
        // middleware function or route
        req.userId = payload.id;
        next();

    } catch (err) {
        console.error(err);
        res.send({ error: err.message });
    }


};