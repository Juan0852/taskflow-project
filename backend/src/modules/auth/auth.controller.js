import { LoginRequestDTO } from './login.request.dto.js';
import { RegisterRequestDTO } from './register.request.dto.js';
import { AuthService } from './auth.service.js';

export const AuthController = {
    getStatus(_req, res) {
        res.status(200).json({
            ok: true,
            module: 'auth',
            message: 'El módulo de autenticación está en línea.'
        });
    },

    async register(req, res, next) {
        try {
            const payload = RegisterRequestDTO.parse(req.body);
            const result = await AuthService.registerUser(payload);

            req.session.userId = result.sessionUser.userId;

            res.status(201).json(result.response);
        } catch (error) {
            next(error);
        }
    },

    async login(req, res, next) {
        try {
            const payload = LoginRequestDTO.parse(req.body);
            const result = await AuthService.loginUser(payload);

            req.session.userId = result.sessionUser.userId;

            res.status(200).json(result.response);
        } catch (error) {
            next(error);
        }
    },

    async me(req, res, next) {
        try {
            const response = await AuthService.getCurrentUser(req.session.userId);
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    },

    logout(req, res, next) {
        req.session.destroy((error) => {
            if (error) {
                next(error);
                return;
            }

            res.clearCookie('taskflow.sid');
            res.status(200).json({
                ok: true,
                message: 'Sesión cerrada correctamente.'
            });
        });
    }
};
