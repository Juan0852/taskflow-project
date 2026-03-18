export const PreferenceController = {
    getStatus(_req, res) {
        res.status(501).json({
            ok: false,
            module: 'preferences',
            message: 'Preference module scaffolded but not implemented yet.'
        });
    }
};
