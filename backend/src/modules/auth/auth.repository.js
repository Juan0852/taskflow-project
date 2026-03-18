import { prisma } from '../../lib/prisma.js';

export const AuthRepository = {
    findUserByEmail(email) {
        return prisma.user.findUnique({
            where: { email }
        });
    },

    findUserByUsername(username) {
        return prisma.user.findUnique({
            where: { username }
        });
    },

    findUserByEmailOrUsername(identifier) {
        return prisma.user.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    { username: identifier }
                ]
            }
        });
    },

    createUser(data) {
        return prisma.user.create({ data });
    },

    findUserById(id) {
        return prisma.user.findUnique({
            where: { id }
        });
    },

    createUserPreferences(userId) {
        return prisma.userPreference.create({
            data: { userId }
        });
    },

    updateLastLoginAt(userId, lastLoginAt) {
        return prisma.user.update({
            where: { id: userId },
            data: { lastLoginAt }
        });
    }
};
