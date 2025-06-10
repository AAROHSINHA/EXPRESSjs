import express, { request, response } from 'express'; 
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session"; // this is a middleware function
import { mockUsers } from './utils/constants.js';


const app = express(); 
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: 'express tutorial',
    saveUninitialized: false, // when we dont want to store session data until user does some changes. Suppose user just visits the site and leaves. He hasnt done anything meaningful for the info to store. Making this false makes sure such session data wont be stored in the session store.
    resave: false, // resave means forcing sessions to be stores in the session store even if they arent modified. Making it false means they wont we saved until modified.
    cookie: {
        maxAge: 60000 * 60, // cookie expires in 1 hour
    }
}));

// all middlewares must be before this 
app.use(routes);
const PORT = process.env.PORT || 3000;

app.get('/', (request, response) => {
    console.log(request.session);
    console.log(request.session.id);
    request.session.visited = true;
    // means session id will be same at every request and we can now track the user.

    // sending cookies
    // [name of cookie, value, options..here we add the cookie expiry]
    // cookie takes the expiry maxAge as milisecond and thats its lifespan
    // here we provide an hour
    response.cookie('hello', 'world', {maxAge: 60000*60});
    response.status(201).send("Hello World");
});

app.listen(PORT, () => {
    console.log(`Running on Port : ${PORT}`);
})

app.post("/api/auth", (request, response) => {
    const {body: {username, password}} = request;
    // whenever we make this request we must get the username
    const findUser = mockUsers.find(
        user =>  user.username === username
    )
    if(!findUser || findUser.password !== password) return response.status(401).send({msg: "BAD CREDENTIALS"});

    // we want to modify the session object
    // we nede to stop creating new sessions each time
    // we want express to make session once
    // make the cookie in it. Send it to browser and client
    // hence when client sends another request, we can look at the sessiom id and
    // the session data and check which user belongs to the session id
    request.session.user = findUser;
    return response.status(200).send(findUser);

    
});

// this tells whether the user is authenticated or not
app.get("/api/auth/status", (request, response) => {
    request.sessionStore.get(request.sessionID, (err, session) => {
        console.log(session);
    })
    return request.session.user ? response.status(200).send(request.session.user) : response.status(401).send({msg: "NOT AUTHENTICATED"});
})

app.post("/api/cart", (request, response) => {
    if(!request.session.user) return response.sendStatus(401);
    const { body: item } = request;
    
    const { cart } = request.session;
    if(cart){
        cart.push(item);
    }else{
        request.session.cart = [item];
    }
    return response.status(201).send(item);
})
app.get("/api/cart", (request, response) => {
    if(!request.session.user) return response.sendStatus(401);
    return response.send(request.session.cart ?? []);
})