import { Request, Response } from "express"
import { commentServce } from "./comment.service"

const getCommentById = async (req: Request, res: Response) => {
    try {
        const commentId = req.params.id as string
        const result = await commentServce.getCommentById(commentId)
        res.status(200).json({
            success: true,
            message: "data retrived successfully",
            result: result
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "server error",
            error: error.message
        })
    }
}
const createComment = async (req: Request, res: Response) => {
    try {

        if (!req.user) {
            return res.status(500).json({
                success: false,
                message: "Unauthorized",

            })
        }

        const user = req.user
        req.body.authorId = user?.id

        const result = await commentServce.createComment(req.body)
        res.status(201).json({
            success: true,
            message: "comment created successfully",
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



const getCommentByAuthor = async (req: Request, res: Response) => {
    try {
        const authorId = req.params.authorId as string
        const result = await commentServce.getCommentByAuthor(authorId)
        res.status(200).json({
            success: true,
            message: "data retrived successfully",
            result: result
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "server error",
            error: error.message
        })
    }
}


const updateComment = async (req: Request, res: Response) => {
    try {
        const { commentId } = req.params
        const data = req.body
        const authorId: string | undefined = req.user?.id
        const result = await commentServce.updateComment(commentId as string, data, authorId)
        res.status(200).json({
            success: true,
            message: "comment updated successfully",
            result: result
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "server error",
            error: error.message
        })
    }
}
const moderateComment = async (req: Request, res: Response) => {
    try {
        const { commentId } = req.params
        const data = req.body
        const result = await commentServce.moderateComment(commentId as string, data)
        res.status(200).json({
            success: true,
            message: "comment updated successfully",
            result: result
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "server error",
            error: error.message
        })
    }
}
const deleteComment = async (req: Request, res: Response) => {
    try {
        const { commentId } = req.params
        const user = req.user
        const result = await commentServce.deleteComment(commentId as string, user?.id as string)
        res.status(200).json({
            success: true,
            message: "comment deleted successfully",
            result: result
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "server error",
            error: error.message
        })
    }
}






export const commentController = {
    moderateComment, getCommentById, createComment, getCommentByAuthor, deleteComment, updateComment
}