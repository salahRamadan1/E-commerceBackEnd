import { Schema, model } from "mongoose";
const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "category name is required"],
      trim: true,
      unique: [true, "category is unique"],
      minlength: [2, "the minlength is 2 "],
      maxlength: [16, "the minlength is 50"],
    },
    
    slug: {
      type:  String,
      lowercase: true,
    },
    image: {
        type: String,
        required: [true, "category image is required"],
    },
  },
  { timestamps: true }
);
 
export const categoryModel = model("category", categorySchema);


