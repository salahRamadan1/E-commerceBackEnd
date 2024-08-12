import { Router } from "express";
import { addWishList, getUserWishList, removeWishList } from "./wishList.service.js";
import { allowed, protectedRoutes } from "../users/auth.js";

const routerWishList = Router()
routerWishList.use(protectedRoutes)
routerWishList.route('/')
    .patch(addWishList)
    .post(removeWishList)
    .get(getUserWishList)
export { routerWishList }