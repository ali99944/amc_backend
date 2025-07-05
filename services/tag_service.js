import prisma from "../lib/prisma.js";

export const getAllTags = async () => {
    return await prisma.tags.findMany();
}

export const createTag = async ({ name, description = null }) => {
    return await prisma.tags.create({
        data: {
            name,
            description
        }
    });
}

export const updateTag = async (id, { name, description }) => {
    return await prisma.tags.update({
        where: {
            id
        },
        data: {
            name,
            description
        }
    });
}

export const deleteTag = async (id) => {
    return await prisma.tags.delete({
        where: {
            id
        }
    });
}
