
import AppError from "../../utils/HandelError/appError/APPERROR.js";
import { catchAsyncError } from "../../utils/HandelError/catchError/catchError.js";
import { factoryAddDocument } from "../../utils/HandlerFactoryEndPoint/handler.factory.js";
import { UserModel } from "./users.model.js";
import bcrypt from 'bcrypt'


const addUser = catchAsyncError(async (req, res, next) => {
  const oneUser = await UserModel.findOne({ email: req.body.email })
  if (oneUser) {
    return next(new AppError('user already exist'))
  }
  const user = new UserModel(req.body)
  await user.save()
  res.status(200).json({ message: 'success' })

})
const deleteUser = catchAsyncError(async (req, res, next) => {
  const oneUser = await UserModel.findOne({ email: req.body.email })
  if (!oneUser) {
    return next(new AppError('user not found'))
  }
  await UserModel.findByIdAndDelete(oneUser.id)
  res.status(200).json({ message: 'success' })
})
const updateUser = catchAsyncError(async (req, res, next) => {
  // Everything except the password
  const oneUser = await UserModel.findOne({ email: req.body.email })
  if (!oneUser) {
    return next(new AppError('user not found'))
  }

  await UserModel.findByIdAndUpdate(oneUser.id, req.body)
  res.status(200).json({ message: 'success' })
})
const getUsers = catchAsyncError(async (req, res, next) => {
  const user = await UserModel.find({})
  if (user.length < 1) {
    return next(new AppError('user not found'))
  }
  res.status(200).json({ message: 'success', user })
})

export { addUser, deleteUser, updateUser, getUsers }
