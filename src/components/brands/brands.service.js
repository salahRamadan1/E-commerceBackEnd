
import {
  factoryAddDocument,
  factoryDelete,
  factoryGetAllDocument,
  factoryGetOneDocumentId,
  factoryUpdate,
} from "../../utils/HandlerFactoryEndPoint/handler.factory.js";
import { BrandModel } from "./brands.model.js";
// new category
const createBrand = factoryAddDocument(BrandModel);

const getBrand = factoryGetAllDocument(BrandModel);

const getBrandId = factoryGetOneDocumentId(BrandModel);


const deleteBrandId = factoryDelete(BrandModel , 'brand/');

const updateBrand = factoryUpdate(BrandModel,'brand/');

export {
  createBrand,
  getBrand,
  getBrandId,
  deleteBrandId,
  updateBrand,
};
