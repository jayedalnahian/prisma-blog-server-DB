import express, { Request, Response } from 'express'
import { postRouter } from './modules/post/post.router';
const app = express();

app.get("/", (req: Request, res: Response) => {
    res.send("Hello, world!")
})
app.use(express.json())

app.use("/posts", postRouter)

export default app;