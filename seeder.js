if (process.env.NODE_ENV !== "production") require("dotenv").config();

const { User } = require("./models/user.model");
const { Genre } = require("./models/genre.model");
const { Book } = require("./models/book.model");
const mongoose = require("mongoose");
const faker = require("faker");
const bcrypt = require("bcrypt");
const async = require("async");

const db = process.env.DB_URL;

const emptyCollections = async () => {
  try {
    await User.deleteMany();
    await Genre.deleteMany();
    await Book.deleteMany();
    console.log("Collections emptied correctly");
  } catch (error) {
    console.log(error);
  }
};

const genres = ["Fantasy", "Sci-Fi", "Mystery", "Thriller", "Romance", "Western", "Dystopian", "Contemporary", "Historical"];

const seedGenres = async (genres) => {
  try {
    for (let g of genres) {
      let genre = new Genre({
        name: g,
      });
      await genre.save();
    }
    console.log("Genres created correctly");
  } catch (error) {
    console.log(error);
    return error;
  }
};

const seedUsers = async () => {
  try {
    for (let i = 0; i < 11; i++) {
      let user = new User({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        password: "",
      });
      user.password = await bcrypt.hash("TestPassword123%", 10);
      await user.save();
    }
    console.log("Users created correctly");
  } catch (error) {
    console.log(error);
    return error;
  }
};

const randomGenre = async () => {
  const genres = await Genre.find({});
  let arr = [];
  for (g of genres) {
    arr.push(g._id);
  }
  const rnd = Math.floor(Math.random() * arr.length);
  return arr[rnd];
};

const randomUser = async () => {
  const users = await User.find({});
  let arr = [];
  for (u of users) {
    arr.push(u._id);
  }
  const rnd = Math.floor(Math.random() * arr.length);
  return arr[rnd];
};

const seedBooks = async () => {
  try {
    for (let i = 0; i < 21; i++) {
      let book = new Book({
        title: faker.name.title(),
        author: faker.name.findName(),
        image: faker.image.imageUrl(),
        genre: await randomGenre(genres),
        description: faker.lorem.paragraph(),
        isAvailable: faker.datatype.boolean(),
        user: await randomUser(),
      });
      await book.save();
    }
    console.log("Books created correctly");
  } catch (error) {
    console.log(error);
    return error;
  }
};

const seedDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connection successful");

    await emptyCollections();
    await seedGenres(genres);
    await seedUsers();
    await seedBooks();

    await mongoose.disconnect();
    console.log("Closing connection");
  } catch (err) {
    console.log("Failed to connect to MongoDB", err);
  }
};

seedDB();
