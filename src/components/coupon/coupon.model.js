import { Schema, Types, model } from "mongoose";
const schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "coupon is required"],
      trim: true,
      unique: [true, "coupon code unique "],
    },
    expires: {
      type: Date,
    },
    discount: {
      type: Number,
    },
    image: String,
    title: {
      type: String,
      required: [true, "coupon is required"],
       
      unique: [true, "coupon code unique "],
    },
  },
  { timestamps: true }
);

export const couponModel = model("coupon", schema);
