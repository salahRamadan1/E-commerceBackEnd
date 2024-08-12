import AppError from "../../utils/HandelError/appError/APPERROR.js";
import { catchAsyncError } from "../../utils/HandelError/catchError/catchError.js";
import { productModel } from "../products/product.model.js";

import { reviewModel } from './review.model.js'

const createReview = catchAsyncError(async (req, res, next) => {
    const isReview = await reviewModel.findOne({ user: req.user.id, product: req.body.product })
    if (isReview) return next(new AppError('You already wrote a review', 409))

    req.body.user = req.user.id
    const review = new reviewModel(req.body)
    await review.save()
    res.status(200).json({ message: "success" })
})
const deleteReview = catchAsyncError(async (req, res, next) => {
    const isReview = await reviewModel.findById(req.body.id)
    console.log(isReview.user.toString());
    console.log(req.user.id);
    if (isReview.user.toString() == req.user.id.toString() || req.user.role == 'admin') {
        await reviewModel.findByIdAndDelete({ _id: req.body.id })
        res.status(200).json({ message: "success" })

    } return next(new AppError('you not are oner this review'))

})
const updateReview = catchAsyncError(async (req, res, next) => {
    const isReview = await reviewModel.findById(req.body.id)
    console.log(isReview.user.toString());
    console.log(req.user.id);
    if (isReview.user.toString() != req.user.id) return next(new AppError('you not are owner this review'))
    const review = await reviewModel.findByIdAndUpdate({ _id: req.body.id }, req.body, { new: true })
    res.status(200).json({ message: "success", review })

})
const getRview = catchAsyncError(async (req, res, next) => {
    const { id } = req.params
    const review = await reviewModel.find({ product: req.params.id })
    if (!review) return next(new AppError('reviews not found'))
    res.status(200).json({ message: "success", review })

})
const getOneRview = catchAsyncError(async (req, res, next) => {
    const { id } = req.params
    const review = await reviewModel.findById(id)
    res.status(200).json({ message: "success", review })

})



export { createReview, deleteReview, updateReview, getRview, getOneRview }