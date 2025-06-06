import express, { response } from "express";

// setting up the app
const app = express();

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
    response.status(200).send("WELCOME TO THE NOTES APP")
})



// setting up the server
const PORT = 8000;
app.listen(PORT, (error) => {
    if(error) throw new Error(error);
    console.log(`Server running on Port : ${PORT}`);
})