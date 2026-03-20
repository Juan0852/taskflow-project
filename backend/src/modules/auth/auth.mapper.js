import { LoginResponseDTO } from './login.response.dto.js';
import { RegisterResponseDTO } from './register.response.dto.js';

function toSharedUserPayload(user) {
    if (!user) return null;

    return {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName ?? null,
        profileImageUrl: user.profileImageUrl ?? null,
        isActive: user.isActive,
        createdAt: user.createdAt.toISOString()
    };
}

export const AuthMapper = {
    toRegisterEntity(dto, passwordHash) {
        if (!dto) return null;

        return {
            email: dto.email,
            username: dto.username,
            passwordHash,
            displayName: dto.displayName ?? null
        };
    },

    toCurrentUserResponseDTO(user) {
        return LoginResponseDTO.parse({
            ...toSharedUserPayload(user),
            lastLoginAt: user.lastLoginAt ? user.lastLoginAt.toISOString() : null
        });
    },

    toRegisterResponseDTO(user) {
        return RegisterResponseDTO.parse(toSharedUserPayload(user));
    },

    toLoginResponseDTO(user) {
        return LoginResponseDTO.parse({
            ...toSharedUserPayload(user),
            lastLoginAt: user.lastLoginAt ? user.lastLoginAt.toISOString() : null
        });
    }
};
