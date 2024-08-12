import { Schema, Types, model } from "mongoose";
const schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "review is required"],
      trim: true,

      minlength: [2, "the minlength is 2 "],
      maxlength: [500, "the minlength is 500 "],
    },
    user: {
      type: Types.ObjectId,
      ref: "user",
    },
    product: {
      type: Types.ObjectId,
      ref: "product",
    },
    ratingAverage: {
      type: Number,
      min: [1, "ratingAverage must be greater than 1"],
      max: [5, "ratingAverage must be less than 5"],
    },
  },
  { timestamps: true }
);

schema.pre(/^find/, function () {
  this.populate('user', 'name profileImage')

})
export const reviewModel = model("review", schema);
