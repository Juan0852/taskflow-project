import { prisma } from '../../lib/prisma.js';

export const PreferenceRepository = {
    findByUserId(userId) {
        return prisma.userPreference.findUnique({
            where: { userId }
        });
    },

    createForUser(userId) {
        return prisma.userPreference.create({
            data: { userId }
        });
    },

    updateByUserId(userId, data) {
        return prisma.userPreference.update({
            where: { userId },
            data
        });
    }
};
