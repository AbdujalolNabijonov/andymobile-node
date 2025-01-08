const assert = require("assert");
const WishList = require("../modals/WishList");
const { Definer } = require("../libs/Definer");

const wishListController = module.exports;

wishListController.getAllWishedList = async (req, res) => {
  try {
    console.log("GET: cont/getAllWishList");
    const wishlist = new WishList();
    if (!req.member) {
      res.json({ state: "sucess", value: null });
      return false;
    }
    const result = await wishlist.getAllWishListItems(req.member);
    res.json({ state: "success", value: result });
  } catch (err) {
    console.log(`ERROR: cont/getAllWishList, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

wishListController.createWishListItem = async (req, res) => {
  try {
    console.log("POST: cont/createWishListIte");
    assert.ok(req.member, Definer.auth_err5);
    const data = req.body;
    const wishlist = new WishList();
    const result = await wishlist.createWishListItemData(req.member, data);
    res.json({ state: "success", value: result });
  } catch (err) {
    console.log(`ERROR: cont/createWishListIte, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};
wishListController.editWishListItem = async (req, res) => {
  try {
    console.log("PUT: cont/editWishListItem");
    assert.ok(req.member, Definer.auth_err5);
    const wishlist = new WishList();
    const result = await wishlist.editWishListItem(req.member, req.body);
    assert.ok(result, Definer.data_err1);
    res.json({ state: "success", value: result });
  } catch (err) {
    console.log(`ERROR: cont/editWishListItem, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

wishListController.removeWishListItem = async (req, res) => {
  try {
    console.log(`GET: cont/removeWishListItem`);
    assert.ok(req.member, Definer.auth_err5);
    const wishlist = new WishList();
    const result = await wishlist.removeWishListItemData(
      req.member,
      req.params
    );
    res.json({ state: "success", value: result });
  } catch (err) {
    console.log(`ERROR: cont/removeWishListItem, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};
