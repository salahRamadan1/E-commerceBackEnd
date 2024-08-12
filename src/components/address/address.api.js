import { Router } from "express";
 
import { allowed, protectedRoutes } from "../users/auth.js";
import { addAddressList, getUserAddressList, removeAddressList } from "./address.service.js";
import { removeWishList } from "../wishList/wishList.service.js";

const routerAddressList = Router()
routerAddressList.route('/')
    .patch(protectedRoutes, addAddressList)
    .delete(protectedRoutes, removeAddressList)
    .get(protectedRoutes, getUserAddressList)
export { routerAddressList }