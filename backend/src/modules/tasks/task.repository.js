import { prisma } from '../../lib/prisma.js';

export const TaskRepository = {
    findByIdAndUserId(id, userId) {
        return prisma.task.findFirst({
            where: {
                id,
                userId
            }
        });
    },

    findManyByUserId(userId, { where = {}, skip = 0, take = 20, orderBy = { createdAt: 'desc' } } = {}) {
        return prisma.task.findMany({
            where: {
                userId,
                ...where
            },
            skip,
            take,
            orderBy
        });
    },

    countByUserId(userId, where = {}) {
        return prisma.task.count({
            where: {
                userId,
                ...where
            }
        });
    },

    create(data) {
        return prisma.task.create({ data });
    },

    update(id, userId, data) {
        return prisma.task.updateMany({
            where: {
                id,
                userId
            },
            data
        });
    },

    updateAndReturn(id, userId, data) {
        return prisma.task.update({
            where: { id },
            data,
            include: {
                user: false
            }
        });
    },

    delete(id, userId) {
        return prisma.task.deleteMany({
            where: {
                id,
                userId
            }
        });
    },

    deleteTrashByUserId(userId) {
        return prisma.task.deleteMany({
            where: {
                userId,
                trashedAt: {
                    not: null
                }
            }
        });
    },

    getDistinctTypesByUserId(userId, { where = {}, take = 10 } = {}) {
        return prisma.task.findMany({
            where: {
                userId,
                ...where
            },
            distinct: ['type'],
            select: {
                type: true
            },
            take,
            orderBy: {
                type: 'asc'
            }
        });
    },

    markAllAsCompleted(userId, completedAt) {
        return prisma.task.updateMany({
            where: {
                userId,
                trashedAt: null,
                NOT: {
                    status: 'COMPLETED'
                }
            },
            data: {
                status: 'COMPLETED',
                completedAt
            }
        });
    },

    trashCompleted(userId, trashedAt) {
        return prisma.task.updateMany({
            where: {
                userId,
                trashedAt: null,
                status: 'COMPLETED'
            },
            data: {
                trashedAt
            }
        });
    }
};
