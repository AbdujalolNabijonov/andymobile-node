const followController = module.exports;
const assert = require("assert");
const Follow = require("../modals/Follow");
const { Definer } = require("../libs/Definer");

followController.subscribeMember = async (req, res) => {
  try {
    console.log("POST: cont/subscribeMember");
    assert.ok(req.member, Definer.auth_err5);
    const data = req.body;
    assert.ok(req.member._id !== data.other_mb_id, Definer.follow_err1);
    const follow = new Follow();
    const result = await follow.subscribeMemberData(req.member, data);
    res.json({ state: "success", value: result });
  } catch (err) {
    console.log(`ERROR: cont/subscribeMember, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

followController.unsubscribeMember = async (req, res) => {
  try {
    console.log(`POST: cont/unsubscribeMember`);
    assert.ok(req.member, Definer.auth_err5);
    const follow = new Follow();
    const data = req.body;
    let member_id = req.member._id;
    if (data.mb_id) {
      member_id = data.mb_id;
    }
    const result = await follow.unsubscribeMemberData(member_id, data);
    res.json({ state: "success", value: result });
  } catch (err) {
    console.log(`ERROR: cont/unsubscribeMember, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

followController.getFollowingMembers = async (req, res) => {
  try {
    const data = req.body;
    if (!data.mb_id) {
      data.mb_id = req.member._id;
    }
    const follow = new Follow();
    const result = await follow.getFollowingMembersData(data);
    res.json({ state: "success", value: result });
  } catch (err) {
    console.log(`ERROR: cont/getAllFollowing, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

followController.getFollowerMembers = async (req, res) => {
  try {
    console.log("GET: cont/getFollowerMembers");
    const data = req.body,
      follow = new Follow();
    if (!data.mb_id) {
      data.mb_id = req.member._id;
    }
    const result = await follow.getFollowerMembersData(data);
    res.json({ state: "success", value: result });
  } catch (err) {
    console.log(`ERROR: cont/getFollowerMembers, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};
