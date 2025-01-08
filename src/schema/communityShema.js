const { Schema, model } = require("mongoose");
const { blog_category_enums, blog_status_enums } = require("../libs/enums");

const communitySchema = new Schema(
  {
    mb_id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    blog_title: {
      type: String,
      required: true,
    },
    blog_category: {
      type: String,
      required: true,
      enum: {
        values: blog_category_enums,
        message: "{VALUE} is not among permitted enum list",
      },
    },
    blog_context: {
      type: String,
      required: true,
    },
    blog_images: {
      type: Array,
      default: [],
    },
    blog_likes: {
      type: Number,
      default: 0,
    },
    blog_views: {
      type: Number,
      default: 0,
    },
    blog_comments: {
      type: Number,
      default: 0,
    },
    blog_status: {
      type: String,
      default: "ACTIVE",
      enum: {
        values: blog_status_enums,
        message: "{VALUE} is not among permitted enum list",
      },
    },
  },
  { timestamps: true }
);

module.exports = model("Community", communitySchema);
