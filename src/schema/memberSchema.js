const mongoose = require("mongoose");
const { status_enums, mb_type_enums, mb_top_enums } = require("../libs/enums");

const memberSchema = new mongoose.Schema(
  {
    mb_nick: {
      type: String,
      unique: true,
      required: true,
    },
    mb_phone: {
      type: Number,
      unique: true,
      required: true,
    },
    mb_password: {
      type: String,
      required: true,
    },
    mb_status: {
      type: String,
      default: "ACTIVE",
      enum: {
        values: status_enums,
        message: "{VALUE} is not among permitted list",
      },
    },
    mb_type: {
      type: String,
      default: "USER",
      enum: {
        values: mb_type_enums,
        message: "{{VALUE} is not among permitted list}",
      },
    },
    mb_top: {
      type: String,
      default: "N",
      enum: {
        values: mb_top_enums,
        message: "{VALUE} is not among permitted list",
      },
    },
    mb_image: {
      type: String,
      default: "",
    },
    mb_address: {
      type: String,
      default: "",
    },
    mb_email: {
      type: String,
      default: "",
    },
    mb_likes: {
      type: Number,
      default: 0,
    },
    mb_views: {
      type: Number,
      default: 0,
    },
    mb_comments: {
      type: Number,
      default: 0,
    },
    mb_followers: {
      type: Number,
      default: 0,
    },
    mb_followings: {
      type: Number,
      default: 0,
    },
    mb_description: {
      type: String,
      default: "Not have description",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Member", memberSchema);
