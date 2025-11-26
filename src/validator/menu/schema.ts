import Joi from "joi"

export const MenuPayloadSchema = Joi.object({
  name: Joi.string().required(),
  category: Joi.string().required(),
  calories: Joi.number().required(),
  price: Joi.number().required(),
  ingredients: Joi.array().required(),
  description: Joi.string().required(),
});
