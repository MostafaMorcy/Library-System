import express from 'express';
// import { validation } from '../../middleware/validation.js';
import * as userController from './user.controller.js'
// import { signInSchema, signUpSchema } from './user.validation.js';
export const userRouter= express.Router();
userRouter.post('/signup',userController.signUp)
userRouter.post('/signin',userController.signIn)
userRouter.get('/verify/:token',userController.verify)
userRouter.patch('/forgetPassword',userController.forgetPassword)
userRouter.patch('/resetPassword/:token',userController.resetPassword)
userRouter.put('/logOut',userController.logOut)
userRouter.delete('/softDelete',userController.softDeleted)