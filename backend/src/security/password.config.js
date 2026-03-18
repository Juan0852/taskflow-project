import argon2 from 'argon2';

export const passwordConfig = {
    hashOptions: {
        type: argon2.argon2id
    },
    policy: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumber: true
    }
};
