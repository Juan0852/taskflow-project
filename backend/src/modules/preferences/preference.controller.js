import { PreferenceRequestDTO } from './preference.request.dto.js';
import { PreferenceService } from './preference.service.js';

export const PreferenceController = {
    getStatus(_req, res) {
        res.status(200).json({
            ok: true,
            module: 'preferences',
            message: 'El módulo de preferencias está en línea.'
        });
    },

    async getMine(req, res, next) {
        try {
            const response = await PreferenceService.getPreferences(req.session.userId);
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    },

    async updateMine(req, res, next) {
        try {
            const payload = PreferenceRequestDTO.parseUpdate(req.body);
            const response = await PreferenceService.updatePreferences(req.session.userId, payload);
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }
};
