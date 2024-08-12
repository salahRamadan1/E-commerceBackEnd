import { categoryModel } from "./category.model.js";
import {
  factoryAddDocument,
  factoryDelete,
  factoryGetAllDocument,
  factoryGetOneDocumentId,
  factoryUpdate,
} from "../../utils/HandlerFactoryEndPoint/handler.factory.js";
// new category
const createCategory = factoryAddDocument(categoryModel);
// get all category
const getCategory = factoryGetAllDocument(categoryModel);
// ***********************************
// get one category
const getCategoryId = factoryGetOneDocumentId(categoryModel);
// delete one category
const deleteCategoryId = factoryDelete(categoryModel, "category/");
// *******************************
// update one category
const updateCAtegory = factoryUpdate(categoryModel, "category/");
// ***********
export {
  createCategory,
  getCategory,
  getCategoryId,
  deleteCategoryId,
  updateCAtegory,
  
};
