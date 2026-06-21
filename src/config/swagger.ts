import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TaskFlow API',
      version: '1.0.0',
      description: 'API RESTful para la aplicación TaskFlow',
    },
    servers: [
      {
        url: 'http://localhost:{port}',
        variables: { port: { default: '3000' } },
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Ingresa tu token JWT',
        },
      },
      schemas: {
        ApiResponse: {
          type: 'object',
          properties: {
            status: { type: 'integer' },
            message: { type: 'string' },
            data: { type: 'object', nullable: true },
            error: { type: 'string', nullable: true },
            timestamp: { type: 'string', format: 'date-time' },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Project: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            description: { type: 'string' },
            ownerId: { type: 'string', format: 'uuid' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Task: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
            description: { type: 'string' },
            status: {
              type: 'string',
              enum: ['TODO', 'IN_PROGRESS', 'DONE', 'CANCELLED'],
            },
            projectId: { type: 'string', format: 'uuid' },
            assignedTo: { type: 'string', format: 'uuid', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Comment: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            content: { type: 'string' },
            taskId: { type: 'string', format: 'uuid' },
            userId: { type: 'string', format: 'uuid' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: { error: { type: 'string' } },
        },
      },
    },
    security: [{ bearerAuth: [] }],
    paths: {
      '/': {
        get: {
          summary: 'Información de la API',
          responses: {
            '200': { description: 'OK', content: { 'application/json': { example: { message: 'TaskFlow API', version: '1.0.0' } } } },
          },
        },
      },
      '/api/health': {
        get: {
          summary: 'Health check',
          responses: {
            '200': { description: 'OK' },
          },
        },
      },
      '/api/users': {
        get: {
          summary: 'Listar usuarios',
          responses: {
            '200': { description: 'Lista de usuarios' },
          },
        },
        post: {
          summary: 'Crear usuario',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    email: { type: 'string' },
                    password: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            '201': { description: 'Usuario creado' },
          },
        },
      },
      '/api/users/{id}': {
        get: {
          summary: 'Obtener usuario por ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: { '200': { description: 'Usuario' }, '404': { description: 'No encontrado' } },
        },
        put: {
          summary: 'Actualizar usuario',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { name: { type: 'string' }, email: { type: 'string' } } } } } },
          responses: { '200': { description: 'Actualizado' }, '404': { description: 'No encontrado' } },
        },
        delete: {
          summary: 'Eliminar usuario',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: { '204': { description: 'Eliminado' }, '404': { description: 'No encontrado' } },
        },
      },
      '/api/projects': {
        get: {
          summary: 'Listar proyectos',
          responses: { '200': { description: 'Lista de proyectos' } },
        },
        post: {
          summary: 'Crear proyecto',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { name: { type: 'string' }, description: { type: 'string' } },
                },
              },
            },
          },
          responses: { '201': { description: 'Proyecto creado' } },
        },
      },
      '/api/projects/{id}': {
        get: {
          summary: 'Obtener proyecto por ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: { '200': { description: 'Proyecto' }, '404': { description: 'No encontrado' } },
        },
        put: {
          summary: 'Actualizar proyecto',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { name: { type: 'string' }, description: { type: 'string' } } } } } },
          responses: { '200': { description: 'Actualizado' }, '404': { description: 'No encontrado' } },
        },
        delete: {
          summary: 'Eliminar proyecto',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: { '204': { description: 'Eliminado' }, '404': { description: 'No encontrado' } },
        },
      },
      '/api/auth/register': {
        post: {
          summary: 'Registrar usuario',
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'email', 'password'],
                  properties: { name: { type: 'string' }, email: { type: 'string' }, password: { type: 'string' } },
                },
              },
            },
          },
          responses: { '201': { description: 'Usuario registrado' }, '400': { description: 'Datos inválidos' } },
        },
      },
      '/api/auth/login': {
        post: {
          summary: 'Iniciar sesión',
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: { email: { type: 'string' }, password: { type: 'string' } },
                },
              },
            },
          },
          responses: { '200': { description: 'Login exitoso' }, '401': { description: 'Credenciales inválidas' } },
        },
      },
      '/api/auth/me': {
        get: {
          summary: 'Obtener usuario actual',
          responses: { '200': { description: 'Usuario actual' }, '401': { description: 'No autorizado' } },
        },
      },
      '/api/comments/task/{taskId}': {
        get: {
          summary: 'Listar comentarios de una tarea',
          parameters: [{ name: 'taskId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: { '200': { description: 'Lista de comentarios' }, '404': { description: 'Tarea no encontrada' } },
        },
      },
      '/api/comments': {
        post: {
          summary: 'Crear comentario',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['content', 'taskId'],
                  properties: { content: { type: 'string' }, taskId: { type: 'string', format: 'uuid' } },
                },
              },
            },
          },
          responses: { '201': { description: 'Comentario creado' }, '404': { description: 'Tarea no encontrada' } },
        },
      },
      '/api/comments/{id}': {
        delete: {
          summary: 'Eliminar comentario',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: { '204': { description: 'Eliminado' }, '403': { description: 'No autorizado' }, '404': { description: 'No encontrado' } },
        },
      },
      '/api/tasks/project/{projectId}': {
        get: {
          summary: 'Listar tareas de un proyecto',
          parameters: [{ name: 'projectId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: { '200': { description: 'Lista de tareas' } },
        },
      },
      '/api/tasks/{id}': {
        get: {
          summary: 'Obtener tarea por ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: { '200': { description: 'Tarea' }, '404': { description: 'No encontrada' } },
        },
      },
      '/api/tasks': {
        post: {
          summary: 'Crear tarea',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['title', 'projectId'],
                  properties: {
                    title: { type: 'string' },
                    description: { type: 'string' },
                    status: { type: 'string', enum: ['TODO', 'IN_PROGRESS', 'DONE', 'CANCELLED'] },
                    projectId: { type: 'string', format: 'uuid' },
                    assignedTo: { type: 'string', format: 'uuid' },
                  },
                },
              },
            },
          },
          responses: { '201': { description: 'Tarea creada' }, '404': { description: 'Proyecto no encontrado' } },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
