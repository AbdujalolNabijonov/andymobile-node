const { Schema, model } = require("mongoose");

const messageSchema = new Schema({
  msg_sender: { type: String, required: true },
  mb_img: { type: String, required: true },
  mb_id: { type: Schema.Types.ObjectId, required: true },
  msg_text: { type: String, required: true },
}, {timestamps:true});

module.exports = model("Message", messageSchema);
