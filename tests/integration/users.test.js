const mongoose = require("mongoose");
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

describe("register", () => {
  it("can be created correctly", async () => {
    const res = await request(app)
      .post("/api/users")
      .send({ name: "Jacopo", email: "jacopo@jacopo.com", password: "Maccheroni40128%" });
    expect(res.status).toBe(200);
  });
});
