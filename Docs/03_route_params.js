import express, { response } from 'express'; 

const app = express(); 
const PORT = process.env.PORT || 3000;
const mockUsers = [
    {id:1, username:"Anson", displayName: "Anson"},
    {id:2, username:"Aaroh", displayName: "Aaroh"},
    {id:3, username:"Bosch", displayName: "Bosch"}
];

// Now use mockUsers in both routes


// Home (default) route
app.get('/', (request, response) => {
    response.status(201).send("Hello World");
});

// THIS IS A ROUTE
app.get('/api/users', (request, response) => {
    response.send(mockUsers);
});

// THIS IS A ROUTE PARAMATER
app.get('/api/users/:id', (request, response) => {
    console.log(request.params); // gives the route parameters
    // note that in the users route, the objects have the attribute of id
    // that is why we use id as a parameter (not a defulat convention or so)
    // but id in the params will be string and we have numbers in the object
    // so let us do little validatiopn for out get requests
    const parsed_id = parseInt(request.params.id);

    // we need to check if the value is valid
    if(isNaN(parsed_id)){
        return response.status(400).send("Bad Request! INVALID ID");
    }

    // finding the user id
    const findUser = mockUsers.find((user) => user.id===parsed_id);
    if(!findUser){
        // means that user doesnot exist
        return response.sendStatus(404);
    }else{
        return response.send(findUser);
    }
})


app.listen(PORT, () => {
    console.log(`Running on Port : ${PORT}`);
})
