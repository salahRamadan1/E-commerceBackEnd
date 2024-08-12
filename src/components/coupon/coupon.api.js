import { Router } from "express";

import { allowed, protectedRoutes } from "../users/auth.js";
import { createCoupon, getCouponId, getCoupon, deleteCouponId, updateCoupon } from "./coupon.service.js";
import { uploadFileImage } from "../../utils/multer/multerImage.js";

const routerCoupon = Router()
// routerCoupon.use(protectedRoutes, allowed('user'))
routerCoupon.route('/')
    .post(protectedRoutes, allowed('admin'), uploadFileImage("coupon", "image"), createCoupon)
    .get(getCoupon)
    .put(protectedRoutes, allowed('admin'),uploadFileImage("coupon", "image"), updateCoupon)
routerCoupon.route('/:id')
    .get(getCouponId)
    .delete(protectedRoutes, allowed('admin'), deleteCouponId)
export { routerCoupon }     