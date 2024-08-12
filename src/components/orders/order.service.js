import AppError from "../../utils/HandelError/appError/APPERROR.js";
import { catchAsyncError } from "../../utils/HandelError/catchError/catchError.js";
import { CartModel } from "../carts/cart.model.js";
import { productModel } from "../products/product.model.js";
import { UserModel } from "../users/users.model.js";
import { orderSchema } from "./order.model.js";
/************************************function to user******************************************/
// add order from user
const addOrder = catchAsyncError(async (req, res, next) => {
    const findOrder = await orderSchema.findOne({ cartItemOrder: req.body.cartItemOrder })
    if (findOrder) return next(new AppError('The order has been requested', 409))
    req.body.userId = req.user._id
    const order = new orderSchema(req.body)
    await order.save()
    //  if user  add order  (status cart is true to remove order in cart )
    await CartModel.findByIdAndUpdate(req.body.cartItemOrder, { statue: false })
    res.status(200).json(order)
})
// get order to user
const getOrderToUser = catchAsyncError(async (req, res, next) => {
    // find order from user 
    const order = await orderSchema.findOne({ userId: req.user._id, ifUserRemovedOrder: false }).populate('cartItemOrder')
    if (!order) return next(new AppError('order not fount', 409))
    //  find user data to get address
    const user = await UserModel.findOne({ _id: req.user._id })
    let address = user.adresses.find((elm) => elm._id == order.address)
    //  get product order from cart Item
    let product = [];
    order.cartItemOrder.cartItems.forEach((elm) => { product.push(elm.productId) })
    const poriducts = await productModel.find({ _id: product })
    res.status(200).json({ cartItem: order.cartItemOrder, product: poriducts, address: address, })
})
// if user completed order
const completeOrderFromUser = catchAsyncError(async (req, res, next) => {
    const order = await orderSchema.findByIdAndUpdate(req.body.orderId, { completedUser: true, dateCompletedorderfromUser: Date.now() })
    res.status(200).json({ message: 'success' })
})
// if user want remove order
const removeOrderFromUser = catchAsyncError(async (req, res, next) => {
    //  if user removed order before admin get this order method  on way  here this order not remove in database but ifUserRemovedOrder true
    const { statusUser } = await orderSchema.findById(req.body.orderId)
    if (statusUser == 'onWay') return next(new AppError('your order on way Sorry we cant remove this order', 409))
    await orderSchema.findByIdAndUpdate(req.body.orderId, { completedUser: false, ifUserRemovedOrder: true })
    res.status(200).json({ message: 'success' })
})

// update order 
const updateorder = catchAsyncError(async (req, res, next) => {
    //  if user need update order (status cart is false to return order in cart again)
    await CartModel.findByIdAndUpdate(req.body.cartItemOrder, { statue: true })
    res.status(200).json({ message: "success" })
})
/************************************function to admin******************************************/

const getOrderWaitingForApprovalToAdmins = catchAsyncError(async (req, res, next) => {
    // get orders form users 
    const order = await orderSchema.find({ statusUser: "WaitingForApproval" })
    if (!order.length) return next(new AppError('The orders is Embity', 200))
    res.status(200).json({ message: 'success', order })
})
const addorderToAdmin = catchAsyncError(async (req, res, next) => {
    // admin take order to approved it (amdmin choose order and push this order for him)
    const addOrder = await orderSchema.findByIdAndUpdate(req.body.orderId, { adminId: req.user._id, statusUser: "beenApproved" }).populate('adminId')
    if (!addOrder) return next(new AppError('The orders is Embity', 200))
    res.status(200).json({ message: 'success', addOrder })

})
const getOrdersFormOneAdmin = catchAsyncError(async (req, res, next) => {

    const order = await orderSchema.find({ adminId: req.user._id, statusUser: "beenApproved" }).populate('adminId')
    if (!order) return next(new AppError('The orders is Embity', 200))
    res.status(200).json({ message: 'success', order })

})
const getOneOrderToAdmins = catchAsyncError(async (req, res, next) => {
    // info alike getOrderToUser
    const order = await orderSchema.findOne({ adminId: req.user._id, ifUserRemovedOrder: false }).populate('cartItemOrder')
    if (!order) return next(new AppError('order not fount', 409))
    const user = await UserModel.findById({ _id: order.userId })
    let address = user.adresses.find((elm) => elm._id == order.address)
    let product = [];
    order.cartItemOrder.cartItems.forEach((elm) => { product.push(elm.productId) })
    const poriducts = await productModel.find({ _id: product })
    res.status(200).json({ cartItem: order.cartItemOrder, product: poriducts, address: address, user: user })
})
const changeStatusUser = catchAsyncError(async (req, res, next) => {
    // when order was done it this on way 
    const order = await orderSchema.findByIdAndUpdate(req.body.orderId, { statusUser: "onWay", delivery: req.body.delivery })
    res.status(200).json({ message: 'success' })
})
const completeOrderFromDdelivery = catchAsyncError(async (req, res, next) => {
    // if delivery send product to user and take admin
    const order = await orderSchema.findByIdAndUpdate({ _id: req.body.orderId }, { completedDeliveryForAdmin: true }).populate('deliveryId')
    handler(!order, res, order, next)

})
const getOrderNotCompletedFromDelivry = catchAsyncError(async (req, res, next) => {
    const order = await orderSchema.find({ adminId: req.user._id, completedDeliveryForAdmin: false }).populate('deliveryId')
    handler(!order.length, res, order, next)

})
const getOrderCompletedFromDelivry = catchAsyncError(async (req, res, next) => {
    const order = await orderSchema.find({ adminId: req.user._id, completedDeliveryForAdmin: true }).populate('deliveryId')
    handler(!order.length, res, order, next)
})
export {
    addOrder,
    getOrderToUser,
    getOrdersFormOneAdmin,
    removeOrderFromUser,
    completeOrderFromUser,
    updateorder,
    /* admin*/
    changeStatusUser,
    getOrderWaitingForApprovalToAdmins,
    addorderToAdmin,
    getOneOrderToAdmins,
    getOrderNotCompletedFromDelivry,
    getOrderCompletedFromDelivry,
    completeOrderFromDdelivery

}
function handler(condetionIf, res, order, next) {
    if (condetionIf) return next(new AppError('The orders is Embity', 200))
    res.status(200).json({ message: 'success', order })
}

