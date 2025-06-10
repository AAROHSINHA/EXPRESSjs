import express, { request, response } from 'express'; 
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";


const app = express(); 
app.use(express.json());
app.use(cookieParser);
app.use(routes);
const PORT = process.env.PORT || 3000;

app.get('/', (request, response) => {
    // sending cookies
    // [name of cookie, value, options..here we add the cookie expiry]
    // cookie takes the expiry maxAge as milisecond and thats its lifespan
    // here we provide an hour
    response.cookie('hello', 'world', {maxAge: 60000*60})
    response.status(201).send("Hello World");
});

app.listen(PORT, () => {
    console.log(`Running on Port : ${PORT}`);
})
