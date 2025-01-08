const { shapeMongooseObjectId } = require("../libs/convert");
const communityShema = require("../schema/communityShema");
const memberSchema = require("../schema/memberSchema");
const productSchema = require("../schema/productSchema");
const viewSchema = require("../schema/viewSchema");

class View {
  constructor() {
    this.viewModel = viewSchema;
    this.productModel = productSchema;
    this.communityModel = communityShema;
    this.memberModel = memberSchema;
  }

  async viewedItemData(member, data) {
    try {
      const item_id = shapeMongooseObjectId(data.view_item_id);
      const mb_id = shapeMongooseObjectId(member?._id);
      const view_group = data.item_group;
      const doesExist = await this.doesExistViewedItem(
        item_id,
        mb_id,
        view_group
      );
      let result = [];
      if (!doesExist) {
        result = await this.addViewItem(mb_id, item_id, view_group);
        await this.modifyViewItem(item_id, view_group);
      }
      return result;
    } catch (err) {
      throw err;
    }
  }

  async doesExistViewedItem(item_id, mb_id, item_group) {
    try {
      const result = await this.viewModel
        .findOne({
          mb_id: mb_id,
          view_item_id: item_id,
          view_group: item_group,
        })
        .exec();
      return !!result;
    } catch (err) {
      throw err;
    }
  }

  async addViewItem(mb_id, item_id, item_group) {
    try {
      const newView = new this.viewModel({
        mb_id: mb_id,
        view_item_id: item_id,
        view_group: item_group,
      });
      const result = await newView.save();
      return result;
    } catch (err) {
      throw err;
    }
  }

  async modifyViewItem(view_item, view_group) {
    try {
      let result = [];
      switch (view_group) {
        case "MEMBER":
          result = await this.memberModel
            .findOneAndUpdate(
              { _id: view_item, mb_status: "ACTIVE" },
              { $inc: { mb_views: 1 } },
              { returnDocument: "after" }
            )
            .exec();
          break;
        case "PRODUCT":
          result = await this.productModel
            .findOneAndUpdate(
              { _id: view_item, product_status: "PROCESS" },
              { $inc: { product_views: 1 } },
              { returnDocument: "after" }
            )
            .exec();
          break;
        case "COMMUNITY":
          result = await this.communityModel
            .findOneAndUpdate(
              { _id: view_item, blog_status: "ACTIVE" },
              { $inc: { blog_views: 1 } },
              { returnDocument: "after" }
            )
            .exec();
          break;
        default:
          break;
      }
      return result;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = View;
