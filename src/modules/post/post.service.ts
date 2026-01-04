import { Post } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { PostStatus } from '../../../generated/prisma/enums';

const createPost = async (
    data: Omit<Post, "id" | "createdAt" | "updatedAt" | "authorId">,
    authorId: string
) => {
    const result = await prisma.post.create({
        data: { ...data, authorId }
    })
    return result
}

const getPost = async ({ search,
    tags,
    isFeatured,
    status,
    authorId
}
    : {
        search: string | undefined,
        tags: string[],
        isFeatured: boolean | undefined,
        status: PostStatus | undefined,
        authorId: string | undefined
    }) => {


    const andCondition: PostWhereInput[] = [];
    if (search) {
        andCondition.push({
            OR: [
                {
                    title: {
                        contains: search,
                        mode: "insensitive"
                    }
                },
                {
                    content: {
                        contains: search,
                        mode: "insensitive"
                    }
                },
                {
                    tags: {
                        has: search
                    }
                }
            ]
        },)
    }

    if (tags.length > 0) {
        andCondition.push({
            tags: {
                hasEvery: tags
            }
        });
    }

    if (typeof isFeatured === 'boolean') {
        andCondition.push({ isFeatured })
    }

    if (status) {
        andCondition.push({
            status
        })
    }

    if (authorId) {
        andCondition.push({
            authorId
        })
    }

    const result = await prisma.post.findMany({
        where: {
            AND: andCondition
        }
    })
    return result
}




export const postService = { createPost, getPost }