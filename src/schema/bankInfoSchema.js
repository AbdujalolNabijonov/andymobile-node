const { Schema, model } = require("mongoose");

const bankSchema = new Schema(
  {
    mb_id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    card_status: {
      type: String,
      default: "ACTIVE",
      enum: {
        values: ["ACTIVE", "DELETED"],
        message: "{VALUE} is not among permitted values",
      },
    },
    card_owner_name: {
      type: String,
      required: true,
    },
    card_number: {
      type: Number,
      required: true,
      unique: true,
      validate: {
        validator: function (value) {
          return value.toString().length === 16;
        },
        message: "Card Number must be a number with a length of 4",
      },
    },
    card_expiry: {
      type: String,
      validate: {
        validator: function (value) {
          return value.length === 5;
        },
        message: "Card Expiry must be a number with a length of 4",
      },
    },
    card_cvc: {
      type: Number,
      validate: {
        validator: function (value) {
          return value.toString().length === 3;
        },
        message: "Card CVC must be a number with a length of 4",
      },
    },
    card_pincode: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("BankCard", bankSchema);
