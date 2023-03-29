import Joi from "joi";
const signUpSchema = Joi.object({
    name: Joi.string().min(3).max(80).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .pattern(/^[A-Z][a-z0-9]{3-30}$/)
      .required(),
    rePassword: Joi.ref("password"),
  });
  const signInSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
      .pattern(/^[A-Z][a-z0-9]{3-30}$/)
      .required()
  });
  export{
    signUpSchema,signInSchema
  }