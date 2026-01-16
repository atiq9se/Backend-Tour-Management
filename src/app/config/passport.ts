import passport from "passport";
import { Strategy as GoogleStrategy, type VerifyCallback,type Profile } from "passport-google-oauth20";
import { User } from "../modules/user/user.model";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import { envVars } from "./env.js";

passport.use(
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password"
        },
        async (email, password, done) => {
            try {
                const isUserExist = await User.findOne({ email });

                // if (!isUserExist) {
                //     return done(null, false, { message: "User does not Exist." });
                // }
                if (!isUserExist) {
                    return done("User does not Exist.")
                }

                const isGoogleAuthenticated = isUserExist.auths.some(providerObjects => providerObjects.provider == "google")

                if(isGoogleAuthenticated && !isUserExist.password){
                    return done("You have authenticated through Google. so if you want to login with credentials, then at first login with google and set a password for your gmail and then you can login with email and password")
                }

                const isMatch = await bcrypt.compare(password, isUserExist.password as string);

                if (!isMatch) {
                    return done(null, false, { message: "Incorrect password." });
                }

                return done(null, isUserExist);
            } catch (err) {
                return done(err);
            }
        }
    )
);

passport.use(
    new GoogleStrategy(
        {
            clientID: envVars.GOOGLE_CLIENT_ID,
            clientSecret: envVars.GOOGLE_CLIENT_SECRET,
            callbackURL: envVars.GOOGLE_CALLBACK_URL
        }, async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
            try {
                const email = profile.emails?.[0].value;

                if (!email) {
                    return done(null, false, { message: "no email found" })
                }

                let user = await User.findOne({ email })

                if (!user) {
                    user = await User.create({
                        email,
                        name: profile.displayName,
                        picture: profile.photos?.[0].value,
                        role: userInterface.Role.USER,
                        isVerified: true,
                        auths: [
                            {
                                provider: "google",
                                providerId: profile.id
                            }
                        ]
                    })
                }
                return done(null, user)

            } catch (error) {
                console.log("Google Strategy Error", error);
                return done(error)
            }
        }
    )
)


passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
    done(null, user._id)
})

passport.deserializeUser(async (id: string, done: any) => {
    try {
        const user = await User.findById(id);
        done(null, user)

    } catch (error) {
        console.log(error);
        done(error)
    }
})