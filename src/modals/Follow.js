const assert = require("assert");
const { Definer } = require("../libs/Definer");
const { shapeMongooseObjectId } = require("../libs/convert");
const FollowSchema = require("../schema/followSchema");
const Like = require("./Like");
const MemberModel = require("../schema/memberSchema");

class Follow {
  constructor() {
    this.followModel = FollowSchema;
    this.memberModel = MemberModel;
  }

  async subscribeMemberData(member, data) {
    try {
      const mb_id = shapeMongooseObjectId(member._id);
      const other_mb_id = shapeMongooseObjectId(data.other_id);
      //Validate Member
      const memberExist = await this.memberModel
        .findById({ _id: other_mb_id })
        .exec();
      assert.ok(memberExist, Definer.auth_err1);
      const doesExist = await this.doesExistFollow(mb_id, other_mb_id);
      assert.ok(!doesExist, Definer.follow_err2);
      const follow = new this.followModel({
        following_id: mb_id,
        follower_id: other_mb_id,
      });
      //Increase
      await this.modifyFollowCount(mb_id, other_mb_id, 1);
      const result = await follow.save();
      return result;
    } catch (err) {
      throw err;
    }
  }

  async unsubscribeMemberData(member, data) {
    try {
      const mb_id = shapeMongooseObjectId(member);
      const other_mb_id = shapeMongooseObjectId(data.other_id);
      //validate
      const doesExist = await this.doesExistFollow(mb_id, other_mb_id);
      //unsubscribe
      assert.ok(doesExist, Definer.auth_err1);
      const result = await this.followModel
        .findOneAndDelete({
          follower_id: other_mb_id,
          following_id: mb_id,
        })
        .exec();
      await this.modifyFollowCount(mb_id, other_mb_id, -1);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async doesExistFollow(mb_id, other_mb_id) {
    try {
      const follow = await this.followModel
        .find({
          following_id: mb_id,
          follower_id: other_mb_id,
        })
        .exec();
      return !!follow[0];
    } catch (err) {
      throw err;
    }
  }

  async modifyFollowCount(mb_id, other_mb_id, modifier) {
    try {
      await this.memberModel
        .findOneAndUpdate(
          { _id: mb_id },
          { $inc: { mb_followings: modifier } },
          { returnDocument: "after" }
        )
        .exec();
      await this.memberModel
        .findOneAndUpdate(
          { _id: other_mb_id },
          { $inc: { mb_followers: modifier } },
          { returnDocument: "after" }
        )
        .exec();
    } catch (err) {
      throw err;
    }
  }
  async getFollowingMembersData(data) {
    try {
      const mb_id = shapeMongooseObjectId(data.mb_id);
      const followings = await this.followModel.aggregate([
        { $match: { following_id: mb_id } },
        {
          $lookup: {
            from: "members",
            localField: "follower_id",
            foreignField: "_id",
            pipeline: [{ $match: { mb_status: "ACTIVE" } }],
            as: "member_data",
          },
        },
        { $unwind: "$member_data" },
        { $skip: (data.page * 1 - 1) * data.limit },
        { $limit: data.limit * 1 },
        { $project: { __v: 0 } },
      ]);
      return followings;
    } catch (err) {
      throw err;
    }
  }

  async getFollowerMembersData(data) {
    try {
      const mb_id = shapeMongooseObjectId(data.mb_id);
      const result = await this.followModel.aggregate([
        { $match: { follower_id: mb_id } },
        {
          $lookup: {
            from: "members",
            localField: "following_id",
            foreignField: "_id",
            pipeline: [{ $match: { mb_status: "ACTIVE" } }],
            as: "member_data",
          },
        },
        { $unwind: "$member_data" },
        { $skip: (data.page * 1 - 1) * (data.limit * 1) },
        { $limit: data.limit * 1 },
        {
          $lookup: {
            from: "follows",
            let: {
              lc_following_id: "$follower_id",
              lc_follower_id: "$following_id",
              me_following: true,
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$following_id", "$$lc_following_id"] },
                      { $eq: ["$follower_id", "$$lc_follower_id"] },
                    ],
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                  following_id: 1,
                  follower_id: 1,
                  me_following: "$$me_following",
                },
              },
            ],
            as: "me_following",
          },
        },
      ]);
      return result;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Follow;
