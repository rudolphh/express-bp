const express = require('express');

// Router is like express(), but more like a mini-app,
// ONLY capable of performing middleware given (router.use) and routing.

// is used like middleware when the object exported (module.exports)
// is provided to the app.use to expand the routes of the application
const auth = express.Router();// could call it 'router' but 'auth' better choice

// for parsing raw json or x-www-form-urlencoded as the body of the request
auth.use(express.json());
auth.use(express.urlencoded({ extended: true }));

// use the middleware we created for getting a connection from the pool
// and provide it to all routes within this router in order to use the db
auth.use(require('../middlewares/dbConnection'));

// bring in the authController object with its functions 
// for handling auth routes requests and responses
const authController = require('../controllers/authController');

auth.post('/login', authController.login);
auth.post('/register', authController.register);

module.exports = auth;