import passport from "passport";
import {Strategy} from 'passport-discord';

export default passport.use(
    new Strategy({
        clientID: '1386818630016307370',
        clientSecret: ' W_De4hNogWoPlXyoHmbDoFBZBK9OXSfT',
        callbackURL: 'http://localhost:3000/api/auth/discord/redirect',
        scope: ['identify', 'guilds']
    }, 
    (accesToken, refreshToken, profile, done) => {
        console.log(profile)
    })
)
