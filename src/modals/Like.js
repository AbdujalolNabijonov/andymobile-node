const { shapeMongooseObjectId } = require("../libs/convert");
const LikeSchema = require("../schema/likeSchema");
const MemberSchema = require("../schema/memberSchema");
const ProductSchema = require("../schema/productSchema");
const CommunitySchema = require("../schema/communityShema");
const ReviewSchema = require("../schema/reviewSchema");
const { Definer } = require("../libs/Definer");
const assert = require("assert");
const wishListSchema = require("../schema/wishListSchema");

class Like {
  constructor() {
    this.likeModel = LikeSchema;
    this.memberModel = MemberSchema;
    this.productModel = ProductSchema;
    this.communityModel = CommunitySchema;
    this.reviewModel = ReviewSchema;
    this.wishListModel = wishListSchema
  }

  async likeChosenItemData(member, data) {
    try {
      const mb_id = shapeMongooseObjectId(member._id);
      const like_item_id = shapeMongooseObjectId(data.like_item_id);
      const like_group = data.like_group;
      //Validate exsist Item
      const validateItem = await this.validateLikedItem(
        like_item_id,
        like_group
      );
      assert.ok(validateItem, Definer.smth_err1);
      //Does exsist in likes
      const doesExist = await this.exsistLikedItem(like_item_id, like_group);
      //Update likes count
      let result;
      console.log(doesExist)
      if (doesExist) {
        await this.removeLikeChosenItem(mb_id, like_group, like_item_id);
        result = await this.modifyLikeCount(like_item_id, like_group, -1);
      } else {
        await this.addLikeChosenItem(mb_id, like_group, like_item_id);
        result = await this.modifyLikeCount(like_item_id, like_group, 1);
      }
      return result;
    } catch (err) {
      throw err;
    }
  }

  async validateLikedItem(like_item_id, like_group) {
    try {
      let result;
      switch (like_group.toLowerCase()) {
        case "member":
          result = await this.memberModel
            .find({ _id: like_item_id, mb_status: "ACTIVE" })
            .exec();
          break;
        case "product":
          result = await this.productModel
            .find({ _id: like_item_id, product_status: "PROCESS" })
            .exec();
          break;
        case "community":
          result = await this.communityModel
            .find({ _id: like_item_id, blog_status: "ACTIVE" })
            .exec();
          break;
        case "review":
          result = await this.reviewModel.find({ _id: like_item_id }).exec();
          break;
        default:
          break;
      }
      return result;
    } catch (err) {
      throw err;
    }
  }

  async exsistLikedItem(like_item_id, like_group) {
    try {
      const result = await this.likeModel
        .find({
          like_item_id: like_item_id,
          like_group: like_group,
        })
        .exec();
      return !!result[0];
    } catch (err) {
      throw err;
    }
  }

  async modifyLikeCount(like_item_id, like_group, modifier) {
    try {
      let result;
      switch (like_group.toLowerCase()) {
        case "member":
          await this.memberModel
            .findOneAndUpdate(
              { _id: like_item_id, mb_status: "ACTIVE" },
              { $inc: { mb_likes: modifier } },
              { returnDocument: "after" }
            )
            .exec();
          result = await this.likeModel.find(
            { like_item_id: like_item_id },
            { __v: 0, _id: 0 }
          );
          break;
        case "product":
          await this.productModel
            .findOneAndUpdate(
              { _id: like_item_id, product_status: "PROCESS" },
              { $inc: { product_likes: modifier } },
              { returnDocument: "after" }
            )
            .exec();
          result = await this.likeModel.find(
            { like_item_id: like_item_id },
            { __v: 0, _id: 0 }
          );
          break;
        case "community":
          await this.communityModel
            .findOneAndUpdate(
              { _id: like_item_id, blog_status: "ACTIVE" },
              { $inc: { blog_likes: modifier } },
              { returnDocument: "after" }
            )
            .exec();
          result = await this.likeModel.find(
            { like_item_id: like_item_id },
            { __v: 0, _id: 0 }
          );
          break;
        case "review":
          await this.reviewModel
            .findOneAndUpdate(
              { _id: like_item_id },
              { $inc: { review_likes: modifier } },
              { returnDocument: "after" }
            )
            .exec();
          result = await this.likeModel.find(
            { like_item_id: like_item_id },
            { __v: 0, _id: 0 }
          );
          break;
        default:
          break;
      }
      return result;
    } catch (err) {
      throw err;
    }
  }

  async addLikeChosenItem(mb_id, like_group, like_item_id) {
    try {
      const likedItem = new this.likeModel({
        mb_id: mb_id,
        like_item_id: like_item_id,
        like_group: like_group,
      });
      const result = await likedItem.save();
      return result;
    } catch (err) {
      throw err;
    }
  }

  async removeLikeChosenItem(mb_id, like_group, like_item_id) {
    try {
      await this.likeModel
        .findOneAndDelete({
          mb_id: mb_id,
          like_item_id: like_item_id,
        })
        .exec();
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Like;
