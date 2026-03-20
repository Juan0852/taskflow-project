import express from 'express';
import cors from 'cors';
import session from 'express-session';
import { env, isProduction, isSwaggerEnabled } from './config/env.js';
import { authRoutes } from './modules/auth/auth.routes.js';
import { taskRoutes } from './modules/tasks/task.routes.js';
import { userRoutes } from './modules/users/user.routes.js';
import { preferenceRoutes } from './modules/preferences/preference.routes.js';
import { errorHandler } from './middlewares/error-handler.middleware.js';
import { registerOpenApi } from './docs/openapi.js';

const app = express();

app.disable('x-powered-by');

app.use(cors({
    origin: env.CLIENT_URL,
    credentials: true
}));

app.use(express.json());

app.use(session({
    name: 'taskflow.sid',
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'lax' : 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));

app.get('/health', (_req, res) => {
    res.status(200).json({
        ok: true,
        service: 'taskflow-backend'
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/api/preferences', preferenceRoutes);

if (isSwaggerEnabled) {
    registerOpenApi(app);
}

app.use((req, res) => {
    res.status(404).json({
        ok: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`
    });
});

app.use(errorHandler);

export { app };
