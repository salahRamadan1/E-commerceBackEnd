import { Schema, Types, model } from "mongoose";
const subCategorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "subCategory is required"],
      trim: true,
      unique: [true, "subCategory is unique"],
      minlength: [2, "the minlength is 2 "],
      maxlength: [50, "the minlength is 50 "],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    categoryId: {
      type: Types.ObjectId,
      required: [true, "subCategory is required"],
      red: "category",
    },
  }, { timestamps: true });

export const subCategoryModel = model('subCategory', subCategorySchema)
