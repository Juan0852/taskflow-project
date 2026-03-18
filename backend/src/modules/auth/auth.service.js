import { AuthMapper } from './auth.mapper.js';
import { AuthRepository } from './auth.repository.js';
import { PasswordService } from '../../security/password.service.js';
import { authConfig } from './auth.config.js';
import { EmailAlreadyInUseError } from './errors/email-already-in-use.error.js';
import { UsernameAlreadyInUseError } from './errors/username-already-in-use.error.js';
import { InvalidCredentialsError } from './errors/invalid-credentials.error.js';
import { InactiveAccountError } from './errors/inactive-account.error.js';
import { UnauthorizedError } from '../../common-errors/unauthorized.error.js';
import { UsernameReservedError } from './errors/username-reserved.error.js';
import { PasswordTooWeakError } from './errors/password-too-weak.error.js';

function normalizeEmail(email) {
    return email.trim().toLowerCase();
}

function normalizeUsername(username) {
    return username.trim().toLowerCase();
}

function normalizeDisplayName(displayName) {
    const normalized = displayName?.trim();
    return normalized ? normalized : null;
}

/**
 * AuthService define primero los casos de uso reales del modulo de auth.
 * A partir de aqui saldran luego las necesidades concretas del repository.
 */
export const AuthService = {
    /**
     * Caso de uso: registrar un nuevo usuario.
     *
     * Flujo esperado:
     * 1. Normalizar email, username y displayName.
     * 2. Validar que email y username no esten ya ocupados.
     * 3. Hashear la contrasena con argon2.
     * 4. Crear usuario.
     * 5. Crear preferencias base si decidimos hacerlo en el mismo registro.
     * 6. Devolver un response DTO seguro, sin passwordHash.
     *
     * Nota importante:
     * varios campos no se setean manualmente aqui porque el propio schema
     * de Prisma/PostgreSQL ya los resuelve con defaults o automatismos.
     * Ejemplos:
     * - createdAt -> @default(now())
     * - updatedAt -> @updatedAt
     * - isActive -> @default(true)
     * - campos opcionales como profileImageUrl o lastLoginAt quedan en null
     *   si no se envian explicitamente.
     *
     * Importante sobre validaciones:
     * aqui solo viven validaciones de negocio. Es decir, reglas que dependen
     * del estado del sistema o de politicas reales del dominio.
     * Ejemplos:
     * - email already in use
     * - username already in use
     * - username reserved
     * - password too weak for policy
     *
     * En cambio, las validaciones estructurales del payload se resuelven antes
     * en los request DTOs con zod:
     * - que el email exista
     * - que tenga formato de email
     * - que password sea string
     * - que un campo obligatorio no venga undefined
     *
     * Necesidades de repository que se desprenden de este caso:
     * - findUserByEmail(email)
     * - findUserByUsername(username)
     * - createUser(data)
     * - createUserPreferences(data) u operacion equivalente
     */
    async registerUser(payload) {
        const email = normalizeEmail(payload.email);
        const username = normalizeUsername(payload.username);
        const displayName = normalizeDisplayName(payload.displayName);

        if (authConfig.reservedUsernames.includes(username)) {
            throw new UsernameReservedError();
        }

        const [existingEmailUser, existingUsernameUser] = await Promise.all([
            AuthRepository.findUserByEmail(email),
            AuthRepository.findUserByUsername(username)
        ]);

        if (existingEmailUser) {
            throw new EmailAlreadyInUseError();
        }

        if (existingUsernameUser) {
            throw new UsernameAlreadyInUseError();
        }

        if (!PasswordService.isStrongEnough(payload.password)) {
            throw new PasswordTooWeakError();
        }

        const passwordHash = await PasswordService.hash(payload.password);

        const userData = AuthMapper.toRegisterEntity({
            email,
            username,
            displayName
        }, passwordHash);

        const user = await AuthRepository.createUser(userData);

        await AuthRepository.createUserPreferences(user.id);

        return {
            user,
            response: AuthMapper.toRegisterResponseDTO(user),
            sessionUser: {
                userId: user.id
            }
        };
    },

    /**
     * Caso de uso: iniciar sesion.
     *
     * Flujo esperado:
     * 1. Recibir identificador (email o username) + password.
     * 2. Buscar usuario por email o username.
     * 3. Verificar que exista y que este activo.
     * 4. Verificar password con argon2.
     * 5. Actualizar lastLoginAt.
     * 6. Preparar la sesion para que controller la persista.
     * 7. Devolver un response DTO seguro.
     *
     * Necesidades de repository que se desprenden de este caso:
     * - findUserByEmail(email)
     * - findUserByUsername(username)
     *   o un findUserByEmailOrUsername(identifier)
     * - updateLastLoginAt(userId, date)
     */
    async loginUser(payload) {
        const identifier = payload.identifier.trim().toLowerCase();

        const user = await AuthRepository.findUserByEmailOrUsername(identifier);

        if (!user) {
            throw new InvalidCredentialsError();
        }

        if (!user.isActive) {
            throw new InactiveAccountError();
        }

        const isPasswordValid = await PasswordService.verify(user.passwordHash, payload.password);

        if (!isPasswordValid) {
            throw new InvalidCredentialsError();
        }

        const updatedUser = await AuthRepository.updateLastLoginAt(user.id, new Date());

        return {
            user: updatedUser,
            response: AuthMapper.toLoginResponseDTO(updatedUser),
            sessionUser: {
                userId: updatedUser.id
            }
        };
    },

    async getCurrentUser(sessionUserId) {
        if (!sessionUserId) {
            throw new UnauthorizedError('No has iniciado sesión.');
        }

        const user = await AuthRepository.findUserById(sessionUserId);

        if (!user) {
            throw new UnauthorizedError('La sesión del usuario ya no es válida.');
        }

        if (!user.isActive) {
            throw new InactiveAccountError();
        }

        return AuthMapper.toCurrentUserResponseDTO(user);
    }
};
