import { Post } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createPost = async (data: Omit<Post, "id" | "createdAt" | "updatedAt" | "authorId">, authorId: string) => {
    const result = await prisma.post.create({
        data: { ...data, authorId }
    })
    return result
}


const getPost = async () => {
    const result = await prisma.post.findMany()
    return result
}




export const postService = { createPost, getPost }