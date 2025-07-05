// contact_messages_service.js
import prisma from '../lib/prisma.js';

export const getContactMessages = async () => {
  return await prisma.contact_messages.findMany({
    orderBy: {
      created_at: 'desc'
    }
  });
};

export const createContactMessage = async (data) => {
  return await prisma.contact_messages.create({
    data
  });
};

export const deleteContactMessage = async (id) => {
  await prisma.contact_messages.delete({
    where: {
      id
    }
  });
};
