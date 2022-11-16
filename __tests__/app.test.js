const app = require("../app.js");

const request = require("supertest");

const db = require("../db/connection.js");

const seed = require("../db/seeds/seed.js");

const testData = require("../db/data/test-data/index.js");
beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

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
        expect(res.body.msg).toBe("Bad Request!");
      });
  });

  describe("/api/reviews", () => {
    test("GET: 200 - responds with an array of reviews objects", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then((res) => {
          const result = res.body.reviews;
          expect(result.length).toBeGreaterThan(0);
          result.forEach((review) => {
            expect(review).toMatchObject({
              owner: expect.any(String),
              title: expect.any(String),
              review_id: expect.any(Number),
              category: expect.any(String),
              review_img_url: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              designer: expect.any(String),
              comment_count: expect.any(Number),
            });
          });
        });
    });
  });

  test("GET: 200 - responds with an array of objects sorted in descending order by created date", () => {
    return request(app)
    .get("/api/reviews")
    .expect(200)
    .then(({ body }) => {
      expect(body.reviews).toBeSorted({
        key: "created_at",
        descending:true,
      })
    })
  })
});
