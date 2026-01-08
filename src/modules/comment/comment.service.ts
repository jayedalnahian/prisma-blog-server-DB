

import { CommentStatus } from "../../../generated/prisma/enums"
import { prisma } from "../../lib/prisma"
import { Request } from 'express';

const createComment = async (payload: {
    content: string,
    authorId: string,
    postId: string,
    parentId?: string
}) => {

    await prisma.post.findUniqueOrThrow({
        where: {
            id: payload.postId
        }
    })

    if (payload.parentId) {
        await prisma.comment.findUniqueOrThrow({
            where: {
                id: payload.parentId
            }
        })
    }

    return await prisma.comment.create({
        data: payload
    })
}

const getCommentById = async (commentId: string) => {

    const result = await prisma.comment.findUnique({
        where: {
            id: commentId
        },
        include: {
            post: {
                select: {
                    id: true,
                    title: true,
                    views: true
                }
            }
        }
    })

    return result

}


const getCommentByAuthor = async (authorId: string) => {
    const result = await prisma.comment.findMany({
        where: {
            authorId
        },
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            post: {
                select: {
                    id: true,
                    title: true
                }
            }
        }
    })
    return result;
}


const deleteComment = async (commentId: string, authorId: string) => {

    const comment = await prisma.comment.findFirst({
        where: {
            id: commentId,
            authorId
        },
        select: {
            id: true
        }
    })

    if (!comment) {
        throw new Error("Your provided input is invalid or comment does not exists.")
    }

    return await prisma.comment.delete({
        where: {
            id: comment.id
        }
    })

}

const updateComment = async (commentId: string, data: { content: string, status: CommentStatus }, authorId: string | undefined) => {
    if (!authorId) {
        throw new Error("Author ID is required.")
    }

    console.log(commentId, data, authorId);
    const comment = await prisma.comment.findFirst({
        where: {
            id: commentId,
            authorId
        },
        select: {
            id: true
        }
    })

    if (!comment) {
        throw new Error("Your provided input is invalid or comment does not exists.")
    }

    return prisma.comment.update({
        where: {
            id: commentId,
            authorId
        },
        data
    })

}



const moderateComment = async (id: string, data: { status: CommentStatus, }) => {

    const commentData = await prisma.comment.findUniqueOrThrow({
        where: {
            id
        },
        select: {
            id: true,
            status: true
        }
    })

    if (commentData.status === data.status) {
        throw new Error(`Your provided status (${data.status}) is already up to data`)
    }

    return await prisma.comment.update({
        where: {
            id
        },
        data
    })



}




export const commentServce = {  moderateComment, createComment, getCommentById, getCommentByAuthor, deleteComment, updateComment }
