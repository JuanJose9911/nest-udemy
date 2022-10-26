// Aqui se hacen reglas de validacion para las variables de entorno, si son requeridas, si son numeros, si son strings, etc

import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
    MONGODB: Joi.string().required(),
    PORT: Joi.number().default(3000),
    DEFAULT_LIMIT: Joi.number().default(5),
})