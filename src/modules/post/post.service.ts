import { Post } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { PostStatus } from '../../../generated/prisma/enums';
import { IOptionsResult } from "../../helpters/paginationSortingHelper";

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
    authorId,
    options,
    userData
}
    : {
        search: string | undefined,
        tags: string[],
        isFeatured: boolean | undefined,
        status: PostStatus | undefined,
        authorId: string | undefined
        options: IOptionsResult,
        userData: null | {
            id: string;
            email: string;
            name: string;
            role: string;
            emailVerified: boolean;
        }
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


    const skip = (options.page - 1) * options.limit

    const result = await prisma.post.findMany({
        take: options.limit,
        skip,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            createdAt: 'desc'
        },
        where: {
            AND: andCondition
        }
    })

    const coutnt = await prisma.post.count({
        where: {
            AND: andCondition
        }
    })
    return {
        data: result,
        metaData: {
            pagination: {
                totalData: coutnt,
                pageNo: options.page,
                limit: options.limit,
                skip: options.skip,
                totalPages: Math.ceil(coutnt / options.limit),
                sortBy: options.sortBy,
                sortOrder: options.sortOrder
            }
        },
        userData: userData
    }
}




export const postService = { createPost, getPost }