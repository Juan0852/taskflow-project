export const UserController = {
    getStatus(_req, res) {
        res.status(501).json({
            ok: false,
            module: 'users',
            message: 'User module scaffolded but not implemented yet.'
        });
    }
};
