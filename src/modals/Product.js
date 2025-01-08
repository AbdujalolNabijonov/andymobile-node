const { shapeMongooseObjectId } = require("../libs/convert");
const productSchema = require("../schema/productSchema");
const { lookup_auth_member_liked } = require("../libs/enums");

class Product {
  constructor() {
    this.productModel = productSchema;
  }

  async createProductData(member, data) {
    try {
      const mb_id = shapeMongooseObjectId(member._id);
      data.company_id = mb_id;
      const product = new this.productModel(data);
      const new_product = await product.save();
      return new_product;
    } catch (err) {
      throw err;
    }
  }
  async updateProductData(product_id, data) {
    try {
      const id = shapeMongooseObjectId(product_id);
      const result = await this.productModel
        .findByIdAndUpdate({ _id: id }, data)
        .exec();
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getAllProductsData(member, query) {
    try {
      const company_id = shapeMongooseObjectId(member._id);
      let result;
      if (query.order === "ALL") {
        result = await this.productModel
          .find({ company_id: company_id })
          .exec();
      } else {
        result = await this.productModel
          .find({ company_id: company_id, product_status: query.order })
          .exec();
      }
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getTargetProductsData(member, data) {
    try {
      //Initialization Filter
      let mb_id;
      if (member?._id) {
        mb_id = shapeMongooseObjectId(member._id);
      }
      const match = { product_status: "PROCESS" };
      if (data.company_id) {
        match["company_id"] = shapeMongooseObjectId(data.company_id);
      }
      const pipelines = [{ $match: match }];
      pipelines.push(
        { $group: { _id: "$product_name", doc: { $first: "$$ROOT" } } },
        { $replaceRoot: { newRoot: "$doc" } }
      );
      // Sorting
      const sort = {};
      switch (data.order) {
        case "lowToHigh":
          sort["product_price"] = 1;
          break;
        case "highToLow":
          sort["product_price"] = -1;
          break;
        case "newToOld":
          sort["createdAt"] = -1;
          break;
        case "oldToNew":
          sort["createdAt"] = 1;
          break;
        case "like" || "popular":
          sort["product_likes"] = -1;
          break;
        case "view":
          sort["product_views"] = -1;
          break;
        case "new":
          match["product_new_released"] = "Y";
          break;
        case "sale":
          match["product_discount"] = { $gte: 1 };
          break;
        default:
          break;
      }
      if (Object.keys(sort).length > 0) {
        pipelines.push({ $sort: sort });
      }

      //Searching Item
      if (data.search) {
        match["product_name"] = new RegExp("^" + data.search, "i");
      }

      //Left Filter
      if (data.minPrice > 0 && data.maxPrice > 0) {
        match["product_price"] = {
          $gte: data.minPrice * 1,
          $lte: data.maxPrice * 1,
        };
      }

      if (data.color) {
        match["product_color"] = data.color;
      }

      if (data.contractMonth[0]) {
        const monthList = data.contractMonth.split(",");
        match["product_contract"] = {
          $gte: monthList[0] * 1,
          $lte: monthList[1] * 1,
        };
      }
      if (data.storage) {
        match["product_memory"] = data.storage * 1;
      }

      // Add $lookup stage to fetch related colors
      if (data.homeProduct == "Y") {
        pipelines.push(
          {
            $lookup: {
              from: "members",
              localField: "company_id",
              foreignField: "_id",
              as: "owner_data",
            },
          },
          { $unwind: "$owner_data" }
        );
      } else if (!data.color) {
        pipelines.push({
          $lookup: {
            from: "products",
            localField: "product_name",
            foreignField: "product_name",
            as: "product_related_colors",
          },
        });
      }

      // Project only the necessary fields from the related colors
      pipelines.push({
        $project: {
          company_id: 1,
          product_name: 1,
          product_images: 1,
          product_color: 1,
          product_display: 1,
          product_core: 1,
          product_memory: 1,
          product_ram: 1,
          product_camera: 1,
          product_price: 1,
          product_contract: 1,
          product_water_proof: 1,
          product_status: 1,
          product_new_released: 1,
          product_discount: 1,
          product_monthly_fee: 1,
          product_likes: 1,
          product_views: 1,
          product_comments: 1,
          product_description: 1,
          product_related_colors: {
            _id: 1,
            product_color: 1,
            product_images: 1,
          },
          owner_data: {
            mb_nick: 1,
            mb_image: 1,
          },
          me_liked: 1,
        },
      });
      if (data.page) {
        pipelines.push({ $skip: (data.page * 1 - 1) * data.limit });
      }
      pipelines.push({ $limit: data.limit * 1 });
      pipelines.push(lookup_auth_member_liked(mb_id));

      const result = await this.productModel.aggregate(pipelines).exec();
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getChosenProductData(member, product_id) {
    try {
      const id = shapeMongooseObjectId(product_id);
      const mb_id = shapeMongooseObjectId(member?._id);
      const aggrigation = [];
      aggrigation.push(
        { $match: { _id: id } },
        {
          $lookup: {
            from: "members",
            localField: "company_id",
            foreignField: "_id",
            as: "company_data",
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "product_name",
            foreignField: "product_name",
            as: "product_related",
          },
        },
        { $unwind: "$company_data" }
      );
      if (mb_id) {
        aggrigation.push(lookup_auth_member_liked(mb_id));
      }
      const product = await this.productModel.aggregate(aggrigation).exec();
      return product;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Product;
