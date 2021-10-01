const mongoose = require("mongoose");
const config = require("config");

module.exports.connect = async () => {
  const url = config.get("db");
  await mongoose.connect(url, { useNewUrlParser: true });
};

module.exports.close = async () => {
  const collections = Object.keys(mongoose.connection.collections);
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName];
    await collection.deleteMany();
  }
};
