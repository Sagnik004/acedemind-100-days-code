const db = require('../data/db');

class Post {
  constructor(title, content, id) {
    this.title = title;
    this.content = content;
    this.id = id;
  }

  async save() {
    const newPost = {
      title: this.title,
      content: this.content,
    };
    
    const result = await db.getDB().collection('posts').insertOne(newPost);
    return result;
  }
}

module.exports = Post;
