import passport = require("passport");
import {Strategy as GoogleStrategy, VerifyCallback, Profile } from "passport-google-oauth20";
import env = require("./env");
import userModel = require("../modules/user/user.model");
import userInterface = require("../modules/user/user.interface");
import User = require("../modules/user/user.model");

passport.use(
    new GoogleStrategy(
        {
            clientID: env.envVars.GOOGLE_CLIENT_ID,
            clientSecret: env.envVars.GOOGLE_CLIENT_SECRET,
            callbackURL: env.envVars.GOOGLE_CALLBACK_URL
        }, async(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback)=>{
            try{
                const email = profile.emails?.[0].value;

                if(!email){
                    return done(null, false, {message: "no email found"})
                }

                let user = await userModel.User.findOne({email})

                if(!user){
                    user = await User.create({
                        email,
                        name: profile.displayName,
                        picture: profile.photos?.[0].value,
                        role: userInterface.Role.USER,
                        isVerified: true,
                        auths:[
                            {
                                provider: "google",
                                providerId: profile.id
                            }
                        ]
                    })
                }
                return done(null, user)

            } catch(error){
                console.log("Google Strategy Error", error);
                return done(error)
            }
        }
    )
)


passport.serializeUser((user: any, done: (err: any, id?: unknown) => void)=>{
    done(null, user._id)
})

passport.deserializeUser(async(id: string, done: any)=>{
    try{
        const user = await User.findById(id);
        done(null, user)

    }catch(error){
        console.log(error);
        done(error)
    }
})