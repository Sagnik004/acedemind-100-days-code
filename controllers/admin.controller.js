const Product = require('../models/product.model');

const getProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll();
    res.render('admin/products/all-products', { products });
  } catch (error) {
    next(error);
    return;
  }
};

const getNewProduct = (req, res) => {
  res.render('admin/products/new-product');
};

const createNewProduct = async (req, res, next) => {
  try {
    const productData = {
      title: req.body.title,
      summary: req.body.summary,
      price: req.body.price,
      description: req.body.description,
      image: req.file.filename,
    };
    const product = new Product(productData);
    await product.save();

    res.redirect('/admin/products');
  } catch (error) {
    console.error(error);
    next(error);
    return;
  }
};

const getUpdateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    res.render('admin/products/update-product', { product });
  } catch (error) {
    next(error);
  }
};

const updateProduct = (req, res) => {};

module.exports = {
  getProducts,
  getNewProduct,
  createNewProduct,
  getUpdateProduct,
  updateProduct,
};
