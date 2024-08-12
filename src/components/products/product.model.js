import { Schema, Types, model } from "mongoose";
const schemaProduct = new Schema({
  name: {
    type: String,
    required: [true, "product is required"],
    trim: true,
    unique: [true, "product is unique"],
    minlength: [2, "the minlength is 2 "],
    maxlength: [50, "the minlength is 50 "],
  },

  slug: {
    type: String,
    lowercase: true,
  },
  description: {
    type: String,
    required: [true, "product description is required"],
    trim: true,
    minlength: [10, "the minlength is 10 "],
    maxlength: [5000, "the minlength is 500 "],
  },
  quantity: {
    type: Number,
    required: [true, "product quantity is required"],
    default: 1,
  },

  image: String,
  images: [String],

  price: {
    type: Number,
    required: [true, "product price is required"],
  },
  discount: Number,
  priceAfterDiscount: {
    type: Number,
  },

  sold: {
    type: Number,

    default: 0,
  },
  categoryId: {
    type: Types.ObjectId,
    ref: "category",
    // required: [true, "category sold is required"],
  },
  subCategoryId: {
    type: Types.ObjectId,
    ref: "subCategory",
    // required: [true, "subCategoryId sold is required"],
  },
  brandId: {
    type: Types.ObjectId,
    ref: "brand",
    // required: [true, "subCategoryId sold is required"],
  },
  ratingAverage: {
    type: Number,
    min: [1, "ratingAverage must be greater than 1"],
    max: [5, "ratingAverage must be less than 5"],
    default: 1
  },
  rateCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },

}





);




export const productModel = model("product", schemaProduct);
