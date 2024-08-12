import { subCategoryModel } from "./subCategory.model.js";
import {
  factoryAddDocument,
  factoryDelete,
  factoryGetAllDocument,
  factoryGetOneDocumentId,
  factoryUpdate,
} from "../../utils/HandlerFactoryEndPoint/handler.factory.js";
// new category
const createSubCategory = factoryAddDocument(subCategoryModel);
// catchAsyncError(async (req, res, next) => {
//   const { name, categoryId } = req.body;
//   let newSubCategory = new subCategoryModel({
//     name,
//     categoryId,
//     slug: slugify(name),
//   });
//   await newSubCategory.save();
//   res.status(200).json({ massage: "success", newSubCategory });
// });
// get all category
const subGetCategory = factoryGetAllDocument(subCategoryModel);
// http://localhost:3000/category/65b406d6da7e4386bbffcf44/subCategory
//  catchAsyncError(async (req, res, next) => {

//   // filter to mergeParams
//   let filter = {};
//   if (req.params.categoryId) {
//     filter = { categoryId: req.params.categoryId };
//   }

//   let subCategory = await subCategoryModel.find( filter ) ;
//   res.status(200).json({ massage: "success",   subCategory  });
// });
// ***********************************
// get one category
const getSubCategoryId = factoryGetOneDocumentId(subCategoryModel);
//  catchAsyncError(async (req, res, next) => {
//   const { id } = req.params;
//   let subCategory = await subCategoryModel.findById(id);
//   if (!subCategory) {
//     // return res.status(400).json({ message: "category not found" });
//     return next(new AppError("subCategory not found", 404));
//   }
//   res.status(200).json({ massage: "success", subCategory });
// });
// delete one category
const deleteSubCategoryId = factoryDelete(subCategoryModel);
// catchAsyncError(async (req, res, next) => {
//   const { id } = req.params;
//   const subCategory = await subCategoryModel.findByIdAndDelete(id);
//   if (!subCategory) {
//     return next(new AppError("subCategory not found", 404));
//   }
//   res.status(200).json({ massage: "deleted" });
// });
// *******************************
// update one category
const updateSubCategory = factoryUpdate(subCategoryModel);
// catchAsyncError(async (req, res, next) => {
//   const { id } = req.params;
//   const { name, image } = req.body;
//   const subCategory = await subCategoryModel.findByIdAndUpdate(
//     id,
//     { name, image, slug: slugify(name) },
//     { new: true }
//   );
//   if (!subCategory) {
//     return next(new AppError("subCategory not found", 404));
//   }
//   res.status(200).json({ massage: "Updated" });
// });
// ***********
export {
  createSubCategory,
  subGetCategory,
  getSubCategoryId,
  deleteSubCategoryId,
  updateSubCategory,
};
