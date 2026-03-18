import { app } from './app.js';
import { env } from './config/env.js';
import { prisma } from './lib/prisma.js';

async function bootstrap() {
    try {
        await prisma.$connect();

        app.listen(env.PORT, () => {
            console.log(`TaskFlow backend running on http://localhost:${env.PORT}`);
        });
    } catch (error) {
        console.error('Failed to start backend server.', error);
        process.exit(1);
    }
}

bootstrap();
