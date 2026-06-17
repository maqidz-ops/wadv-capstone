const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    'string.empty': 'Nama tidak boleh kosong.',
    'string.min': 'Nama minimal 2 karakter.',
    'string.max': 'Nama maksimal 100 karakter.',
    'any.required': 'Nama wajib diisi.',
  }),
  email: Joi.string().trim().email().lowercase().required().messages({
    'string.email': 'Format email tidak valid.',
    'any.required': 'Email wajib diisi.',
  }),
  password: Joi.string().min(8).max(128).required().messages({
    'string.min': 'Password minimal 8 karakter.',
    'string.max': 'Password maksimal 128 karakter.',
    'any.required': 'Password wajib diisi.',
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().trim().email().lowercase().required().messages({
    'string.email': 'Format email tidak valid.',
    'any.required': 'Email wajib diisi.',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password wajib diisi.',
  }),
});

const refreshSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    'any.required': 'refreshToken wajib disertakan.',
  }),
});

module.exports = { registerSchema, loginSchema, refreshSchema };
