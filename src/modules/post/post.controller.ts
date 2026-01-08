import { Request, Response } from "express"
import { postService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";
import paginationSortingHelper from "../../helpters/paginationSortingHelper";
import { UserRole } from "../../types/user";


const getPost = async (req: Request, res: Response) => {
    try {
        const query = req.query

        const tags = query.tags ? (query.tags as string).split(",") : [];
        const searchString = typeof query.search === "string" ? query.search : undefined;
        const isFeatured = query.isFeatured
            ? query.isFeatured === "true"
                ? true
                : query.isFeatured === "false"
                    ? false
                    : undefined
            : undefined;

        const status = query.status as PostStatus
        const authorId = query.authorId as string






        const options = paginationSortingHelper(query)
        const userData = req.user || null


        const result = await postService.getPost({ search: searchString, tags, isFeatured, status, authorId, options, userData })
        res.status(200).json({
            success: true,
            message: "data retrived successfully",
            result: result
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
const getUserPosts = async (req: Request, res: Response) => {

    try {

        const user = req.user
        if (!user?.id) {
            throw new Error("author id is not available")
        }
        const result = await postService.getUserPosts(user?.id)
        res.status(200).json({
            success: true,
            message: "posts retrived successfully",
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
const deletePost = async (req: Request, res: Response) => {

    try {

        const user = req.user
        if (!user?.id) {
            throw new Error("author id is not available")
        }

        const { postId } = req.params
        const isAdmin = user.role === UserRole.ADMIN
        const result = await postService.deletePost(postId as string, user.id, isAdmin)
        res.status(200).json({
            success: true,
            message: "posts deleted successfully",
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
const getStats = async (req: Request, res: Response) => {

    try {

       
        const result = await postService.getStats()
        res.status(200).json({
            success: true,
            message: "stats retrived successfully",
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
const updatePost = async (req: Request, res: Response) => {

    try {

        const user = req.user
        if (!user?.id) {
            throw new Error("author id is not available")
        }

        const { postId } = req.params
        const isAdmin = user.role === UserRole.ADMIN
        const result = await postService.updatePost(postId as string, req.body, user.id, isAdmin)
        res.status(200).json({
            success: true,
            message: "posts updated successfully",
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


const getSinglePost = async (req: Request, res: Response) => {
    try {
        const postId = req.params.id as string
        const result = await postService.getSinglePost(postId)
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


export const postController = { getStats, deletePost, updatePost, getUserPosts, createPost, getPost, getSinglePost };