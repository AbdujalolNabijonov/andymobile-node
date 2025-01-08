const assert = require("assert");
const BankCard = require("../modals/BankCard");
const { Definer } = require("../libs/Definer");

const bankCadController = module.exports;

bankCadController.createBankCard = async (req, res) => {
  try {
    console.log("GET: cont/createBankCard");
    assert.ok(req.member, Definer.auth_err5);
    const data = req.body;
    const bankCard = new BankCard();
    const result = await bankCard.createBankCardData(req.member, data);
    res.json({ state: "success", value: result });
  } catch (err) {
    console.log(`ERROR: cont/createBankCard, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

bankCadController.getTargetCard = async (req, res) => {
  try {
    console.log("GET: cont/getAllbankCards");
    assert.ok(req.member, Definer.auth_err5);
    const bankCard = new BankCard();
    const result = await bankCard.getTargetCardData(req.member);
    res.json({ state: "success", value: result });
  } catch (err) {
    console.log(`ERROR: cont/getTargetCard, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

bankCadController.transaction = async (req, res) => {
  try {
    console.log("POST: cont/transaction");
    assert.ok(req.member, Definer.auth_err5);
    const data = req.body;
    const bankCard = new BankCard();
    const result = await bankCard.transactionData(req.member, data);
    res.json({ state: "sucess", value: result });
  } catch (err) {
    console.log(`ERROR: cont/transaction, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

bankCadController.getTargetTransaction = async (req, res) => {
  try {
    console.log("GET: getTragetTransaction");
    assert.ok(req.member, Definer.auth_err5);
    const transaction_id = req.params;
    const bankCard = new BankCard();
    const result = await bankCard.getTargetTransactionData(
      req.member,
      transaction_id
    );
    res.json({ state: "success", value: result });
  } catch (err) {
    console.log(`ERROR: cont/getTragetTransaction, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};
