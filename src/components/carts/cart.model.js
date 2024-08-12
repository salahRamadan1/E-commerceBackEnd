import { Schema, Types, model } from "mongoose";
const cartSchema = new Schema(
    {
        cartItems: [
            {
                productId: { type: Types.ObjectId, ref: 'product' },
                qountity: { type: Number, default: 1 },
                price: Number
            }
        ],
        userId: { type: Types.ObjectId, ref: 'user' },
        totalPrice: { type: Number, default: 0 },
        totalPriceAfterDiscount: { type: Number, default: 0 },
        discount: { type: Number, default: 0 },
        statue: {
            type: Boolean,
            default: true
        },
        usedCoupon: {
            type: Boolean,
            default: false
        }

    },
    { timestamps: true, strictPopulate: false }
);

export const CartModel = model("cart", cartSchema);


