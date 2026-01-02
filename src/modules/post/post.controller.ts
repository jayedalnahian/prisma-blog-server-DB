import { Request, Response } from "express"
import { postService } from "./post.service";

const createPost = async (req: Request, res: Response) => {
    try {
       
        
        const result = await postService.createPost(req.body)
        res.status(201).json({
            success: true,
            message: "post created successfully",
            data: result
        })
    

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "server error",
            error: error.message
        })
    }
}


export const postController = { createPost };