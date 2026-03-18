import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().positive().default(3000),
    DATABASE_URL: z.string().min(1),
    SESSION_SECRET: z.string().min(8),
    CLIENT_URL: z.string().url()
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
    console.error('Invalid backend environment variables:', parsedEnv.error.flatten().fieldErrors);
    throw new Error('Backend environment validation failed.');
}

export const env = parsedEnv.data;
export const isProduction = env.NODE_ENV === 'production';
