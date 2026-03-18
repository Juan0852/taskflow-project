import argon2 from 'argon2';
import { passwordConfig } from './password.config.js';

export const PasswordService = {
    hash(password) {
        return argon2.hash(password, passwordConfig.hashOptions);
    },

    verify(passwordHash, plainPassword) {
        return argon2.verify(passwordHash, plainPassword);
    },

    isStrongEnough(password) {
        const { minLength, requireUppercase, requireLowercase, requireNumber } = passwordConfig.policy;

        if (password.length < minLength) return false;
        if (requireUppercase && !/[A-Z]/.test(password)) return false;
        if (requireLowercase && !/[a-z]/.test(password)) return false;
        if (requireNumber && !/[0-9]/.test(password)) return false;

        return true;
    }
};
