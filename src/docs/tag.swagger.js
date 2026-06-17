// File: src/docs/tag.swagger.js

const tagDocumentation = {
  components: {
    schemas: {
      Tag: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Urgent' },
          color: { type: 'string', example: '#FF0000' }
        }
      },
      CreateTagRequest: {
        type: 'object',
        required: ['name', 'color'],
        properties: {
          name: { type: 'string', example: 'Urgent' },
          color: { type: 'string', example: '#FF0000' }
        }
      }
    }
  },
  paths: {
    '/tags': {
      post: {
        summary: 'Create a new tag',
        tags: ['Tags'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateTagRequest' }
            }
          }
        },
        responses: {
          201: {
            description: 'Tag created successfully',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Tag' } }
            }
          }
        }
      },
      get: {
        summary: 'Get all tags',
        tags: ['Tags'],
        responses: {
          200: {
            description: 'List of tags',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/Tag' } }
              }
            }
          }
        }
      }
    },
    '/task-tags/{taskId}/tags': {
      post: {
        summary: 'Hubungkan Tag ke Task tertentu (Many-to-Many)',
        tags: ['Task Tags'],
        parameters: [
          {
            in: 'path',
            name: 'taskId',
            required: true,
            schema: { type: 'integer' },
            description: 'ID dari Task yang akan ditempeli tag'
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['tagId'],
                properties: { tagId: { type: 'integer', example: 1 } }
              }
            }
          }
        },
        responses: {
          201: { description: 'Tag berhasil ditambahkan ke task' },
          401: { description: 'Access token diperlukan / tidak valid' }
        }
      }
    },
    '/task-tags/{taskId}/tags/{tagId}': {
      delete: {
        summary: 'Remove tag from task',
        tags: ['Task Tags'],
        parameters: [
          {
            in: 'path',
            name: 'taskId',
            required: true,
            schema: { type: 'integer' },
            description: 'ID dari Task'
          },
          {
            in: 'path',
            name: 'tagId',
            required: true,
            schema: { type: 'integer' },
            description: 'ID dari Tag yang ingin dilepas'
          }
        ],
        responses: {
          200: { description: 'Tag berhasil dihapus dari task' },
          404: { description: 'Hubungan task dan tag tidak ditemukan' }
        }
      }
    }
  }
};

module.exports = tagDocumentation;