import { envVars } from "../config/env.js";
import { type IAuthProvider, type IUser, Role } from "../modules/user/user.interface.js";
import { User } from "../modules/user/user.model.js";
import bcryptjs from "bcryptjs";

export const seedSuperAdmin = async () => {
    try {
        const isSupperAdminExit = await User.findOne({ email: envVars.SUPER_ADMIN_EMAIL })
        if (isSupperAdminExit) {
            console.log("super admin already exists")
            return;
        }

        console.log('try to crate super admin')

        const hashedPassword = await bcryptjs.hash(envVars.SUPER_ADMIN_PASSWORD, Number(envVars.BCRYPT_SALT_ROUND))

        const authProvider: IAuthProvider = {
            provider: "credentials",
            providerId: envVars.SUPER_ADMIN_EMAIL
        }

        const payload: IUser = {
            name: "Super admin",
            email: envVars.SUPER_ADMIN_EMAIL,
            age: 20, // Added default age as it is required in IUser but missing in original code
            role: Role.SUPER_ADMIN,
            password: hashedPassword,
            isVerified: true,
            auths: [authProvider]
        }

        const superadmin = await User.create(payload)
        console.log(superadmin);

    } catch (error) {

    }
}