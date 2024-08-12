import express from "express";
import { allowed, protectedRoutes } from "../users/auth.js";
import { createBrand, deleteBrandId, getBrand, getBrandId, updateBrand } from "./brands.service.js";
import { uploadFileImage } from "../../utils/multer/multerImage.js";
const routerBrand = express.Router({ mergeParams: true })


routerBrand.route('/').post(protectedRoutes, allowed('admin'), uploadFileImage("brand", "image"), createBrand)
    .get(getBrand)
    .put(protectedRoutes, allowed('admin'), uploadFileImage("brand", "image"), updateBrand)
routerBrand.route("/:id")
    .get(getBrandId)
    .delete(protectedRoutes, allowed('admin'), deleteBrandId)
export { routerBrand }