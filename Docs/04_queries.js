import express, { response } from 'express'; 

/*
Example of query string - 
localhost:3000/products?key1=value1&key2=value2
*/

const app = express(); 
const PORT = process.env.PORT || 3000;
const mockUsers = [
    { id: 1, username: "Anson", displayName: "Anson" },
    { id: 2, username: "Aaroh", displayName: "Aaroh" },
    { id: 3, username: "Bosch", displayName: "Bosch" },
    { id: 4, username: "Clara", displayName: "Clara D" },
    { id: 5, username: "Dev", displayName: "Devendra" },
    { id: 6, username: "Esha", displayName: "Esha S" },
    { id: 7, username: "Farhan", displayName: "Farhan A" },
    { id: 8, username: "Gia", displayName: "Gia M" },
    { id: 9, username: "Hari", displayName: "Hari Krishnan" },
    { id: 10, username: "Ivy", displayName: "Ivy N" }
];

app.get('/', (request, response) => {
    response.send("Hello World");
});
app.get('/api/users', (request, response) => {
    // getting the query from request (like we got params)
    console.log(request.query); // we get an object of the query
    // that query can be anyhting. It depends on what we do from the recieved query

    // we are getting a query which wants us to filter usernames with displayname containing 'a'
    const { query: {filter , value} } = request;
    // means the query contains filter and value named tags

    // when filter and value are undefined
    if(!filter && !value) return response.status(201).send(mockUsers);

    if(filter && value) return response.send(
        mockUsers.filter((user) => user[filter].includes(value))
    )
});
app.get('/api/users/:id', (request, response) => {
    console.log(request.params); 
    const parsed_id = parseInt(request.params.id);
    if(isNaN(parsed_id)) return response.status(400).send("Bad Request! INVALID ID");
    const findUser = mockUsers.find((user) => user.id===parsed_id);
    if(!findUser)return response.sendStatus(404);
    return response.send(findUser);
})


app.listen(PORT, () => {
    console.log(`Running on Port : ${PORT}`);
})
