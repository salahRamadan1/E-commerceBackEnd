import express from "express";
import {
  createCategory,
  deleteCategoryId,
  getCategory,
  getCategoryId,
  updateCAtegory,
} from "./category.service.js";
import { routerSubCategory } from "../subCategory/subCategory.api.js";
import { uploadFileImage } from "../../utils/multer/multerImage.js";
import { allowed, protectedRoutes } from "../users/auth.js";
const routerCategory = express.Router();
routerCategory.use("/:categoryId/subCategory", routerSubCategory);
routerCategory
  .route("/")
  .post(protectedRoutes, allowed('admin'), uploadFileImage("category", "image"), createCategory)
  .get(getCategory)
  .put(protectedRoutes, allowed('admin'), uploadFileImage("category", "image"), updateCAtegory)
routerCategory
  .route("/:id")
  .get(getCategoryId)
  .delete(protectedRoutes, allowed('admin'), deleteCategoryId);
export { routerCategory };
