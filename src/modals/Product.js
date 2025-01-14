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
      const { page, limit, order, direction, search } = data;
      let mb_id;
      if (member?._id) mb_id = shapeMongooseObjectId(member._id);
      console.log(data)
      const sort = { [order ?? "createdAt"]: direction ?? -1 };
      const match = { product_status: "PROCESS" };
      const pipelines = [{ $match: match }];
      if (search.company_id)
        match["company_id"] = shapeMongooseObjectId(search.company_id);
      if (search.text)
        match["product_name"] = new RegExp("^" + search.text, "i");
      if (search.color) match["product_color"] = search.color;
      if (search.memory) match["product_memory"] = search.memory;
      if (search.priceRange) {
        match["product_price"] = {
          $gte: Number(search.priceRange.start),
          $lte: Number(search.priceRange.end),
        };
      }
      if (search.contractRange) {
        match["product_contract"] = {
          $gte: Number(search.contractRange.start),
          $lte: Number(search.contractRange.end),
        };
      }
      pipelines.push(
        { $group: { _id: "$product_name", doc: { $first: "$$ROOT" } } },
        { $replaceRoot: { newRoot: "$doc" } }
      );
      pipelines.push({ $sort: sort });
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

      pipelines.push({
        $lookup: {
          from: "products",
          localField: "product_name",
          foreignField: "product_name",
          as: "product_related_colors",
        },
      });

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

      if (page) pipelines.push({ $skip: (page - 1) * limit });
      pipelines.push({ $limit: limit });
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
