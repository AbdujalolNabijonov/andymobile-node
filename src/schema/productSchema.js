const mongoose = require("mongoose");
const {
  product_status_enums,
  notify_enums,
  product_market_enums,
} = require("../libs/enums");

const productSchema = new mongoose.Schema(
  {
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"Member",
      required: true,
    },
    product_name: {
      type: String,
      required: true,
    },
    product_images: {
      type: Array,
      default: [],
    },
    product_color: {
      type: String,
      required: true,
    },
    product_display: {
      type: String,
      required: true,
    },
    product_core: {
      type: String,
      required: true,
    },
    product_memory: {
      type: Number,
      required: true,
    },
    product_ram: {
      type: Number,
      required: true,
    },
    product_camera: {
      type: String,
      required: true,
    },
    product_price: {
      type: Number,
      required: true,
    },
    product_water_proof: {
      type: String,
      default: "N",
      enum: {
        values: ["Y", "N"],
        message: "{VALUE} is not among permitted list",
      },
    },
    product_status: {
      type: String,
      default: "PROCESS",
      enum: {
        values: product_status_enums,
        message: "{VALUE} is not among permitted list",
      },
    },
    product_new_released: {
      type: String,
      default: "N",
      enum: {
        values: notify_enums,
        message: "{VALUE} is not among permitted list",
      },
    },
    product_discount: {
      type: Number,
      default: 0,
    },
    product_contract: {
      type: Number,
    },
    product_likes: {
      type: Number,
      default: 0,
    },
    product_views: {
      type: Number,
      default: 0,
    },
    product_comments: {
      type: Number,
      default: 0,
    },
    product_description: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

productSchema.index(
  {
    company_id: 1,
    product_name: 1,
    product_color: 1,
  },
  { unique: true }
);

module.exports = mongoose.model("Product", productSchema);
