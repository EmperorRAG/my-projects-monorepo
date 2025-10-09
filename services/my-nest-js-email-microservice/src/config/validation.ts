import * as Joi from 'joi';

export const validationSchema = Joi.object({
  SMTP_HOST: Joi.string().required(),
  SMTP_PORT: Joi.number().required(),
  SMTP_USER: Joi.string().required(),
  SMTP_PASS: Joi.string().required(),
  API_KEY: Joi.string().required(),
});
