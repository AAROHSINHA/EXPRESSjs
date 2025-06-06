import express, { response } from "express";

// setting up the app
const app = express();
app.use(express.json());

// data
const users = [
  {
    id: 1,
    username: "Anson",
    notes: [
      { id: 1, content: "Finish homework" },
      { id: 2, content: "Read Express docs" }
    ]
  },
  {
    id:2,
    username: "Rohit", 
    notes: [
        {id: 1, content: "5km Run"},
        {id: 2, content: "Complete Project PPT"},
        {id: 3, content: "Read Mutual Fund Metrics"}
    ]
  }
];

// setting the basic homepage
// this is a get api
app.get("/", (request, response) => {
    response.status(200).send("WELCOME TO THE NOTES APP");
});

// display users only
app.get("/api/users", (request, response) => {
    response.status(200).send(users);
});

// getting the username by id
app.get("/api/users/:id", (request, response) => {
    const request_params = request.params;
    const requested_id = request_params.id;
    const parsed_id = parseInt(requested_id);
    if(isNaN(parsed_id)) response.status(400).send("Invalid Id");
    if(parsed_id <= 0 || parsed_id > users.length) response.status(400).send("Id out of bounds");
    return response.status(200).send(users.filter((user) => user.id === parsed_id));
})

// pushing data in users
app.post("/api/users", (request, response) => {
    // here we will post some data right? it is the body. And it is a pushing query it is the request
    const {body} = request;
    const newUser = {id: users[users.length - 1].id+1, ...body};
    users.push(newUser);
    response.status(201).send(users);

})


// setting up the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, (error) => {
    if(error) throw new Error(error);
    console.log(`Server running on Port : ${PORT}`);
})