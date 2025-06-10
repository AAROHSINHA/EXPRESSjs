import express, { request, response } from 'express'; 

/*
Using POST request we can create data (like we can get data using GET request)
Whenever we need to send data using POST request we send it using payload/requestBody
*/

const app = express(); 

// registering the middlewear (for json
app.use(express.json());

/*
Note that there is not any specfic way to pass data from one middleware to another.
That is why what we can do is pass data to the response body as it gets passed to all
*/
const resolveIndexByUserId = (request, response, next) => {
    const {
    params: { id },
  } = request;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return response.sendStatus(400);
  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
  if (findUserIndex === -1) return response.sendStatus(404);
  request.findUserIndex = findUserIndex; // all upcoming requests have this findUserIndex property
  next();
}

// MIDDLEWARE
// middle ware is a function that does some logic but can also handle requests and responses
// the next is the function we call when we are done with middleware
// it specifies that we must move on the the next function in the route/stack
const loggingMiddleware = (request, response, next) => {
  console.log(`${request.method} - ${request.url}`);
  next(); // if we don't call the next function, the next middleware won't be called
};

// Enabling the middlewares globally
app.use(
  loggingMiddleware,  // Fixed variable name (was loggingMiddleWare)
  (request, response, next) => {
    console.log("MIDDLEWARE 2");  // Fixed string (was "MIDDLEWARE2")
    next();
  }, 
  (request, response, next) => {
    console.log("MIDDLEWARE 3");  // Consistent spacing
    next();
  }
);
// note that here are more than one middlewares
// so basically each gets called one after one
// if there was no next in suppose middleware2...middleware 3 wont have been called


/*
Note that middlewares must be registered before routes. Order matters in this case
*/

const PORT = process.env.PORT || 3000;
const mockUsers = [
    {id:1, username:"Anson", displayName: "Anson"},
    {id:2, username:"Aaroh", displayName: "Aaroh"},
    {id:3, username:"Bosch", displayName: "Bosch"},
    {id:4, username:"Clara", displayName: "Clara"},
    {id:5, username:"Derek", displayName: "Derek"},
    {id:6, username:"Elina", displayName: "Elina"},
    {id:7, username:"Farhan", displayName: "Farhan"},
    {id:8, username:"Gia", displayName: "Gia"},
    {id:9, username:"Hector", displayName: "Hector"},
    {id:10, username:"Ivy", displayName: "Ivy"}
];

// locally
app.get('/', (request, response) => {
    response.status(201).send("Hello World");
});
app.get('/api/users', (request, response) => {
    response.send(mockUsers);
});

// POST REQUEST
app.post('/api/users', (request, response) => {
    const {body} = request;
    const newUser = {id:mockUsers[mockUsers.length - 1].id + 1, ...body};
    mockUsers.push(newUser);
    return response.status(201).send(newUser);
})

app.get('/api/users/:id', resolveIndexByUserId, (request, response) => {
    const { findUserIndex } = request;
    const findUser = mockUsers[findUserIndex];
    if(!findUser){
        return response.sendStatus(404);
    }else{
        return response.send(findUser);
    }
});

app.get('/api/products', (request, response) => {
  response.send([{id:123, name:"Chicken Breast", price:9.99}]);
})

// PUT
app.put("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { body, findUserIndex } = request; // findUserIndex is defined
  mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
  return response.sendStatus(200);
});

// PATCH
app.patch("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { body, findUserIndex } = request;
  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
  return response.sendStatus(200);
});

// DELETE
app.delete("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { findUserIndex } = request;
  mockUsers.splice(findUserIndex);
  return response.sendStatus(200);
});


app.listen(PORT, () => {
    console.log(`Running on Port : ${PORT}`);
})
