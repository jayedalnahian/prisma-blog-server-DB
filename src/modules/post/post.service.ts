import { Post } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { CommentStatus, PostStatus } from '../../../generated/prisma/enums';
import { IOptionsResult } from "../../helpters/paginationSortingHelper";
import { UserRole } from "../../types/user";





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
    userData,

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

    const count = await prisma.post.count({
        where: {
            AND: andCondition
        }
    })
    return {
        data: result,
        metaData: {
            pagination: {
                totalData: count,
                pageNo: options.page,
                limit: options.limit,
                skip: options.skip,
                totalPages: Math.ceil(count / options.limit),
                sortBy: options.sortBy,
                sortOrder: options.sortOrder
            }
        },
        userData: userData
    }
}


const getSinglePost = async (postId: string) => {
    const result = await prisma.$transaction(async (tx) => {
        await tx.post.update({
            where: {
                id: postId
            },
            data: {
                views: {
                    increment: 1
                }
            }
        })
        const postData = await tx.post.findUnique({
            where: {
                id: postId
            },
            include: {
                comments: {
                    where: {
                        parentId: null,
                        status: CommentStatus.APPROVED
                    },
                    orderBy: {
                        createdAt: 'desc'
                    },
                    include: {
                        replys: {
                            where: {
                                status: CommentStatus.APPROVED
                            },
                            orderBy: {
                                createdAt: 'asc'
                            },
                            include: {
                                replys: {
                                    where: {
                                        status: CommentStatus.APPROVED
                                    },
                                    orderBy: {
                                        createdAt: 'asc'
                                    },
                                    include: {
                                        replys: {
                                            where: {
                                                status: CommentStatus.APPROVED
                                            },
                                            orderBy: {
                                                createdAt: 'asc'
                                            },
                                            include: {
                                                replys: {
                                                    where: {
                                                        status: CommentStatus.APPROVED
                                                    },
                                                    orderBy: {
                                                        createdAt: 'asc'
                                                    },
                                                }

                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        comments: true
                    }
                }
            }
        })

        return postData
    })




    return result;
}


const getUserPosts = async (authorId: string) => {
    await prisma.user.findUnique({
        where: {
            id: authorId,
            status: "ACTIVE"
        },
        select: {
            id: true,
        }
    })


    const posts = await prisma.post.findMany({
        where: {
            authorId
        },
        orderBy: {
            createdAt: "desc"
        },
        include: {
            _count: {
                select: {
                    comments: true
                }
            }
        }
    })

    const total = await prisma.post.aggregate({
        where: {
            authorId
        },
        _count: {
            id: true
        }
    })

    return {
        posts,
        total
    }
}


const updatePost = async (postId: string, data: Partial<Post>, authorId: string, isAdmin: boolean) => {
    console.log(postId, data, authorId);
    const postData = await prisma.post.findUniqueOrThrow({
        where: {
            id: postId
        },
        select: {
            id: true,
            authorId: true
        }
    })

    if ((postData.authorId !== authorId) && !isAdmin) {
        throw new Error("You are not the owner/creator of this post")
    }

    if (!isAdmin) {
        delete data.isFeatured
    }

    return await prisma.post.update({
        where: {
            id: postId
        },
        data
    })
}

const getStats = async () => {
    return await prisma.$transaction(async (tx) => {
        const [totalPost,
            publishedPost,
            draftPost,
            archivedPost,
            totalComments,
            approvedComment,
            rejectedComment,
            totalUser,
            adminCount,
            userCount,
            totalView,
        ] =
            await Promise.all([
                await tx.post.count(),
                await tx.post.count({ where: { status: PostStatus.PUBLISHED } }),
                await tx.post.count({ where: { status: PostStatus.DRAFT } }),
                await tx.post.count({ where: { status: PostStatus.ARCHIVED } }),
                await tx.comment.count(),
                await tx.comment.count({ where: { status: CommentStatus.APPROVED } }),
                await tx.comment.count({ where: { status: CommentStatus.REJECT } }),
                await tx.user.count(),
                await tx.user.count({ where: { role: UserRole.ADMIN } }),
                await tx.user.count({ where: { role: UserRole.USER } }),
                await tx.post.aggregate({_sum: {views: true}}),

            ])

        return {
            totalPost,
            publishedPost,
            draftPost,
            archivedPost,
            totalComments,
            approvedComment,
            rejectedComment,
            totalUser,
            adminCount,
            userCount,
            totalView: totalView._sum.views,
        }
    })
}



const deletePost = async (postId: string, authorId: string, isAdmin: boolean) => {
    const postData = await prisma.post.findUniqueOrThrow({
        where: {
            id: postId
        },
        select: {
            id: true,
            authorId: true
        }
    })

    if ((postData.authorId !== authorId) && !isAdmin) {
        throw new Error("You are not the owner/creator of this post")
    }

    return await prisma.post.delete({
        where: {
            id: postId
        }
    })

}




export const postService = { getStats, deletePost, updatePost, getUserPosts, createPost, getPost, getSinglePost }