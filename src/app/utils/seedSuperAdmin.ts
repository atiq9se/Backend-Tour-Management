import envVars = require("../config/env")
import env = require("../config/env")
import type IUser = require("../modules/user/user.interface");
import type IAuthProvider = require("../modules/user/user.interface");
import userInterface = require("../modules/user/user.interface")
import userModel = require("../modules/user/user.model")
import bcryptjs from "bcryptjs";

export const seedSuperAdmin = async()=>{
    try{
        const isSupperAdminExit = await userModel.User.findOne({email: env.envVars.SUPER_ADMIN_EMAIL})
        if(isSupperAdminExit){
            console.log("super admin already exists")
            return;
        }

        console.log('try to crate super admin')

        const hashedPassword = await bcryptjs.hash(env.envVars.SUPER_ADMIN_PASSWORD, Number(env.envVars.BCRYPT_SALT_ROUND))

        const authProvider: userInterface.IAuthProvider = {
            provider: "credentials",
            providerId: env.envVars.SUPER_ADMIN_EMAIL
        }

        const payload: userInterface.IUser = {
            name: "Super admin",
            role: userInterface.Role.SUPER_ADMIN,
            email: env.envVars.SUPER_ADMIN_EMAIL,
            password: hashedPassword,
            isVerified: true,
            auths: [authProvider]
        }

        const superadmin = await userModel.User.create(payload)
        console.log(superadmin);

    }catch(error){

    }
}