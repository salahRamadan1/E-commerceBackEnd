import AppError from '../../utils/HandelError/appError/APPERROR.js'
import { catchAsyncError } from '../../utils/HandelError/catchError/catchError.js'
import { couponModel } from '../coupon/coupon.model.js'
import { productModel } from '../products/product.model.js'
import { UserModel } from '../users/users.model.js'
import { CartModel } from './cart.model.js'
const addCart = catchAsyncError(async (req, res, next) => {
    // 1. Remove product from wishlist (if it exists)
    await UserModel.findByIdAndUpdate(req.user._id,
        { $pull: { wishList: req.body.productId } }
        , { new: true })
    // 2. Find the user's cart
    let cart = await CartModel.findOne({ userId: req.user._id })
    // 3. Get product price after discount
    const { priceAfterDiscount } = await productModel.findById(req.body.productId)
    req.body.price = priceAfterDiscount;
    // 4. Create a new cart if it doesn't exist
    if (!cart) {
        let newCart = new CartModel({ cartItems: [req.body], userId: req.user._id })
        calCulat(newCart)// Assuming calculateCart handles price and discount calculations
        await newCart.save()
        res.status(200).json({ message: "success", newCart })
    } else {
        // 5. Check if product already exists in the cart
        const pro = cart.cartItems.find((elm) => elm.productId == req.body.productId)
        // 6. Update quantity if product exists
        if (pro) {
            pro.qountity += 1
            calCulat(cart)
            cart.discount > 1 ? calcCoupon(cart, cart.discount) : ""
        } else {
            // 7. Add new product to the cart
            cart.cartItems.push(req.body)
            calCulat(cart)
            // 8. Apply discount if applicable (assuming calcCoupon is for discounts)
            cart.discount > 1 ? calcCoupon(cart, cart.discount) : ""
        }

        calCulat(cart)
        // 9. Save the updated cart
        await cart.save()
        // 10. Send success response with the updated cart
        res.status(200).json({ message: "success", cart })
    }
})
const removeCart = catchAsyncError(async (req, res, next) => {
    // 1. Find and update the user's cart, removing the specified product
    const cart = await CartModel.findOneAndUpdate({ userId: req.user._id },
        { $pull: { cartItems: { productId: req.body.productId } } }
        , { new: true })
    // 2. Recalculate cart totals (assuming calculateCart handles this)

    calCulat(cart)
    calcCoupon(cart, cart.discount)
    // 3. Save the updated cart
    await cart.save()
    res.status(200).json({ message: "success", cart })
})

const updateCartPlus = catchAsyncError(async (req, res, next) => {
    // 1. Find the user's cart
    var cart = await CartModel.findOne({ userId: req.user._id })
    // 2. Find the product in the cart
    var pro = cart.cartItems.find((elm) => elm.productId == req.body.productId)
    // 3. Check if the product exists in the cart
    if (pro) {
        // 4. Update product quantity based on request (plus or minus)

        if (req.body.plus) {
            pro.qountity += 1
            calCulat(cart)
            // 5. Apply discount if applicable (assuming calcCoupon is for discounts)

            cart.discount > 1 ? calcCoupon(cart, cart.discount) : ""

        } else if (req.body.minus) {
            pro.qountity -= 1
            calCulat(cart)
            // 6. Apply discount if applicable (assuming calcCoupon is for discounts)

            cart.discount > 1 ? calcCoupon(cart, cart.discount) : ""
            pro.qountity <= 0 ? pro.qountity = 1 : ""
        }

    }
    await cart.save()
    res.status(200).json({ message: "success", cart })


})

const getcartItem = catchAsyncError(async (req, res, next) => {
    // 1. Find the user's cart (assuming "statue" should be "status")
    let cart = await CartModel.findOne({ userId: req.user._id, statue: true }).populate('cartItems.productId')
    // 2. Check if the cart was found
    if (!cart) return next(new AppError('you cart is Empity'))
    // 3. Recalculate cart totals (assuming calculateCart handles this)

    calCulat(cart)
    // 4. Apply discount if applicable (assuming calcCoupon is for discounts)
    if (cart.discount !== 0) {
        calcCoupon(cart, cart.discount)
    }

    res.status(200).json({ message: "success", cart })

})
const applyCouponToCart = catchAsyncError(async (req, res, next) => {
    // 1. Find the user's cart and populate product data
    let cart = await CartModel.findOne({ userId: req.user._id }).populate('cartItems.productId')
    // 2. Find the requested coupon and check for validity
    const coupon = await couponModel.findOne({
        name: req.body.name,
        expires: { $gte: Date.now() }// Find active coupons only
    })

    // 3. Handle invalid coupon scenario
    if (!coupon) return next(new AppError('coupon expired or not found'))
    // 4. Apply the coupon discount to the cart (assuming calcCoupon handles this)
    calcCoupon(cart, coupon.discount)// Pass discount value directly
    // 5. Update cart properties with coupon details
    cart.discount = coupon.discount
    cart.usedCoupon = true
    // 6. Save the updated cart
    await cart.save()
    res.status(200).json({ message: "success", cart })

})
export { addCart, removeCart, updateCartPlus, getcartItem, applyCouponToCart }

function calCulat(cart) {
    // Initialize a variable to store the total price
    let globalTotalprice = 0
    // Iterate over each item in the cart
    cart.cartItems.forEach((elm) => { globalTotalprice += elm.qountity * elm.price })
    // Set the cart's total price property
    cart.totalPrice = globalTotalprice
}
function calcCoupon(cart, discount) {
    // Calculate the total price after discount
    cart.totalPriceAfterDiscount = (cart.totalPrice - (cart.totalPrice * discount) / 100).toFixed(2)

}