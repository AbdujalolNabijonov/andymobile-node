const orderController = module.exports;
const Order = require("../modals/Order");
const assert = require("assert");
const { Definer } = require("../libs/Definer");

orderController.createOrder = async (req, res) => {
  try {
    console.log("POST: cont/createOrder");
    assert.ok(req.member, Definer.auth_err5);
    const data = req.body;
    const order = new Order();
    const result = await order.createOrderData(req.member, data);
    res.json({ state: "success", value: result });
  } catch (err) {
    console.log(`ERROR: cont/createOrder, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

orderController.updateOrder = async (req, res) => {
  try {
    console.log("POST: cont/updateOrder");
    assert.ok(req.member, Definer.auth_err5);
    const order_id = req.params.id;
    const data = req.body;
    const order = new Order();
    const result = await order.updateOrderData(order_id, data);
    res.json({ state: "success", value: result });
  } catch (err) {
    console.log(`ERROR: cont/updateOrder, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

orderController.getAllOrders = async (req, res) => {
  try {
    console.log("GET: cont/getAllOrders");
    assert.ok(req.member, Definer.auth_err5);
    const order = new Order();
    const result = await order.getAllOrdersData(req.member, req.body);
    res.json({ state: "success", value: result });
  } catch (err) {
    console.log(`ERROR: cont/getAllOrders, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

orderController.getTargetOrder = async (req, res) => {
  try {
    console.log("GET: cont/getTargetOrder");
    assert.ok(req.member, Definer.auth_err5);
    const data = req.params;
    const order = new Order();
    const result = await order.getTargetOrderData(req.member, data);
    res.json({ state: "success", value: result });
  } catch (err) {
    console.log(`ERROR: cont/getTargetOrder, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

orderController.deleteOrder = async (req, res) => {
  try {
    console.log("POST: cont/deleteOrder");
    assert.ok(req.member, Definer.auth_err5);
    const order = new Order();
    const order_id = req.body.order_id;
    const result = await order.deleteOrderData(req.member, order_id);
    res.json({ state: "success", value: result });
  } catch (err) {
    console.log(`ERROR: cont/deleteOrder, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

orderController.updateItemOrder = async (req, res) => {
  try {
    console.log("POST: cont/updateItemOrder");
    assert.ok(req.member, Definer.auth_err5);
    const item_id = req.params.item_id;
    const data = req.body;
    const order = new Order();
    const result = await order.updateItemOrderData(req.member, item_id, data);
    res.json({ state: "success", value: result });
  } catch (err) {
    console.log(`ERROR: cont/updateItemOrder, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

orderController.removeOrderItem = async (req, res) => {
  try {
    console.log("GET: cont/removeOrderItem");
    assert.ok(req.member, Definer.auth_err5);
    const id = req.params.item_id;
    const order = new Order();
    const result = await order.removeOrderItemData(id);
    res.json({ state: "success", value: result });
  } catch (err) {
    console.log(`ERROR: cont/removeOrderItem, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};
