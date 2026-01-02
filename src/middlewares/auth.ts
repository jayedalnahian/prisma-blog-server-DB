import { NextFunction, Request, Response } from "express";

const auth = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        console.log("this is auth middleware.");
        next()
    }
};



export const authMiddleware = { auth }