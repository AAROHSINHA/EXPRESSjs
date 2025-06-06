import express from 'express'; // this is a top level function
// we need to invoke the express to use its features

const app = express(); // now we can use the methods by app

// This starts the server on any port and then we can send http requests on it
const PORT = process.env.PORT || 3000;

app.get('/', (request, response) => {
    response.status(201).send("Hello World");
});

app.listen(PORT, () => {
    console.log(`Running on Port : ${PORT}`);
})
// we use the callback function to do some tasks after the PORT is connected
// because this is a callback function it will run as soon as the port gets connected succesfully

/*
==>
Now note that we have just connected to the server with normal - 
app.listen(PORT, () => {
    console.log(`Running on Port : ${PORT}`);
})
Only by this we wong get anything. We need to setup routes
Route is a path in the application eg - localhost:3000/users

==> Hence we setup a simple get request at top
app.get('/', (request, response) => {
    response.send("Hello World");
});
1. The request is the http request made my the client
2. The response is the response by the server

*/