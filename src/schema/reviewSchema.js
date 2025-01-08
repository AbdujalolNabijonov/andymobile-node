const { Schema, model } = require("mongoose");

const reviewSchema = new Schema(
  {
    mb_id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    review_target_id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    review_stars: {
      type: Number,
      default: 0,
    },
    review_context: {
      type: String,
      required: true,
    },
    review_group:{
      type:String,
      required:true,
    },
    review_likes: {
      type: Number,
      default: 0,
    },
    review_dislikes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps:true }
);

module.exports = model("Review", reviewSchema);
