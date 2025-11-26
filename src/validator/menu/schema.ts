import Joi from "joi"

export const MenuPayloadSchema = Joi.object({
  name: Joi.string().required(),
  category: Joi.string().required(),
  calories: Joi.number().min(0).required(),
  price: Joi.number().min(0).required(),
  ingredients: Joi.array().required(),
  description: Joi.string().required(),
});
