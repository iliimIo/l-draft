import * as Joi from '@hapi/joi'

export const configValidationSchema = Joi.object({
  MODE: Joi.string().valid('development', 'production').default('development'),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432).required(),
  DB_USER: Joi.string().required(),
  DB_PASS: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DATABASE_SYNC: Joi.boolean().default(false)
  // JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
  // AUTH_SERVICE: Joi.string().required()
})
