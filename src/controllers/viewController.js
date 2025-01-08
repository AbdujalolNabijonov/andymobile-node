const View = require("../modals/view");

const viewController = module.exports;

viewController.viewedItem = async (req, res) => {
  try {
    console.log("POST: cont/viewedItem");
    const data = req.body;
    const view = new View();
    if (!req.member) {
      res.json({ state: "success", value: null });
      return false;
    }
    const result = await view.viewedItemData(req.member, data);
    res.json({ state: "success", value: result });
  } catch (err) {
    console.log(`ERROR: cont/viewedItem, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};
