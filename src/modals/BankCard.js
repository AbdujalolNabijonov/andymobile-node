const assert = require("assert");
const { shapeMongooseObjectId } = require("../libs/convert");
const bankInfoSchema = require("../schema/bankInfoSchema");
const TransactionSchema = require("../schema/bankTransaction");
const bcrypt = require("bcryptjs");

class BankCard {
  constructor() {
    this.bankModel = bankInfoSchema;
    this.transactionModel = TransactionSchema;
  }

  async createBankCardData(member, data) {
    try {
      const mb_id = shapeMongooseObjectId(member._id);
      //Current saved card does exist
      const searchData = {
        mb_id: mb_id,
        card_status: "ACTIVE",
      };
      const doesExist = await this.existBankCardData(searchData);
      //Validate Card Number
      if (data.card_number) {
        data.card_number = data.card_number.replace(/\s/g, "") * 1;
      }
      let result;
      const salt = await bcrypt.genSalt();
      data.card_pincode = await bcrypt.hash(data.card_pincode, salt);
      if (doesExist) {
        for (let prop in data) {
          if (!data[prop]) {
            delete data[prop];
          }
        }
        result = await this.bankModel.findOneAndUpdate(
          {
            card_status: "ACTIVE",
            mb_id: mb_id,
          },
          data,
          { returnDocument: "after" }
        );
      } else {
        if (!data.card_pincode.length === 16) {
          throw new Error("Card Number should be number with length of 16");
        }
        const bankCard = new this.bankModel({
          mb_id: mb_id,
          card_owner_name: data.card_owner_name,
          card_number: data.card_number,
          card_expiry: data.card_expiry,
          card_cvc: data.card_cvc,
          card_pincode: data.card_pincode,
        });
        //mongodb database
        result = await bankCard.save();
      }
      return result;
    } catch (err) {
      throw err;
    }
  }

  async existBankCardData(data) {
    try {
      const bankCard = await this.bankModel.find(data).exec();
      return !!bankCard[0];
    } catch (err) {
      throw err;
    }
  }

  async getTargetCardData(member) {
    try {
      const mb_id = shapeMongooseObjectId(member._id);
      const result = await this.bankModel
        .find({
          mb_id: mb_id,
          card_status: "ACTIVE",
        })
        .exec();
      return result;
    } catch (err) {
      throw err;
    }
  }

  async transactionData(member, data) {
    try {
      const mb_id = shapeMongooseObjectId(member._id);
      const order_id = shapeMongooseObjectId(data.order_id);
      let transaction;
      if (data.exist_card) {
        //Exsist bank card
        const existCard = await this.bankModel.findOne({ mb_id: mb_id }).exec();
        assert.ok(
          existCard,
          "att: You do not have Existed card on your account"
        );
        transaction = new this.transactionModel({
          mb_id: mb_id,
          order_id: order_id,
          order_code: data.order_code,
          order_address: data.order_address,
          trans_owner: existCard.card_owner_name,
          trans_card_number: existCard.card_number,
          trans_card_expiry: existCard.card_expiry,
          trans_card_cvc: existCard.card_cvc,
          trans_card_pincode: existCard.card_pincode,
        });
      } else {
        const genSalt = await bcrypt.genSalt();
        const trans_card_pincode = await bcrypt.hash(
          data.trans_card_pincode.toString(),
          genSalt
        );
        transaction = new this.transactionModel({
          mb_id: mb_id,
          order_id: order_id,
          order_code: data.order_code,
          order_address: data.order_address,
          trans_owner: data.trans_owner,
          trans_card_number: data.trans_card_number,
          trans_card_expiry: data.trans_card_expiry,
          trans_card_cvc: data.trans_card_cvc,
          trans_card_pincode: trans_card_pincode,
        });
      }
      const result = await transaction.save();
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getTargetTransactionData(member, transaction_id) {
    try {
      const mb_id = shapeMongooseObjectId(member._id);
      const id = shapeMongooseObjectId(transaction_id?.id);
      let result = null;
      if (id) {
        result = await this.transactionModel
          .aggregate([{ $match: { mb_id: mb_id, order_id: id } }])
          .exec();
      }
      return result;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = BankCard;
