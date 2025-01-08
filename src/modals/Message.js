const messageSchema = require("../schema/messageSchema");

class Message {
  constructor() {
    this.messageModel = messageSchema;
  }

  async getAllMessagesData() {
    try {
      const result = await this.messageModel.aggregate([
        { $sort: { createdAt: -1 } },
        { $limit: 10 },
      ]);
      return result;
    } catch (err) {
      throw err;
    }
  }
}
module.exports = Message;
