const { Schema, model } = require("mongoose");

const wishListSchema = new Schema(
  {
    mb_id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    product_id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    product_name: {
      type: String,
      required: true,
    },
    product_image: {
      type: String,
      required: true,
    },
    product_color: {
      type: String,
      required: true,
    },
    product_memory: {
      type: Number,
      required: true,
    },
    product_price: {
      type: Number,
      required: true,
    },
    product_discount: {
      type: Number,
      default: 0,
    },
    product_qnt: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = model("WishlistItem", wishListSchema);
