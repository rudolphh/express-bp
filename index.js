// loads all environment variables in .env file and adds to process.env (system global EVs)
// looks in same directory by default for the .env file
// unless specified in config options object passed into .config()
// example: require('dotenv').config({ path: '/custom/path/to/.env' })
require('dotenv').config();
const express = require('express');// include express module (require - CommonJS module system)

// top level function that gives us routing PLUS EXTRA functions available only for the app
// not to be confused later with express.Router();
const app = express();
const port = 3030;// process.env.PORT - PORT defined in .env added to node's global process.env 

// app.use mounts a middleware to a specified path (root if no path given)

// express built-in middlewares (.json and .urlencoded)
// with .use this middleware will be run on ALL post and put requests
// it isn't necessary for get and delete requests

// .json() accepts body as json when sending the request (parses json)
// so: { "id": 1, "username": "john"}
app.use(express.json());// for parsing application/json

// .urlencoded() accepts body as urlencoded (parses url encoded strings )
// so: path/name?id=1&username=john
// extended means it will accept a url encoding syntax (qs library)
// to mimic a json-like structure
// so: path/name?person[name]=bobby&person[age]=3
// { person: { name: 'bobby', age: '3' } }
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// sets up a virtual path (e.g. http://site.com/assets) for files (css, js, images, etc.)
// to make publicly available to the client (browser)
// so something like an image in the public folder '/public/images/kitty.jpg' can be
// viewed in the browser at http://site.com/assets/images/kitty.jpg
app.use('/assets', express.static('public'));

// .route is used to create chainable route handlers, so
// you don't have to keep writing out the path like below
app.route('/hello')
    .get((req, res) => {
        // .status useful when we start dealing with various server responses
        // 200 - OK
        // 400 - Bad Request - general server error
        // 404 - Not Found - the server can't find the requested resource
        // 401 - Unauthorized - lacks authentication
        // 403 - Forbidden - lacks authorization (has been authenticated but not authorized for this resource)
        // 500 - Internal Server Error - generic response when no other error code is suitable
        res.status(200).send('hello');
        // res.status(200).json({ hello: 'world' });
    })

    // important: GET, POST, PUT, DELETE are just conventions.
    // one can still send a body to a GET endpoint, and process it,
    // but this IS NOT best practice

    // send a post request (postman) using body as either 
    // "raw" application/json or application/x-www-form-urlencoded
    .post((req, res) => {
        res.status(200).json({
            body : req.body,
        });
    })

    .put((req, res) => {
        //TODO: make a mysql update
    })

    .delete((req, res) => {
        // TODO: make a mysql delete
    });

// without using .route we have .get and .post with the same path (could be error-prone)
app.get('/hello-world', (req, res) => {
    // if we want to serve a static file within an endpoint,
    // give the filename path and where its relative to
    // in this case the root directory of the project (base path) plus '/public' (relative path)
    res.status(200).sendFile('./index.html', { root: __dirname + '/public' });
});

app.post('/hello-world', (req, res) => {

});

// Binds and listens for connections on the specified host and port
// if port isn't mentioned the system will find an unused one (see below)
// callback isn't necessary but useful once connected
// app.listen(port);
app.listen(port, (err) => {
    if (err) console.log("Error in server setup")
    console.log(`Server listening on port ${port}`);
});

// const server = app.listen(((err) => {
//     if (err) console.log("Error in server setup")
//     console.log(`Server listening on port ${server.address().port}`);
// }));

