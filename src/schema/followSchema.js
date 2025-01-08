const { Schema, model } = require("mongoose");

const followSchema = new Schema(
  {
    following_id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    follower_id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

followSchema.index({ follower_id: 1, following_id: 1 }, { unique: 1 });

module.exports = model("Follow", followSchema);
