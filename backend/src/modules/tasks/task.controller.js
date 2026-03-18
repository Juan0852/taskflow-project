export const TaskController = {
    getStatus(_req, res) {
        res.status(501).json({
            ok: false,
            module: 'tasks',
            message: 'Task module scaffolded but not implemented yet.'
        });
    }
};
