const { Schema, model } = require("mongoose");
const { notify_enums } = require("../libs/enums");

const notifySchema = new Schema(
  {
    notify_sender: {
      type: String,
      required: true,
    },
    notify_sender_image:{
      type:String
    },
    notify_reciever: {
      type: String || Array,
      required: true,
    },
    notify_context: {
      type:Object,
      required: true,
    },
    notify_reply:{
      type:String,
      default:"N",
      enum:{
        values:notify_enums,
        message:"{VALUE} is not permitted list!"
      }
    }
  },
  { timestamps: true }
);

module.exports = model("Notification", notifySchema);
