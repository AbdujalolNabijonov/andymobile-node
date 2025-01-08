const notificationSchema = require("../schema/notificationSchema");

class Notification {
  constructor() {
    this.notifyModel = notificationSchema;
  }

  async getAllNotifications(notifier) {
    try {
      const combined_msgs = await this.notifyModel.aggregate([
        {
          $match: {
            $or: [{ notify_reciever: notifier }, { notify_sender: notifier }],
          },
        },
        {$sort:{createdAt:-1}},
        { $limit: 10 },
      ]);
      return combined_msgs.reverse();
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Notification;
