const { Schema, model } = require("mongoose");
const { order_status_enums } = require("../libs/enums");

const OrderSchema = new Schema(
  {
    mb_id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    order_code: {
      type: String,
      required: true,
    },
    order_total_amount: {
      type: Number,
      required: true,
    },
    order_status: {
      type: String,
      default: "PAUSED",
      enum: {
        values: order_status_enums,
        message: "{VALUE} is not among permitted values",
      },
    },
    order_shipping_time: {
      type: Date,
      default:new Date()
    },
    order_shipped_time: {
      type: Date,
      default:new Date()
    },
    order_delivered_time: {
      type: Date,
      default:new Date()
    },
    order_delivery_cost: {
      type: Number,
    },
    order_subtotal_amount: {
      type: Number,
    },
    order_product_qty: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("Order", OrderSchema);
