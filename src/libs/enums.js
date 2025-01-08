//Member related enums
exports.status_enums = ["ACTIVE", "PAUSED", "DELETED"];
exports.mb_type_enums = ["ADMIN", "COMPANY", "USER", "DELIVER"];
exports.mb_top_enums = ["Y", "N"];

//Product related enums
exports.product_status_enums = ["DELETED", "PROCESS", "PAUSED"];
exports.product_market_enums = ["SALE", "SALE_N", "NOSALE", "NOSALE_N"];

//Blog related enums
exports.blog_category_enums = ["CELEBRITY", "EVALUATION", "STORY"];
exports.blog_status_enums = ["DELETED", "ACTIVE"];

//Order related enums
exports.order_status_enums = ["PAUSED", "PROCESS", "FINISHED", "CANCELED", "DELIVERED"];

//Like related enums
exports.like_group_enums = ["PRODUCT", "MEMBER", "COMMUNITY", "REVIEW"];

//Notification related enums
exports.notify_enums = ["Y", "N"];

//Likes like_status
exports.lookup_auth_member_liked = (mb_id) => {
  return {
    $lookup: {
      from: "likes",
      let: {
        lc_like_ref_id: "$_id",
        lc_mb_id: mb_id,
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$like_item_id", "$$lc_like_ref_id"] },
                { $eq: ["$mb_id", "$$lc_mb_id"] },
              ],
            },
          },
        },
        {
          $project: {
            _id: 0,
            like_item_id: 1,
            mb_id: 1,
          },
        },
      ],
      as: "me_liked",
    },
  };
};

exports.lookup_member_follow = (mb_id) => {
  return {
    $lookup: {
      from: "follows",
      let: {
        lc_followingd_id: mb_id,
        lc_follower_id: "$_id",
        me_followed: true,
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$following_id", "$$lc_followingd_id"] },
                { $eq: ["$follower_id", "$$lc_follower_id"] },
              ],
            },
          },
        },
        {
          $project: {
            following_id: 1,
            follower_id: 1,
            my_following: "$$me_followed",
            me_following:1
          },
        },
      ],
      as: "my_following",
    },
  };
};
