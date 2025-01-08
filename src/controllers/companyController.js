const companyController = module.exports;
const Company = require("../modals/Company");

companyController.getTargetBrands = async (req, res) => {
  try {
    console.log(`GET: cont/getTargetProducts`);
    const queries = req.query;
    const company = new Company();
    const result = await company.getTargetBrandsData(req.member, queries);
    res.json({ state: "success", value: result });
  } catch (err) {
    console.log(`ERROR: cont/getTargetProducts, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};
companyController.getAllBrands = async (req, res) => {
  try {
    console.log("GET: cont/getAllBrands");
    const company = new Company();
    const result = await company.getAllBrandsData();
    res.json({ state: "success", value: result });
  } catch (err) {
    console.log(`ERROR: cont/getAllBrands, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};
