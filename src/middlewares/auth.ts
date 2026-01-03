import { NextFunction, Request, Response } from "express";
import { auth as betterAuth } from "../lib/auth"
import { fromNodeHeaders } from "better-auth/node";
import { UserRole } from "../types/user";


const auth = (...roles: UserRole[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log("this is auth middleware.");
            const session = await betterAuth.api.getSession({
                headers: fromNodeHeaders(req.headers),
            });

            if (!session) {
                res.status(401).json({
                    success: false,
                    message: "You are not authorized"
                })
            }

            if (!session?.user.emailVerified) {
                res.status(403).json({
                    success: false,
                    message: "You are not authorized. Email is not verified."
                })
            }
            const user = session?.user

            req.user = {
                id: user?.id as string,
                email: user?.email as string,
                name: user?.name as string,
                role: user?.role as string,
                emailVerified: user?.emailVerified as boolean
            }

            if (!roles.length || !roles.includes(req.user.role as UserRole)) {
                res.status(403).json({
                    success: false,
                    message: "You do not have permition to access this api route."
                })
            }

            console.log("session ===>", session, { user: req.user });

            console.log("valid role ===> ", roles.includes(req.user.role as UserRole));
            next()
        } catch (error) {
            console.log(error);
            throw error
        }
    }
};



export const authMiddleware = { auth }