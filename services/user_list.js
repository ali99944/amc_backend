import prisma from "../lib/prisma.js"

export const getAllUserLists = async () => {
    const user_lists = await prisma.user_lists.findMany()
    return user_lists
}

export const getUserList = async (id) => {
    const user_list = await prisma.user_lists.findUnique({
        where: {
            id: +id
        }
    })
    return user_list
}

export const createUserList = async (payload) => {
    const user_list = await prisma.user_lists.create({
        data: {
            name: payload.name,
            description: payload.description,
            cover_image: payload.cover_image
        }
    })
    return user_list
}

export const updateUserList = async ({ id, payload }) => {
    const user_list = await prisma.user_lists.update({
        where: {
            id: +id
        },
        data: {
            name: payload.name,
            description: payload.description,
            cover_image: payload.cover_image
        }
    })
    return user_list
}

export const deleteUserList = async (id) => {
    const user_list = await prisma.user_lists.delete({
        where: {
            id: +id
        }
    })
    return user_list
}