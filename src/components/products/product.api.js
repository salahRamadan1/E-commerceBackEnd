import express from "express";
import { createProduct, deleteProduct, getProduct, getProducts, productSpecificCategory, updateOneProductImagesOrImage, updateProductValue } from "./product.service.js";
import { uploadFileImage, uploadFilesImages } from "../../utils/multer/multerImage.js";
import { allowed, protectedRoutes } from "../users/auth.js";


const routerProduct = express.Router();
let fileds = [
    { name: 'image', maxCount: 1 },
    { name: 'images', maxCount: 3 }
]
routerProduct.route("/")
    .post(protectedRoutes, allowed('admin'), uploadFilesImages("product", fileds), createProduct)
    .get(getProducts)
    .put(protectedRoutes, allowed('admin'), updateProductValue)
    .patch(protectedRoutes, allowed('admin'), uploadFilesImages("product", fileds), updateOneProductImagesOrImage)


routerProduct.route("/:id")
    .post(getProduct)
    .delete(protectedRoutes, allowed('admin'), deleteProduct)
    .get(productSpecificCategory)
export { routerProduct };
