const { Schema, model } = require("mongoose");

const viewSchema = new Schema(
  {
    mb_id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    view_item_id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    view_group: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("View", viewSchema);
