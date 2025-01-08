const assert = require("assert");
const Community = require("../modals/Community");
const { Definer } = require("../libs/Definer");

const communityController = module.exports;

communityController.createPost = async (req, res) => {
  try {
    console.log(`POST: cont/createPost`);
    assert(req.member, Definer.auth_err5);
    const community = new Community();
    const result = await community.createPostData(req.member, req.body);
    res.json({ state: "success", value: result });
  } catch (err) {
    console.log(`ERROR: cont/createPost, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

communityController.getTargetBlogs = async (req, res) => {
  try {
    console.log(`GET: cont/getTargetBlogs`);
    const queries = req.query,
      community = new Community(),
      result = await community.getTargetBlogsData(req.member, queries);
    res.json({ state: "success", value: result });
  } catch (err) {
    console.log(`ERROR: cont/getTargetBlogs, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

communityController.getChosenBlog = async (req, res) => {
  try {
    console.log(`GET: cont/getChosenBlog`);
    const blog_id = req.params.blog_id;
    const community = new Community();
    const result = await community.getChosenBlogData(blog_id);
    res.json({ state: "success", value: result });
  } catch (err) {
    console.log(`ERROR: cont/getChosenBlog, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

communityController.removeBlog = async (req, res) => {
  try {
    console.log("GET:cont/removeBlog");
    assert.ok(req.member, Definer.auth_err5);
    const blog_id = req.params.blog_id;
    const community = new Community();
    const result = await community.removeBlogData(req.member, blog_id);
    res.json({ state: "success", value: result });
  } catch (err) {
    console.log(`ERROR: cont/removeBlog, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};
communityController.createReview = async (req, res) => {
  try {
    console.log("POST: cont/createReview");
    assert.ok(req.member, Definer.auth_err5);
    const data = req.body;
    const community = new Community();
    const result = await community.createReviewData(req.member, data);
    res.json({ state: "success", value: result });
  } catch (err) {
    console.log(`ERROR: cont/createReview, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

communityController.getReviews = async (req, res) => {
  try {
    console.log("GET: cont/getReviews");
    const community = new Community();
    const result = await community.getReviewsData(
      req.member,
      req.params.item_id
    );
    res.json({ state: "success", value: result });
  } catch (err) {
    console.log(`ERROR: cont/getReviews, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

communityController.returImagePath = async (req, res) => {
  try {
    console.log("POST: cont/returnImagePath");
    assert.ok(req.member, Definer.auth_err5);
    assert.ok(req.file, Definer.smth_err1);
    const result = req.file.path.replace(/\\/g, "/");
    res.json({ state: "success", value: result });
  } catch (err) {
    console.log(`ERROR: cont/returnImagePath, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};
