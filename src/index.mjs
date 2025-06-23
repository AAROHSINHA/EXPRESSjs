import express, { request, response } from 'express'; 
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session"; // this is a middleware function
import { mockUsers } from './utils/constants.js';
import passport from "passport";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
// import "./strategies/local-strategy.mjs";


const app = express(); 

mongoose.connect('mongodb://localhost/express_tutorial')
.then(() => console.log("CONNECTED TO DATABASE!!"))
.catch((err) => console.log(err));

app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: 'express tutorial',
    saveUninitialized: false, 
    resave: false, 
    cookie: {
        maxAge: 60000 * 60, 
    },
    store: MongoStore.create({
        client: mongoose.connection.getClient()
    })
}));
app.use(passport.initialize()); 
app.use(passport.session());

// all middlewares must be before this 
app.use(routes);

app.post("/api/auth", 
    passport.authenticate('local'),
    (request, response) => {
        response.sendStatus(200);
    }
)

app.get("/api/auth/discord", passport.authenticate("discord"));
app.get("/api/auth/discord/redirect", passport.authenticate("discord"));

app.get("/api/auth/status", (request, response) => {
    console.log(`Inside /auth/status endpoint`);
    console.log(request.user);
    console.log(request.session);
    return request.user ? response.send(request.user) : response.sendStatus(401);
})

app.post("/api/auth/logout", (request, response) => {
    if(!request.user) return response.sendStatus(401);
    request.logOut((err) => {
        if(err) return response.sendStatus(400);
        response.sendStatus(200);
    })
})

const PORT = process.env.PORT || 3000;

app.get('/', (request, response) => {
    response.status(201).send("Hello World");
});

app.listen(PORT, () => {
    console.log(`Running on Port : ${PORT}`);
})

// client_secret: W_De4hNogWoPlXyoHmbDoFBZBK9OXSfT
// client_id: 1386818630016307370
// redirect_url: http://localhost:3000/api/auth/discord/redirect

