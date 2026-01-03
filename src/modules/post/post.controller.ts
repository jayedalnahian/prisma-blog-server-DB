import { Request, Response } from "express"
import { postService } from "./post.service";

const getPost = async (req: Request, res: Response) => {
    try {

        const result = await postService.getPost()
        res.status(200).json({
            success: true,
            message: "data retrived successfully",
            data: result
        })
    } catch (error: any) {
        console.log(error);
        
        res.status(500).json({
            success: false,
            message: "server error",
            error: error.message
        })
    }
}



const createPost = async (req: Request, res: Response) => {
    try {

        if (!req.user) {
            return res.status(500).json({
                success: false,
                message: "Unauthorized",
               
            })
        }


        const result = await postService.createPost(req.body, req.user?.id as string)
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


export const postController = { createPost, getPost };