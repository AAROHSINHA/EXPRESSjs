import express, { response } from 'express'; 

/*
Using POST request we can create data (like we can get data using GET request)
Whenever we need to send data using POST request we send it using payload/requestBody
*/

const app = express(); 

// registering the middlewear (for json
app.use(express.json());

const PORT = process.env.PORT || 3000;
const mockUsers = [
    {id:1, username:"Anson", displayName: "Anson"},
    {id:2, username:"Aaroh", displayName: "Aaroh"},
    {id:3, username:"Bosch", displayName: "Bosch"}
];
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

app.get('/api/users/:id', (request, response) => {
    const parsed_id = parseInt(request.params.id);
    if(isNaN(parsed_id)){
        return response.status(400).send("Bad Request! INVALID ID");
    }
    const findUser = mockUsers.find((user) => user.id===parsed_id);
    if(!findUser){
        return response.sendStatus(404);
    }else{
        return response.send(findUser);
    }
})

// PUT 
app.put("/api/users/:id", (request, response) => {
    const { body, params: { id } } = request;
    const parsedId = parseInt(id);
    if(isNaN(parsedId)) return response.sendStatus(400); // bad request
    // to update we need to get the user by index
    const findUserIndex = mockUsers.findIndex(
        (user) => user.id === parsedId
    )

    // litle bit validation
    if(findUserIndex === -1) return response.statusCode(404); // error
    mockUsers[findUserIndex] = { id: parsedId, ...body };
    return response.sendStatus(200);
})

// PATCH
app.patch("/api/users/:id", (request, respnse) => {
    const { body, params: { id } } = request;
    const parsedId = parseInt(id);
    if(isNaN(parsedId)) return response.sendStatus(400); // bad request
    // to update we need to get the user by index
    const findUserIndex = mockUsers.findIndex(
        (user) => user.id === parsedId
    )
    if(findUserIndex === -1) return response.sendStatus(404);
    // in pull request we updated the entire thing and made a new object and overwritten the current user
    // in patch we do not overwrite entire thing
    mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
    return respnse.sendStatus(200);
})

app.delete("/api/users/:id", (request, response) => {
    const { params: {id} } = request;
    const parsed_id = parseInt(id);
    if(isNaN(parsed)) return response.send(sendStatus(400));

    // we will remove the user
    const findUserIndex = mockUsers.findIndex((user) => user.id === parsed_id);
    if(findUserIndex === -1) return response.sendStatus(-1);
    mockUsers.splice(findUserIndex);
    return response.sendStatus(200);
})


app.listen(PORT, () => {
    console.log(`Running on Port : ${PORT}`);
})
