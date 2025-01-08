const { shapeMongooseObjectId } = require("../libs/convert");
const { lookup_auth_member_liked } = require("../libs/enums");
const MemberSchema = require("../schema/memberSchema");

class Company {
  constructor() {
    this.memberModel = MemberSchema;
  }

  async getTargetBrandsData(member, queries) {
    try {
      let mb_id;
      if (member) {
        mb_id = shapeMongooseObjectId(member._id);
      }
      const pipelines = [];
      const match = {
        mb_type: "COMPANY",
        mb_status: "ACTIVE",
      };
      if (queries.search) {
        match["mb_nick"] = new RegExp("^" + queries.search, "i");
      }
      pipelines.push({ $match: match });
      pipelines.push({ $sort: { [queries.order]: -1 } });
      if (queries.page) {
        pipelines.push({ $skip: (queries.page * 1 - 1) * (queries.limit * 1) });
      }
      if (queries.random === "true") {
        pipelines.push({ $sample: { size: queries.limit * 1 } });
      }
      queries.limit ? pipelines.push({ $limit: queries.limit * 1 }) : null;
      if (mb_id) {
        pipelines.push(lookup_auth_member_liked(mb_id));
      }
      const allCompanies = await this.memberModel.aggregate(pipelines).exec();
      return allCompanies;
    } catch (err) {
      throw err;
    }
  }
  async getAllBrandsData() {
    try {
      const result = await this.memberModel.find({
        mb_status: "ACTIVE",
        mb_type: "COMPANY",
      });
      return result;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Company;
