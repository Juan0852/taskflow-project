import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { env } from '../config/env.js';

function buildOpenApiDefinition() {
    return {
        openapi: '3.0.3',
        info: {
            title: 'TaskFlow Backend API',
            version: '1.0.0',
            description: 'API REST del backend de TaskFlow para autenticación, tareas y preferencias del usuario.'
        },
        servers: [
            {
                url: `http://localhost:${env.PORT}`,
                description: 'Servidor local'
            }
        ],
        tags: [
            { name: 'Auth', description: 'Autenticación, sesión y usuario actual.' },
            { name: 'Tasks', description: 'CRUD de tareas, filtros, papelera y acciones masivas.' },
            { name: 'Preferences', description: 'Preferencias persistidas de la interfaz del usuario.' }
        ],
        components: {
            securitySchemes: {
                sessionCookie: {
                    type: 'apiKey',
                    in: 'cookie',
                    name: 'taskflow.sid',
                    description: 'Cookie de sesión creada por express-session tras register o login.'
                }
            },
            schemas: {
                RegisterRequest: {
                    type: 'object',
                    required: ['email', 'username', 'password'],
                    properties: {
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'carlitos@example.com'
                        },
                        username: {
                            type: 'string',
                            minLength: 3,
                            maxLength: 50,
                            example: 'Carlitos23.dev',
                            description: 'No puede contener @ ni espacios. Solo letras, números, puntos, guiones y guiones bajos.'
                        },
                        password: {
                            type: 'string',
                            minLength: 8,
                            maxLength: 255,
                            example: 'SecurePass123'
                        }
                    }
                },
                LoginRequest: {
                    type: 'object',
                    required: ['identifier', 'password'],
                    properties: {
                        identifier: {
                            type: 'string',
                            example: 'carlitos@example.com',
                            description: 'Acepta correo o username.'
                        },
                        password: {
                            type: 'string',
                            example: 'SecurePass123'
                        }
                    }
                },
                AuthUserResponse: {
                    type: 'object',
                    required: ['id', 'email', 'username', 'displayName', 'profileImageUrl', 'isActive', 'createdAt'],
                    properties: {
                        id: { type: 'string', example: 'cmabcd1234567890' },
                        email: { type: 'string', format: 'email', example: 'carlitos@example.com' },
                        username: { type: 'string', example: 'Carlitos23.dev' },
                        displayName: { type: 'string', nullable: true, example: null },
                        profileImageUrl: { type: 'string', nullable: true, example: null },
                        isActive: { type: 'boolean', example: true },
                        lastLoginAt: { type: 'string', format: 'date-time', nullable: true, example: '2026-03-20T11:30:00.000Z' },
                        createdAt: { type: 'string', format: 'date-time', example: '2026-03-19T10:30:00.000Z' }
                    }
                },
                RegisterResponse: {
                    type: 'object',
                    required: ['id', 'email', 'username', 'displayName', 'profileImageUrl', 'isActive', 'createdAt'],
                    properties: {
                        id: { type: 'string', example: 'cmabcd1234567890' },
                        email: { type: 'string', format: 'email', example: 'carlitos@example.com' },
                        username: { type: 'string', example: 'Carlitos23.dev' },
                        displayName: { type: 'string', nullable: true, example: null },
                        profileImageUrl: { type: 'string', nullable: true, example: null },
                        isActive: { type: 'boolean', example: true },
                        createdAt: { type: 'string', format: 'date-time', example: '2026-03-19T10:30:00.000Z' }
                    }
                },
                TaskCreateRequest: {
                    type: 'object',
                    required: ['text'],
                    properties: {
                        text: {
                            type: 'string',
                            maxLength: 500,
                            example: 'Preparar documentación Swagger'
                        },
                        priority: {
                            type: 'string',
                            enum: ['baja', 'media', 'alta'],
                            default: 'media',
                            example: 'alta'
                        },
                        type: {
                            type: 'string',
                            maxLength: 100,
                            default: 'general',
                            example: 'backend'
                        },
                        status: {
                            type: 'string',
                            enum: ['pendiente', 'haciendo', 'completado'],
                            default: 'pendiente',
                            example: 'pendiente'
                        }
                    }
                },
                TaskUpdateRequest: {
                    type: 'object',
                    minProperties: 1,
                    properties: {
                        text: {
                            type: 'string',
                            maxLength: 500,
                            example: 'Preparar documentación Swagger revisada'
                        },
                        priority: {
                            type: 'string',
                            enum: ['baja', 'media', 'alta'],
                            example: 'media'
                        },
                        type: {
                            type: 'string',
                            maxLength: 100,
                            example: 'documentacion'
                        },
                        status: {
                            type: 'string',
                            enum: ['pendiente', 'haciendo', 'completado'],
                            example: 'haciendo'
                        }
                    }
                },
                TaskResponse: {
                    type: 'object',
                    required: ['id', 'text', 'type', 'status', 'priority', 'completedAt', 'trashedAt', 'createdAt', 'updatedAt', 'createdDate'],
                    properties: {
                        id: { type: 'string', example: 'cmxyz1234567890' },
                        text: { type: 'string', example: 'Preparar documentación Swagger' },
                        type: { type: 'string', example: 'backend' },
                        status: { type: 'string', enum: ['pendiente', 'haciendo', 'completado'], example: 'pendiente' },
                        priority: { type: 'string', enum: ['baja', 'media', 'alta'], example: 'alta' },
                        completedAt: { type: 'string', format: 'date-time', nullable: true, example: null },
                        trashedAt: { type: 'string', format: 'date-time', nullable: true, example: null },
                        createdAt: { type: 'string', format: 'date-time', example: '2026-03-20T12:15:00.000Z' },
                        updatedAt: { type: 'string', format: 'date-time', example: '2026-03-20T12:15:00.000Z' },
                        createdDate: { type: 'string', example: '2026-03-20' }
                    }
                },
                TaskListResponse: {
                    type: 'object',
                    required: ['items', 'meta'],
                    properties: {
                        items: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/TaskResponse' }
                        },
                        meta: {
                            type: 'object',
                            required: ['page', 'limit', 'totalItems', 'totalPages', 'hasNextPage', 'hasPreviousPage'],
                            properties: {
                                page: { type: 'integer', example: 1 },
                                limit: { type: 'integer', example: 20 },
                                totalItems: { type: 'integer', example: 3 },
                                totalPages: { type: 'integer', example: 1 },
                                hasNextPage: { type: 'boolean', example: false },
                                hasPreviousPage: { type: 'boolean', example: false }
                            }
                        }
                    }
                },
                TaskTypesResponse: {
                    type: 'object',
                    required: ['items'],
                    properties: {
                        items: {
                            type: 'array',
                            items: { type: 'string' },
                            example: ['backend', 'estudio', 'general']
                        }
                    }
                },
                BulkActionResponse: {
                    type: 'object',
                    required: ['ok', 'count', 'message'],
                    properties: {
                        ok: { type: 'boolean', example: true },
                        count: { type: 'integer', example: 4 },
                        message: { type: 'string', example: 'Se enviaron 4 tarea(s) a la papelera.' }
                    }
                },
                ActionResponse: {
                    type: 'object',
                    required: ['ok', 'message'],
                    properties: {
                        ok: { type: 'boolean', example: true },
                        message: { type: 'string', example: 'La tarea se eliminó definitivamente.' }
                    }
                },
                PreferenceResponse: {
                    type: 'object',
                    required: ['theme', 'toolbarConfig', 'filterPreferences', 'calendarPreferences', 'lastSplashShownAt', 'createdAt', 'updatedAt'],
                    properties: {
                        theme: { type: 'string', enum: ['dark', 'light'], example: 'dark' },
                        toolbarConfig: {
                            type: 'object',
                            additionalProperties: { type: 'boolean' },
                            example: {
                                showProject: true,
                                showGit: true,
                                showStructure: true
                            }
                        },
                        filterPreferences: {
                            type: 'object',
                            properties: {
                                showFiltersRow: { type: 'boolean', example: true },
                                showNameSearch: { type: 'boolean', example: true },
                                showTypeFilters: { type: 'boolean', example: true },
                                allowMultipleSortRules: { type: 'boolean', example: true },
                                showCalendarZone: { type: 'boolean', example: true }
                            }
                        },
                        calendarPreferences: {
                            type: 'object',
                            additionalProperties: true,
                            example: {}
                        },
                        lastSplashShownAt: {
                            type: 'string',
                            format: 'date-time',
                            nullable: true,
                            example: '2026-03-20T09:00:00.000Z'
                        },
                        createdAt: { type: 'string', format: 'date-time', example: '2026-03-19T10:00:00.000Z' },
                        updatedAt: { type: 'string', format: 'date-time', example: '2026-03-20T09:00:00.000Z' }
                    }
                },
                PreferenceUpdateRequest: {
                    type: 'object',
                    minProperties: 1,
                    properties: {
                        theme: { type: 'string', enum: ['dark', 'light'], example: 'light' },
                        toolbarConfig: {
                            type: 'object',
                            additionalProperties: { type: 'boolean' },
                            example: {
                                showProject: true,
                                showGit: false
                            }
                        },
                        filterPreferences: {
                            type: 'object',
                            properties: {
                                showFiltersRow: { type: 'boolean', example: true },
                                showNameSearch: { type: 'boolean', example: true },
                                showTypeFilters: { type: 'boolean', example: false },
                                allowMultipleSortRules: { type: 'boolean', example: true },
                                showCalendarZone: { type: 'boolean', example: true }
                            }
                        },
                        calendarPreferences: {
                            type: 'object',
                            additionalProperties: true,
                            example: {
                                firstDayOfWeek: 'monday'
                            }
                        },
                        lastSplashShownAt: {
                            type: 'string',
                            format: 'date-time',
                            nullable: true,
                            example: '2026-03-20T09:00:00.000Z'
                        }
                    }
                },
                ModuleStatusResponse: {
                    type: 'object',
                    required: ['ok', 'module', 'message'],
                    properties: {
                        ok: { type: 'boolean', example: true },
                        module: { type: 'string', example: 'tasks' },
                        message: { type: 'string', example: 'El módulo de tareas está en línea.' }
                    }
                },
                ErrorResponse: {
                    type: 'object',
                    required: ['ok', 'code', 'message'],
                    properties: {
                        ok: { type: 'boolean', example: false },
                        code: { type: 'string', example: 'VALIDATION_ERROR' },
                        message: { type: 'string', example: 'La validación de la solicitud falló.' },
                        details: {
                            type: 'object',
                            nullable: true,
                            additionalProperties: {
                                type: 'array',
                                items: { type: 'string' }
                            },
                            example: {
                                email: ['Debes introducir un correo electrónico válido.']
                            }
                        }
                    }
                }
            }
        },
        paths: {
            '/health': {
                get: {
                    summary: 'Estado general del backend',
                    description: 'Permite comprobar rápidamente si el servidor principal está en línea.',
                    tags: ['Auth'],
                    responses: {
                        200: {
                            description: 'Servidor disponible',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            ok: { type: 'boolean', example: true },
                                            service: { type: 'string', example: 'taskflow-backend' }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            '/api/auth/status': {
                get: {
                    tags: ['Auth'],
                    summary: 'Estado del módulo auth',
                    responses: {
                        200: {
                            description: 'Módulo auth activo',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/ModuleStatusResponse' },
                                    example: {
                                        ok: true,
                                        module: 'auth',
                                        message: 'El módulo de autenticación está en línea.'
                                    }
                                }
                            }
                        }
                    }
                }
            },
            '/api/auth/register': {
                post: {
                    tags: ['Auth'],
                    summary: 'Registrar usuario',
                    description: 'Crea un usuario nuevo y abre sesión automáticamente en el servidor.',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/RegisterRequest' }
                            }
                        }
                    },
                    responses: {
                        201: {
                            description: 'Usuario creado',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/RegisterResponse' }
                                }
                            }
                        },
                        400: {
                            description: 'Payload inválido',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/ErrorResponse' }
                                }
                            }
                        },
                        409: {
                            description: 'Email o username en uso',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/ErrorResponse' }
                                }
                            }
                        },
                        500: {
                            description: 'Error interno',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/ErrorResponse' }
                                }
                            }
                        }
                    }
                }
            },
            '/api/auth/login': {
                post: {
                    tags: ['Auth'],
                    summary: 'Iniciar sesión',
                    description: 'Inicia sesión con correo o username y devuelve el usuario autenticado.',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/LoginRequest' }
                            }
                        }
                    },
                    responses: {
                        200: {
                            description: 'Sesión iniciada',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/AuthUserResponse' }
                                }
                            }
                        },
                        400: {
                            description: 'Payload inválido',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/ErrorResponse' }
                                }
                            }
                        },
                        401: {
                            description: 'Credenciales inválidas',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/ErrorResponse' }
                                }
                            }
                        },
                        500: {
                            description: 'Error interno',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/ErrorResponse' }
                                }
                            }
                        }
                    }
                }
            },
            '/api/auth/me': {
                get: {
                    tags: ['Auth'],
                    summary: 'Usuario autenticado actual',
                    security: [{ sessionCookie: [] }],
                    responses: {
                        200: {
                            description: 'Usuario autenticado',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/AuthUserResponse' }
                                }
                            }
                        },
                        401: {
                            description: 'No hay sesión activa',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/ErrorResponse' }
                                }
                            }
                        }
                    }
                }
            },
            '/api/auth/logout': {
                post: {
                    tags: ['Auth'],
                    summary: 'Cerrar sesión',
                    security: [{ sessionCookie: [] }],
                    responses: {
                        200: {
                            description: 'Sesión cerrada',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/ActionResponse' },
                                    example: {
                                        ok: true,
                                        message: 'Sesión cerrada correctamente.'
                                    }
                                }
                            }
                        },
                        500: {
                            description: 'Error cerrando sesión',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/ErrorResponse' }
                                }
                            }
                        }
                    }
                }
            },
            '/api/tasks/status': {
                get: {
                    tags: ['Tasks'],
                    summary: 'Estado del módulo tasks',
                    responses: {
                        200: {
                            description: 'Módulo tasks activo',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/ModuleStatusResponse' },
                                    example: {
                                        ok: true,
                                        module: 'tasks',
                                        message: 'El módulo de tareas está en línea.'
                                    }
                                }
                            }
                        }
                    }
                }
            },
            '/api/tasks': {
                get: {
                    tags: ['Tasks'],
                    summary: 'Listar tareas activas',
                    security: [{ sessionCookie: [] }],
                    parameters: [
                        { name: 'page', in: 'query', schema: { type: 'integer', minimum: 1, default: 1 } },
                        { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 } },
                        { name: 'search', in: 'query', schema: { type: 'string', maxLength: 200 } },
                        { name: 'type', in: 'query', schema: { type: 'string', maxLength: 100 } },
                        { name: 'status', in: 'query', schema: { type: 'string', enum: ['pendiente', 'haciendo', 'completado'] } },
                        { name: 'priority', in: 'query', schema: { type: 'string', enum: ['baja', 'media', 'alta'] } },
                        { name: 'from', in: 'query', schema: { type: 'string', format: 'date', example: '2026-03-01' } },
                        { name: 'to', in: 'query', schema: { type: 'string', format: 'date', example: '2026-03-31' } },
                        { name: 'sortBy', in: 'query', schema: { type: 'string', enum: ['createdAt', 'updatedAt', 'priority', 'status', 'type', 'text'], default: 'createdAt' } },
                        { name: 'sortOrder', in: 'query', schema: { type: 'string', enum: ['asc', 'desc'], default: 'desc' } }
                    ],
                    responses: {
                        200: {
                            description: 'Listado de tareas',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/TaskListResponse' }
                                }
                            }
                        },
                        401: {
                            description: 'No has iniciado sesión',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/ErrorResponse' }
                                }
                            }
                        },
                        400: {
                            description: 'Query inválida',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/ErrorResponse' }
                                }
                            }
                        }
                    }
                },
                post: {
                    tags: ['Tasks'],
                    summary: 'Crear tarea',
                    security: [{ sessionCookie: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/TaskCreateRequest' }
                            }
                        }
                    },
                    responses: {
                        201: {
                            description: 'Tarea creada',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/TaskResponse' }
                                }
                            }
                        },
                        400: {
                            description: 'Payload inválido',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/ErrorResponse' }
                                }
                            }
                        },
                        401: {
                            description: 'No has iniciado sesión',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/ErrorResponse' }
                                }
                            }
                        }
                    }
                },
                patch: {
                    deprecated: true,
                    tags: ['Tasks'],
                    summary: 'No usado',
                    description: 'Reservado. Las actualizaciones reales se hacen sobre /api/tasks/{id}.',
                    responses: {
                        404: {
                            description: 'Ruta no implementada'
                        }
                    }
                }
            },
            '/api/tasks/trash': {
                get: {
                    tags: ['Tasks'],
                    summary: 'Listar tareas en papelera',
                    security: [{ sessionCookie: [] }],
                    parameters: [
                        { name: 'page', in: 'query', schema: { type: 'integer', minimum: 1, default: 1 } },
                        { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 } },
                        { name: 'search', in: 'query', schema: { type: 'string', maxLength: 200 } },
                        { name: 'type', in: 'query', schema: { type: 'string', maxLength: 100 } },
                        { name: 'status', in: 'query', schema: { type: 'string', enum: ['pendiente', 'haciendo', 'completado'] } },
                        { name: 'priority', in: 'query', schema: { type: 'string', enum: ['baja', 'media', 'alta'] } },
                        { name: 'from', in: 'query', schema: { type: 'string', format: 'date' } },
                        { name: 'to', in: 'query', schema: { type: 'string', format: 'date' } },
                        { name: 'sortBy', in: 'query', schema: { type: 'string', enum: ['createdAt', 'updatedAt', 'priority', 'status', 'type', 'text'], default: 'createdAt' } },
                        { name: 'sortOrder', in: 'query', schema: { type: 'string', enum: ['asc', 'desc'], default: 'desc' } }
                    ],
                    responses: {
                        200: {
                            description: 'Listado de tareas en papelera',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/TaskListResponse' }
                                }
                            }
                        },
                        401: {
                            description: 'No has iniciado sesión',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/ErrorResponse' }
                                }
                            }
                        }
                    }
                }
            },
            '/api/tasks/types': {
                get: {
                    tags: ['Tasks'],
                    summary: 'Listar tipos de tarea',
                    security: [{ sessionCookie: [] }],
                    parameters: [
                        { name: 'search', in: 'query', schema: { type: 'string', maxLength: 100 } },
                        { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 50, default: 10 } },
                        { name: 'scope', in: 'query', schema: { type: 'string', enum: ['active', 'trash'], default: 'active' } }
                    ],
                    responses: {
                        200: {
                            description: 'Tipos distintos disponibles',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/TaskTypesResponse' }
                                }
                            }
                        },
                        401: {
                            description: 'No has iniciado sesión',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/ErrorResponse' }
                                }
                            }
                        },
                        400: {
                            description: 'Query inválida',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/ErrorResponse' }
                                }
                            }
                        }
                    }
                }
            },
            '/api/tasks/bulk/complete-all': {
                patch: {
                    tags: ['Tasks'],
                    summary: 'Completar todas las tareas activas',
                    security: [{ sessionCookie: [] }],
                    responses: {
                        200: {
                            description: 'Resultado de la acción masiva',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/BulkActionResponse' }
                                }
                            }
                        },
                        401: {
                            description: 'No has iniciado sesión',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/ErrorResponse' }
                                }
                            }
                        }
                    }
                }
            },
            '/api/tasks/bulk/trash-completed': {
                patch: {
                    tags: ['Tasks'],
                    summary: 'Mandar a papelera las tareas completadas',
                    security: [{ sessionCookie: [] }],
                    responses: {
                        200: {
                            description: 'Resultado de la acción masiva',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/BulkActionResponse' }
                                }
                            }
                        },
                        401: {
                            description: 'No has iniciado sesión',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/ErrorResponse' }
                                }
                            }
                        }
                    }
                }
            },
            '/api/tasks/bulk/trash-all': {
                patch: {
                    tags: ['Tasks'],
                    summary: 'Mandar a papelera todas las tareas activas',
                    security: [{ sessionCookie: [] }],
                    responses: {
                        200: {
                            description: 'Resultado de la acción masiva',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/BulkActionResponse' }
                                }
                            }
                        },
                        401: {
                            description: 'No has iniciado sesión',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/ErrorResponse' }
                                }
                            }
                        }
                    }
                }
            },
            '/api/tasks/bulk/delete-trash': {
                delete: {
                    tags: ['Tasks'],
                    summary: 'Vaciar papelera definitivamente',
                    security: [{ sessionCookie: [] }],
                    responses: {
                        200: {
                            description: 'Resultado del vaciado',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/BulkActionResponse' }
                                }
                            }
                        },
                        401: {
                            description: 'No has iniciado sesión',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/ErrorResponse' }
                                }
                            }
                        }
                    }
                }
            },
            '/api/tasks/{id}': {
                patch: {
                    tags: ['Tasks'],
                    summary: 'Actualizar tarea',
                    security: [{ sessionCookie: [] }],
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            schema: { type: 'string' },
                            description: 'ID de la tarea.'
                        }
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/TaskUpdateRequest' }
                            }
                        }
                    },
                    responses: {
                        200: {
                            description: 'Tarea actualizada',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/TaskResponse' }
                                }
                            }
                        },
                        400: {
                            description: 'Payload inválido',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/ErrorResponse' }
                                }
                            }
                        },
                        401: {
                            description: 'No has iniciado sesión',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/ErrorResponse' }
                                }
                            }
                        },
                        404: {
                            description: 'Tarea no encontrada',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/ErrorResponse' }
                                }
                            }
                        },
                        409: {
                            description: 'La tarea está en un estado conflictivo para la operación',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/ErrorResponse' }
                                }
                            }
                        }
                    }
                },
                delete: {
                    tags: ['Tasks'],
                    summary: 'Eliminar tarea definitivamente',
                    security: [{ sessionCookie: [] }],
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            schema: { type: 'string' }
                        }
                    ],
                    responses: {
                        200: {
                            description: 'Tarea eliminada',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/ActionResponse' },
                                    example: {
                                        ok: true,
                                        message: 'La tarea se eliminó definitivamente.'
                                    }
                                }
                            }
                        },
                        401: {
                            description: 'No has iniciado sesión',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/ErrorResponse' }
                                }
                            }
                        },
                        404: {
                            description: 'Tarea no encontrada',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/ErrorResponse' }
                                }
                            }
                        }
                    }
                }
            },
            '/api/tasks/{id}/trash': {
                patch: {
                    tags: ['Tasks'],
                    summary: 'Mandar tarea a papelera',
                    security: [{ sessionCookie: [] }],
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            schema: { type: 'string' }
                        }
                    ],
                    responses: {
                        200: {
                            description: 'Tarea enviada a papelera',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/TaskResponse' }
                                }
                            }
                        },
                        401: {
                            description: 'No has iniciado sesión',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/ErrorResponse' }
                                }
                            }
                        },
                        404: {
                            description: 'Tarea no encontrada',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/ErrorResponse' }
                                }
                            }
                        },
                        409: {
                            description: 'La tarea ya estaba en papelera',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/ErrorResponse' }
                                }
                            }
                        }
                    }
                }
            },
            '/api/tasks/{id}/restore': {
                patch: {
                    tags: ['Tasks'],
                    summary: 'Restaurar tarea desde papelera',
                    security: [{ sessionCookie: [] }],
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            schema: { type: 'string' }
                        }
                    ],
                    responses: {
                        200: {
                            description: 'Tarea restaurada',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/TaskResponse' }
                                }
                            }
                        },
                        401: {
                            description: 'No has iniciado sesión',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/ErrorResponse' }
                                }
                            }
                        },
                        404: {
                            description: 'Tarea no encontrada',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/ErrorResponse' }
                                }
                            }
                        },
                        409: {
                            description: 'La tarea no estaba en papelera',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/ErrorResponse' }
                                }
                            }
                        }
                    }
                }
            },
            '/api/preferences/status': {
                get: {
                    tags: ['Preferences'],
                    summary: 'Estado del módulo preferences',
                    responses: {
                        200: {
                            description: 'Módulo preferences activo',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/ModuleStatusResponse' },
                                    example: {
                                        ok: true,
                                        module: 'preferences',
                                        message: 'El módulo de preferencias está en línea.'
                                    }
                                }
                            }
                        }
                    }
                }
            },
            '/api/preferences': {
                get: {
                    tags: ['Preferences'],
                    summary: 'Obtener preferencias del usuario actual',
                    security: [{ sessionCookie: [] }],
                    responses: {
                        200: {
                            description: 'Preferencias actuales',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/PreferenceResponse' }
                                }
                            }
                        },
                        401: {
                            description: 'No has iniciado sesión',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/ErrorResponse' }
                                }
                            }
                        }
                    }
                },
                patch: {
                    tags: ['Preferences'],
                    summary: 'Actualizar preferencias del usuario actual',
                    security: [{ sessionCookie: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/PreferenceUpdateRequest' }
                            }
                        }
                    },
                    responses: {
                        200: {
                            description: 'Preferencias actualizadas',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/PreferenceResponse' }
                                }
                            }
                        },
                        400: {
                            description: 'Payload inválido',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/ErrorResponse' }
                                }
                            }
                        },
                        401: {
                            description: 'No has iniciado sesión',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/ErrorResponse' }
                                }
                            }
                        }
                    }
                }
            }
        }
    };
}

export function buildOpenApiSpec() {
    return swaggerJsdoc({
        definition: buildOpenApiDefinition(),
        apis: []
    });
}

export function registerOpenApi(app) {
    const spec = buildOpenApiSpec();

    app.get('/api/docs.json', (_req, res) => {
        res.status(200).json(spec);
    });

    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(spec, {
        explorer: true,
        customSiteTitle: 'TaskFlow API Docs'
    }));
}
