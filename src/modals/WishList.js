const { shapeMongooseObjectId } = require("../libs/convert");
const wishListSchema = require("../schema/wishListSchema");

class WishList {
  constructor() {
    this.wishListModel = wishListSchema;
  }
  async getAllWishListItems(member) {
    try {
      const mb_id = shapeMongooseObjectId(member._id);
      const result = await this.wishListModel.find({ mb_id: mb_id }).exec();
      return result;
    } catch (err) {
      throw err;
    }
  }

  async createWishListItemData(member, data) {
    try {
      const mb_id = shapeMongooseObjectId(member._id);
      data.product_id = shapeMongooseObjectId(data.product_id);
      const newWishItem = new this.wishListModel({
        mb_id: mb_id,
        product_id: data.product_id,
        product_name: data.product_name,
        product_image: data.product_image,
        product_price: data.product_price,
        product_discount: data.product_discount,
        product_qnt: data.product_qnt,
        product_memory: data.product_memory,
        product_color:data.product_color
      });
      const result = await newWishItem.save();
      return result;
    } catch (err) {
      throw err;
    }
  }
  async editWishListItem(member, data) {
    try {
      const mb_id = shapeMongooseObjectId(member._id);
      const product_id = shapeMongooseObjectId(data.product_id);
      const result = await this.wishListModel
        .findOneAndUpdate(
          { mb_id: mb_id, product_id },
          { $inc: { product_qnt: data.modifier } },
          { returnDocument: "after" }
        )
        .exec();
      return result;
    } catch (err) {
      throw err;
    }
  }
  async removeWishListItemData(member, data) {
    try {
      const mb_id = shapeMongooseObjectId(member._id);
      const product_id = shapeMongooseObjectId(data.product_id);
      const result = await this.wishListModel
        .findOneAndDelete(
          { mb_id: mb_id, product_id: product_id },
          { returnDocument: "after" }
        )
        .exec();
      return result;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = WishList;
