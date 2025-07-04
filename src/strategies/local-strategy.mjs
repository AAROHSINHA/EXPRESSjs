import passport from "passport";
import {Strategy} from 'passport-local';
import { mockUsers } from "../utils/constants.js";

passport.serializeUser((user, done) => {
    console.log(`Inside Serialize User`);
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    console.log(`Inside Deserializer`);
    try {
        const findUser = mockUsers.find((user) => user.id == id);
        if (!findUser) throw new Error("User Not Found");
        done(null, findUser);
    } catch (err) {
        done(err, null);
    }
});

export default passport.use(
    new Strategy((username, password, done) => {
        console.log(`Username: ${username}`);
        console.log(`Password: ${password}`);
        try{
            const findUser = mockUsers.find((user) => user.username === username);
            if(!findUser) throw new Error('User Not Found');
            if(findUser.password !== password) throw new Error("Invalid Credentials");
            done(null, findUser);
        }catch(err){
            done(err, null);
        }
    })
)