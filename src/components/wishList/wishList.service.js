import { catchAsyncError } from "../../utils/HandelError/catchError/catchError.js";
import { CartModel } from "../carts/cart.model.js";
import { UserModel } from "../users/users.model.js";

const addWishList = catchAsyncError(async (req, res, next) => {
    // Find the cart item with the given product ID and remove it from the cart
    const cartItem = await CartModel.findOneAndUpdate({ userId: req.user._id },// Find the cart belonging to the current user
        { $pull: { cartItems: { productId: req.body.productId } } }// Remove the product from the cart
    )
    // Add the product ID to the user's wishlist
    const { wishList } = await UserModel.findByIdAndUpdate(req.user._id,// Find the user
        { $addToSet: { wishList: req.body.productId } }// Add the product ID to the wishlist
        , { new: true })// Return the updated user document
    res.status(200).json({ message: "success", cartItem })
})

const removeWishList = catchAsyncError(async (req, res, next) => {
    // Find the user and remove the specified product from their wishlist

    await UserModel.findByIdAndUpdate(req.user._id,// Find the user by their ID
        { $pull: { wishList: req.body.productId } }// Remove the product from the wishlist
        , { new: true })// Return the updated user document
    // Send a success response

    res.status(200).json({ message: "success" })
})


const getUserWishList = catchAsyncError(async (req, res, next) => {
    // Find the user by their ID and populate the wishlist field with product data

    const { wishList } = await UserModel.findById(req.user._id).populate('wishList')
    // Send a success response with the wishlist

    res.status(200).json({ message: "success", wishList })
})
export { addWishList, removeWishList, getUserWishList }