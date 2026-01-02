import express, { Request, Response } from 'express'
import { postRouter } from './modules/post/post.router';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth';
import cors from "cors";
const app = express();

app.get("/", (req: Request, res: Response) => {
    res.send("Hello, world!")
})
app.use(cors({
    origin: process.env.APP_URL,
    credentials: true
}))
app.use(express.json())
app.all('/api/auth/*splat', toNodeHandler(auth));

app.use("/posts", postRouter)

export default app;