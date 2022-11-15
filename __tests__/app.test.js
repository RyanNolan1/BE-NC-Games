const app = require("../app.js");

const request = require("supertest");

const db = require("../db/connection.js");

const seed = require("../db/seeds/seed.js");

const testData = require("../db/data/test-data/index.js");
beforeEach(() => {
  return seed(testData);
});

afterAll(()=>{ return db.end()})

describe("/api/categories", () => {
  test("GET 200 - responds with an array of category objects", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then((res) => {
        const result = res.body.categories;
        expect(result.length).toBeGreaterThan(0);
        result.forEach((category) => {
          expect(category).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });

  test("GET: 404 - responds with an error if path doesn't exist", () => {
    return request(app)
    .get("/api/sausage")
    .expect(404)
    .then((res) => {
      expect(res.body.msg).toBe('Bad Request!')
    });
  });
});
