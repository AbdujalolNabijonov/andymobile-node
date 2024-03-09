const followController = module.exports;
const assert = require("assert");
const Follow = require("../modals/Follow");
const Definer = require("../lib/Definer");

followController.followMember = async (req, res) => {
  try {
    console.log("POST: cont/followingMember");
    assert.ok(req.member, Definer.auth_err5);
    const follow = new Follow();
    const result = await follow.followMemberData(req.member, req.body);
    res.json({ state: "success", value: result });
  } catch (err) {
    console.log(`ERROR: cont/followingMember, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

followController.getFollowingMembers = async (req, res) => {
  try {
    assert.ok(req.member, Definer.auth_err5);
    const data = req.body;
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
    assert.ok(req.member, Definer.auth_err5);
    const data = req.body,
      follow = new Follow(),
      result = await follow.getFollowerMembersData(data);
    res.json({ state: "success", value: result });
  } catch (err) {
    console.log(`ERROR: cont/getFollowerMembers, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};
