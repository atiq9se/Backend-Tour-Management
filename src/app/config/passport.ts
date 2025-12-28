import passport = require("passport");
import {Strategy as GoogleStrategy, VerifyCallback, Profile } from "passport-google-oauth20";
import env = require("./env");

passport.use(
    new GoogleStrategy(
        {
            clientID: env.envVars.GOOGLE_CLIENT_ID,
            clientSecret: env.envVars.GOOGLE_CLIENT_SECRET,
            callbackURL: env.envVars.GOOGLE_CALLBACK_URL
        }, async(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback)=>{
            try{

            } catch(error){
                
            }
        }
    )
)