import { catchAsyncError } from "../../utils/HandelError/catchError/catchError.js";
import { factoryAddDocument, factoryDelete, factoryGetAllDocument, factoryGetOneDocumentId, factoryUpdate } from "../../utils/HandlerFactoryEndPoint/handler.factory.js";
import { couponModel } from "./coupon.model.js";


const createCoupon = factoryAddDocument(couponModel);

const getCoupon = factoryGetAllDocument(couponModel);
// ***********************************
// get one coupon
const getCouponId = factoryGetOneDocumentId(couponModel);
// delete one coupon
const deleteCouponId = factoryDelete(couponModel, "coupon/");
// *******************************
// update one coupon
const updateCoupon = factoryUpdate(couponModel, "coupon/");

export { createCoupon, getCouponId, getCoupon, deleteCouponId, updateCoupon }