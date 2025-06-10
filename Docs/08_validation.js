import express, { request, response } from 'express'; 
import { query, validationResult, body, matchedData } from "express-validator";
// query is used for validating queries
// body is for validating the request Bodies

const app = express(); 

// registering the middlewear (for json
app.use(express.json());

const resolveIndexByUserId = (request, response, next) => {
    const {
    params: { id },
  } = request;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return response.sendStatus(400);
  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
  if (findUserIndex === -1) return response.sendStatus(404);
  request.findUserIndex = findUserIndex; 
  next();
}

const loggingMiddleware = (request, response, next) => {
  console.log(`${request.method} - ${request.url}`);
  next();
};

app.use(
  loggingMiddleware,  
  (request, response, next) => {
    console.log("MIDDLEWARE 2");  
    next();
  }, 
  (request, response, next) => {
    console.log("MIDDLEWARE 3"); 
    next();
  }
);


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

// we wanna validate query parameter - filter
// note that there are also validation chain after it
// note that .isLength will give error message if any as specified in withMessage
app.get('/api/users'
  ,query('filter')
  .isString()
  .notEmpty().withMessage('Must Not be empty')
  .isLength({min: 3, max: 10}).withMessage('Must be atlease 3 to 10 characters'),
   (request, response) => {
    /*
    The query function above just perform the task no matter what
    They dont throw any error. That error handling we need to do ourselves
    */
    const result = validationResult(request);

    // this result will be an object. it will have an error property
    // that errors witll be an array of differenet errors
    const { 
      query: {filter , value}
     } = request;
    if(!filter && !value) return response.status(201).send(mockUsers);
    if(filter && value) return response.send(
        mockUsers.filter((user) => user[filter].includes(value))
    )
});
// POST REQUEST
// we apply validation to username propert of the REQUEST BODY
// if we were to validate multiple properties such as username/id/displayname we can add them in arrays
app.post('/api/users', 
  [body('username')
  .notEmpty().withMessage("username cannot be emoty")
  .isLength({min: 5, max: 32}).withMessage('Username must be atleast 5 characters with a max of 32 characters')
  .isString().withMessage("UserName must be a string"),

  body("displayName").notEmpty()
  ]
  ,(request, response) => {
    const result = validationResult(request);

    // error handler
    if(!result.isEmpty()){
      return response.status(400).send({errors: result.array()}); // gives all validation errors in array
    }

    const data = matchedData(request);
    console.log(data);
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
