import * as Joi from '@hapi/joi'

export const configValidationSchema = Joi.object({
  MODE: Joi.string().valid('development', 'production').default('development'),
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().default(5432).required(),
  DATABASE_USERNAME: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
  DATABASE_SYNC: Joi.boolean().default(false),
  JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
  AUTH_SERVICE: Joi.string().required()
})
