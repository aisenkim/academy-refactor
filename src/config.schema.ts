import * as Joi from 'joi';

/**
 * For validating schema: shows error when any of these variables are missing
 * To install: npm install --save @hapi/joi
 * npm install --save -D @types/hapi__joi
 */
export const configValidationSchema = Joi.object({
  PORT: Joi.number().default(4000),
  STAGE: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432).required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
});
