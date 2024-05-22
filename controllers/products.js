const Product = require("../models/product");

const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({}).sort("name price");
  res.status(200).json({
    status: "Success",
    length: products.length,
    data: products,
  });
};

const getAllProducts = async (req, res) => {
  const { featured, company, rating, price, fields, sort, numericFilters } =
    req.query;
  const queryObject = {};
  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }
  if (company) {
    queryObject.company = { $regex: company, $options: "i" };
  }
  if (rating) {
    queryObject.rating = rating;
  }
  if (price) {
    queryObject.price = price;
  }

  console.log(queryObject);
  let result = Product.find(queryObject);
  if (sort) {
    const sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
  } else {
    result = result.sort("createAt");
  }
  if (fields) {
    const fieldsSort = fields.split(",").join(" ");
    result = result.select(fieldsSort);
  }
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;
  const skip = (page - 1) * limit;
  result = result.skip(skip).limit(limit);
  // if (numericFilters) {
  //   const operatorMap = {
  //     ">": "$gt",
  //     ">=": "$gte",
  //     "=": "$eq",
  //     "<": "$lt",
  //     "<=": "$lte",
  //   };
  // }
  // const regEx = /\b(<|>|>=|=|<|<=)\b/g;
  // let filters = numericFilters.replace(
  //   regEx,
  //   (match) => `-${operatorMap[match]}-`
  // );
  const products = await result;
  res
    .status(200)
    .json({ status: "Success", length: products.length, data: products });
};

module.exports = {
  getAllProducts,
  getAllProductsStatic,
};
