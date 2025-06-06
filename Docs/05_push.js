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


app.listen(PORT, () => {
    console.log(`Running on Port : ${PORT}`);
})
