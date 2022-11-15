const app = require("../app.js");

const request = require("supertest");

const db = require("../db/connection.js");

const seed = require("../db/seeds/seed.js");

const testData = require("../db/data/test-data/index.js");
beforeEach(() => {
  return seed(testData);
});

describe("/api/categories", () => {
  test("GET 200 - responds with an array of category objects", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then((res) => {
        const { categories } = res.body;
        expect(categories).toBeInstanceOf(Array);
      });
  });
});
