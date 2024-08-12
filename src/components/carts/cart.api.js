import express from "express";
import { addCart, applyCouponToCart, getcartItem, removeCart, updateCartPlus } from "./cart.service.js";
import { protectedRoutes } from "../users/auth.js";
const routerCart = express.Router();

routerCart.use(protectedRoutes)
routerCart.route('/')
    .post(addCart)
    .delete(removeCart)
    .patch(updateCartPlus)
    .get(getcartItem);
 
routerCart.post('/applyCoupon', applyCouponToCart)
export { routerCart }