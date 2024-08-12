import mongoose, { Schema, Types, model } from "mongoose";
import bcrypt from 'bcrypt'

const schema = new Schema({
  name: {
    type: String,
    required: [true, "user name is required"],
    trim: true,
    minlength: [2, "the minlength is 2 "],
    maxlength: [20, "the minlength is 20 "],
  },
  email: {
    type: String,
    unique: [true, "email alraady exist"],
    required: [true, "user email is required"],
    trim: true,
  },
  phone: {
    type: String,

  },
  password: {
    type: String,

    trim: true,

  },
  profileImage: {
    default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSLU5_eUUGBfxfxRd4IquPiEwLbt4E_6RYMw&s",
    type: String,
  },
  logoInChangedAt: Date,
  passwordChangedAt: Date,
  logOut: Date,
  role: {
    type: String,
    enum: ["admin", "user", 'delevery'],
    default: "user"
  },
  confirmEmail: {
    type: Boolean,
    default: false
  },
  wishList: [{ type: Types.ObjectId, ref: 'product' }],
  adresses: [
    {
      name: String,
      street: String,
      city: String
    }
  ],

  numberToConfirmEmail: String,
  isActive: {
    type: Boolean,
    default: true
  },

}, { timestamps: true, strictPopulate: false });


//  schema.pre('findOneAndUpdate' , async  function ( ) {
//   console.log(this);
//   if(this._update.password){

//     this._update.password = bcrypt.hashSync(this._update.password, parseInt(process.env.SALTROUND))
//   }
// })
export const UserModel = model("user", schema);
