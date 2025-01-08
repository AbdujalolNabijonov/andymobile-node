const assert = require("assert");
const { shapeMongooseObjectId } = require("../libs/convert");
const CommunitySchema = require("../schema/communityShema");
const ReviewSchema = require("../schema/reviewSchema");
const { Definer } = require("../libs/Definer");
const { lookup_auth_member_liked } = require("../libs/enums");
const productSchema = require("../schema/productSchema");
const memberSchema = require("../schema/memberSchema");

class Community {
  constructor() {
    this.communityModel = CommunitySchema;
    this.reviewModel = ReviewSchema;
    this.productModel = productSchema;
    this.memberModel = memberSchema;
  }

  async createPostData(member, data) {
    try {
      const mb_id = shapeMongooseObjectId(member._id);
      const blog = new this.communityModel({
        mb_id: mb_id,
        blog_category: data.blog_category,
        blog_title: data.blog_title,
        blog_context: data.blog_context,
        blog_images: data.blog_images,
      });
      assert(blog, Definer.smth_err1);
      const result = await blog.save();
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getChosenBlogData(id) {
    try {
      const blog_id = shapeMongooseObjectId(id);
      const result = await this.communityModel
        .findById({ _id: blog_id })
        .exec();
      return result;
    } catch (err) {
      throw err;
    }
  }
  async removeBlogData(member, id) {
    try {
      const blog_id = shapeMongooseObjectId(id);
      const mb_id = shapeMongooseObjectId(member._id);
      const result = await this.communityModel
        .findOneAndDelete({
          _id: blog_id,
          mb_id: mb_id,
        })
        .exec();
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getTargetBlogsData(member, queries) {
    try {
      const aggrigation = [];
      //Matching
      for (let prop in queries) {
        if (!queries[prop] || queries[prop] === "undefined") {
          delete queries[prop];
        }
      }
      const match = {};
      match.blog_status = "ACTIVE";
      if (queries.order && queries.order !== "ALL") {
        match.blog_category = queries.order;
      }
      if (queries.mb_id) {
        match.mb_id = shapeMongooseObjectId(queries.mb_id);
      }

      //Filtering
      const sort = {};
      switch (queries.filter) {
        case "newToOld":
          sort["createdAt"] = -1;
          break;
        case "oldToNew":
          sort["createdAt"] = 1;
          break;
        case "like":
          sort["blog_likes"] = -1;
          break;
        case "view":
          sort["blog_views"] = -1;
          break;
        default:
          break;
      }
      const limit = queries.limit * 1;
      aggrigation.push(
        { $match: match },
        { $sort: sort },
        { $skip: (queries.page * 1 - 1) * limit * 1 },
        { $limit: limit * 1 },
        {
          $lookup: {
            from: "members",
            localField: "mb_id",
            foreignField: "_id",
            as: "mb_data",
          },
        },
        { $unwind: "$mb_data" }
      );
      if (member) {
        const mb_id = shapeMongooseObjectId(member._id);
        aggrigation.push(lookup_auth_member_liked(mb_id));
      }
      //Final Return
      const targetBlogs = await this.communityModel
        .aggregate(aggrigation)
        .exec();
      return targetBlogs;
    } catch (err) {
      throw err;
    }
  }

  async createReviewData(member, data) {
    try {
      const mb_id = shapeMongooseObjectId(member._id),
        item_id = shapeMongooseObjectId(data.review_target_id);
      const review = new this.reviewModel({
        mb_id: mb_id,
        review_target_id: item_id,
        review_group: data.review_group,
        review_context: data.review_context,
        review_stars: data.review_stars,
      });
      assert.ok(review, Definer.smth_err1);
      switch (data.review_group) {
        case "MEMBER":
          await this.memberModel
            .findOneAndUpdate(
              {
                _id: item_id,
                mb_status: "ACTIVE",
              },
              { $inc: { mb_comments: 1 } },
              { returnDocument: "after" }
            )
            .exec();
          break;
        case "PRODUCT":
          await this.productModel
            .findOneAndUpdate(
              {
                _id: item_id,
                product_status: "PROCESS",
              },
              { $inc: { product_comments: 1 } },
              { returnDocument: "after" }
            )
            .exec();
          break;
        case "COMMUNITY":
          await this.communityModel
            .findOneAndUpdate(
              {
                _id: item_id,
                blog_status: "ACTIVE",
              },
              { $inc: { blog_comments: 1 } },
              { returnDocument: "after" }
            )
            .exec();
        default:
          break;
      }
      const result = await review.save();
      return result;
    } catch (err) {
      throw err;
    }
  }
  async getReviewsData(member, id) {
    try {
      const product_id = shapeMongooseObjectId(id);
      const aggrigation = [];
      aggrigation.push(
        { $match: { review_target_id: product_id } },
        {
          $lookup: {
            from: "members",
            localField: "mb_id",
            foreignField: "_id",
            as: "member_data",
          },
        },
        { $unwind: "$member_data" }
      );
      if (member?._id) {
        const mb_id = shapeMongooseObjectId(member._id);
        aggrigation.push(lookup_auth_member_liked(mb_id));
      }
      const result = await this.reviewModel.aggregate(aggrigation);
      return result;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Community;
