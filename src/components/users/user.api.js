import { Router } from "express";
import { addUser, deleteUser, getUsers, updateUser } from "./user.service.js";
import { allowed, changePassword, changeProfileImage, googleLogIn, logIn, protectedRoutes, resetPassWord, sendNumberverifyIfNotsend, signUp, verfiyEmail } from "./auth.js";
import { uploadFileImage } from "../../utils/multer/multerImage.js";
import { userValidation } from "../../middleWare/validation.js";
const routerUserAuth = Router()
routerUserAuth.route('/')
    .post(protectedRoutes, allowed('admin'), addUser)
    .delete(protectedRoutes, allowed('admin'), deleteUser)
    .put(protectedRoutes, allowed('admin'), updateUser)
    .get(protectedRoutes, allowed('admin'), getUsers)
routerUserAuth
    .post('/googleLogIn', googleLogIn)// User login
    .post('/signUp', userValidation, signUp) // done
    .post('/logIn', userValidation, logIn) // done
    .post('/verfiy', verfiyEmail)
    .post('/numberVerfiy', sendNumberverifyIfNotsend) // done
    .post('/resetPassWord', resetPassWord) // done
    .patch('/changeProfilePicture', uploadFileImage("profilePicture", "profileImage"), changeProfileImage)
    .patch('/changePassword', changePassword)
export { routerUserAuth }