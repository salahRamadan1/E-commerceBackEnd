import { Schema, model } from "mongoose";
const schema =new Schema({
  name: {
    type: String,
    required: [true, "brand is required"],
    trim: true,
    unique: [true, "brand is unique"],
    minlength: [2, "the minlength is 2 "],
    maxlength: [50, "the minlength is 50 "],
  },
 
  image: {
    type: String,
    required: [true, "brand image is required"],
  },
}, {timestamps:true});

 
export const BrandModel = model('brand' ,schema )
