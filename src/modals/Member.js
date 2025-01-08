const assert = require("assert");
const bcrypt = require("bcryptjs");
const MemberSchema = require("../schema/memberSchema");
const { Definer } = require("../libs/Definer");
const { shapeMongooseObjectId } = require("../libs/convert");
const LikeSchema = require("../schema/likeSchema");
const Like = require("./Like");
const { lookup_member_follow } = require("../libs/enums");

class Member {
  constructor() {
    this.memberModel = MemberSchema;
    this.likeModel = LikeSchema;
  }

  async signupData(data) {
    try {
      const salt = await bcrypt.genSalt();
      data.mb_password = await bcrypt.hash(data.mb_password, salt);
      const member = new this.memberModel(data);
      const result = await member.save();
      return result;
    } catch (err) {
      throw err;
    }
  }

  async loginData(data) {
    try {
      const match = { mb_status: "ACTIVE" };
      if (data.mb_nick) {
        match.mb_nick = data.mb_nick;
      } else {
        match.mb_email = data.mb_email;
      }
      const member = await this.memberModel.findOne(match);
      assert.ok(member, Definer.auth_err1);
      const exsist_member = await bcrypt.compare(
        data.mb_password,
        member.mb_password
      );
      assert.ok(exsist_member, Definer.auth_err2);
      return member;
    } catch (err) {
      throw err;
    }
  }
  async getAllCompaniesData(query) {
    try {
      let allCompanies;
      if (query.order === "ALL") {
        allCompanies = await this.memberModel
          .find({ mb_type: "COMPANY" })
          .exec();
      } else {
        allCompanies = await this.memberModel
          .find({ mb_type: "COMPANY", mb_status: query.order })
          .exec();
      }
      return allCompanies;
    } catch (err) {
      throw err;
    }
  }

  async getChosenMemberData(member, mb_id) {
    try {
      const id = shapeMongooseObjectId(mb_id);
      const aggrigation = [];
      const match = {
        $match: { mb_status: "ACTIVE", _id: id },
      };
      aggrigation.push(match);
      if (member?._id) {
        const my_id = shapeMongooseObjectId(member._id);
        aggrigation.push(lookup_member_follow(my_id));
      }
      const result = await this.memberModel.aggregate(aggrigation).exec();
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getAllUsersData(order) {
    try {
      let result;
      switch (order) {
        case "ALL":
          result = await this.memberModel.find({ mb_type: "USER" });
          break;
        case "ACTIVE":
          result = await this.memberModel.find({
            mb_type: "USER",
            mb_status: "ACTIVE",
          });
          break;
        case "PAUSED":
          result = await this.memberModel.find({
            mb_type: "USER",
            mb_status: "PAUSED",
          });
          break;
        case "DELETED":
          result = await this.memberModel.find({
            mb_type: "USER",
            mb_status: "DELETED",
          });
          break;
        default:
          break;
      }
      return result;
    } catch (err) {
      throw err;
    }
  }

  async memberUpdateData(member, image, data) {
    try {
      if (!data._id) {
        data._id = member._id;
        data.mb_image = image ? image.path.replace(/\\/g, "/") : "";
      }
      for (let prop in data) {
        if (!data[prop]) {
          delete data[prop];
        }
      }
      const id = shapeMongooseObjectId(data._id);
      delete data._id;
      const result = await this.memberModel
        .findByIdAndUpdate({ _id: id }, data, { returnDocument: "after" })
        .exec();
      return result;
    } catch (err) {
      throw err;
    }
  }
  async resetPasswordData(data, mb_data) {
    try {
      const id = shapeMongooseObjectId(mb_data._id);
      const member = await this.memberModel.findById({ _id: id }).exec();
      const equality = await bcrypt.compare(
        data.old_password,
        member.mb_password
      );
      assert.ok(equality, Definer.auth_err2);
      const salt = await bcrypt.genSalt();
      const newPassword = await bcrypt.hash(data.new_password, salt);
      const updatedMember = await this.memberModel
        .findByIdAndUpdate(
          { _id: id },
          { mb_password: newPassword },
          { returnDocument: "after" }
        )
        .exec();
      return updatedMember;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Member;
