import express from "express";

import { createSubCategory, deleteSubCategoryId, getSubCategoryId, subGetCategory, updateSubCategory } from './subCategory.service.js'
import { allowed, protectedRoutes } from "../users/auth.js";
const routerSubCategory = express.Router({ mergeParams: true })


routerSubCategory.route('/').post(protectedRoutes, allowed('admin'), createSubCategory).get(subGetCategory)
    .put(protectedRoutes, allowed('admin'), updateSubCategory)
routerSubCategory.route("/:id")
    .delete(protectedRoutes, allowed('admin'), deleteSubCategoryId)
    .get(getSubCategoryId)
export { routerSubCategory }