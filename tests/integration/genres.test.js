const { Genre } = require("../../models/genre.model");
const { User } = require("../../models/user.model");
const request = require("supertest");
let app;

const db = require("../test-db");
beforeAll(async () => {
  app = require("../../app");
  await db.connect();
});

afterEach(async () => {
  await db.close();
  await app.close();
});

describe("/api/genres", () => {
  describe("DELETE /:id", () => {
    let token;
    let genre;
    let id;

    beforeEach(async () => {
      genre = new Genre({ name: "genre1" });
      await genre.save();

      id = genre._id;
      token = new User().generateAuthToken();
    });

    const exec = async () => {
      return await request(app)
        .delete("/api/genres/" + id)
        .set("x-auth-token", token)
        .send();
    };
    it("should return 401 if client is not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });
  });
});
