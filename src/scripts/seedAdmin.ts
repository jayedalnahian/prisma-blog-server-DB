

import { prisma } from "../lib/prisma";
import { UserRole } from "../types/user";

const seedAdmin = async () => {
    try {
        // check user exist on db or not

        const adminData = {
            name: "jayed al nahian",
            email: "jnahian@gmail.com",
            role: UserRole.USER,
            password: "admin123"
        }
        const existingUser = await prisma.user.findUnique({
            where: {
                email: adminData.email
            }
        })


        if (existingUser) {
            throw new Error("user already exists in the database")
        }

        const signUpAdmin = await fetch("http://localhost:3000/api/auth/sign-up/email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(adminData)
        })

        console.log(signUpAdmin);


    } catch (error) {
        console.log(error);
        throw error
    } finally {
        prisma.$disconnect
    }
}


seedAdmin()