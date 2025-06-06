// Importing express (default export) and response (named export, though not needed here) from the express package
import express, { response } from 'express'; 

// Creating an instance of an Express application
const app = express(); 

// Setting a PORT to listen on. If process.env.PORT is not set (in production), use 3000 (for local dev)
const PORT = process.env.PORT || 3000;

// Route handler for the home page ('/')
// When someone sends a GET request to the root URL, send a 201 Created status and a plain text response
app.get('/', (request, response) => {
    response.status(201).send("Hello World");
});

// Route handler for '/api/users'
// Responds to GET requests with a static array of user objects in JSON format
app.get('/api/users', (request, response) => {
    response.send([
        {id: 1, username: "Anson", displayName: "Anson"},
        {id: 2, username: "Aaroh", displayName: "Aaroh"},
        {id: 3, username: "Bosch", displayName: "Bosch"}
    ]);
});

// Route handler for '/api/products'
// Responds to GET requests with a static array of product objects
app.get('/api/products', (request, response) => {
    response.send([{id: 123, name: "Chicken Breast", price: 299}]);
});

// Start the server and listen on the specified PORT
// When the server starts, log the port number to the console
app.listen(PORT, () => {
    console.log(`Running on Port : ${PORT}`);
});
