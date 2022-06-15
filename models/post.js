const mongodb = require('mongodb');

const db = require('../data/db');

const ObjectId = mongodb.ObjectId;

class Post {
  constructor(title, content, id) {
    this.title = title;
    this.content = content;
    if (id) {
      this.id = new ObjectId(id);
    }
  }

  async save() {
    const newPost = {
      title: this.title,
      content: this.content,
    };

    const result = await db.getDB().collection('posts').insertOne(newPost);
    return result;
  }

  async update() {
    const result = await db
      .getDB()
      .collection('posts')
      .updateOne(
        { _id: this.id },
        {
          $set: {
            title: this.title,
            content: this.content,
          },
        }
      );

    return result;
  }

  async delete() {
    if (!this.id) {
      return;
    }

    const result = await db
      .getDB()
      .collection('posts')
      .deleteOne({ _id: this.id });
    return result;
  }
}

module.exports = Post;
