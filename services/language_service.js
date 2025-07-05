// language_service.js

import prisma from "../lib/prisma.js";


export const getAllLanguages = async () => {
    return await prisma.languages.findMany({
        orderBy: {
            name: 'asc'
        }
    });
};


export const createLanguage = async (data) => {
    return await prisma.languages.create({
        data
    });
};

export const updateLanguage = async (id, data) => {
    return await prisma.languages.update({
        where: {
            id
        },
        data
    });
};

export const deleteLanguage = async (id) => {
    return await prisma.languages.delete({
        where: {
            id
        }
    });
};
