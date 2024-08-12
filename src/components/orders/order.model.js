import { Schema, Types, model, } from "mongoose";

const OrderSchema = new Schema({
    adminId: { type: Types.ObjectId, ref: 'user' },
    cartItemOrder: { type: Types.ObjectId, ref: 'cart' },
    address: {
        city: String,
        state: String,
        country: String,
        latitude: Number,
        longitude: Number,
    },
    paymentmethod: {
        type: String,
    },
    transaction_id: {
        type: String,
        required: true
    },
    ifUserRemovedOrder: {
        type: Boolean,
        default: false
    },
    statusUser: {
        type: String,
        //    تم الاستلام   في الطريق   تمت الموافقه  في انتظار الموافققه  
        enum: ["WaitingForApproval", "beenApproved", 'onWay', 'received'],
        default: "WaitingForApproval"
    },
    deliveryId: {
        type: Types.ObjectId, ref: 'user'
    },
    completedUser: {
        type: Boolean,
        default: false
    },
    completedDeliveryUser: {
        type: Boolean,
        default: false
    },
    completedDeliveryForAdmin: {
        type: Boolean,
        default: false
    },

    dateCompletedorderfromUser: {
        type: Date
    },
    userId: {
        type: Types.ObjectId, ref: 'user'
    },
    payment: {
        type: String,
        enum: ["cash", "visa"],
        require: [true, 'choose payment method']

    }

}, { strictPopulate: false })

export const orderSchema = model('order', OrderSchema)