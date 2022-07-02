const mongodb = require('mongodb');

const db = require('../data/database');

class Product {
  constructor(productData) {
    this.title = productData.title;
    this.summary = productData.summary;
    this.price = +productData.price;
    this.description = productData.description;
    this.image = productData.image;
    this.setImageRefs();
    if (productData._id) {
      this.id = productData._id.toString();
    }
  }

  static async findById(productId) {
    let prodId;
    try {
      prodId = new mongodb.ObjectId(productId);
    } catch (error) {
      error.code = 404;
      throw error;
    }

    const productInDB = await db
      .getDb()
      .collection('products')
      .findOne({ _id: prodId });

    if (!productInDB) {
      const error = new Error('Could not find product with provided id.');
      error.code = 404;
      throw error;
    }

    return productInDB;
  }

  static async findAll() {
    const products = await db.getDb().collection('products').find().toArray();
    return products.map((productDocument) => {
      return new Product(productDocument);
    });
  }

  setImageRefs() {
    this.imagePath = `product-data/images/${this.image}`;
    this.imageUrl = `/products/assets/images/${this.image}`;
  }

  async save() {
    const productData = {
      title: this.title,
      summary: this.summary,
      price: this.price,
      description: this.description,
      image: this.image,
    };

    // Update product
    if (this.id) {
      const prodId = new mongodb.ObjectId(this.id);
      if (!this.image) {
        delete productData.image;
      }
      await db.getDb().collection('products').updateOne(
        { _id: prodId },
        {
          $set: productData,
        }
      );
      return;
    }

    // New product
    await db.getDb().collection('products').insertOne(productData);
  }

  async replaceImage(newImage) {
    this.image = newImage;
    this.setImageRefs();
  }

  remove() {
    const prodId = new mongodb.ObjectId(this.id);
    return db.getDb().collection('products').deleteOne({ _id: prodId });
  }
}

module.exports = Product;
