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
          descending: true,
        });
      });
  });
});

describe("/api/reviews/:review_id", () => {
  test("GET: 200 - responds with an object matching given review_id", () => {
    return request(app)
      .get("/api/reviews/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.review).toEqual({
          review_id: 1,
          title: "Agricola",
          review_body: "Farmyard fun!",
          designer: "Uwe Rosenberg",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          votes: 1,
          category: "euro game",
          owner: "mallionaire",
          created_at: "2021-01-18T10:00:20.514Z",
        });
      });
  });

  test("GET: 404 - responds with an error when the request is valid but doesn't exist", () => {
    return request(app)
      .get("/api/reviews/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Review doesn't exist!");
      });
  });

  test("GET: 400 - responds with an error message if an invalid ID (wrong data type) is entered", () => {
    return request(app)
      .get("/api/reviews/sausage")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad Request!");
      });
  });
});

describe("/api/reviews/:review_id/comments", () => {
  test("GET 200 - responds with an array of comments by review_id", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then((res) => {
        console.log(res.body);
        const result = res.body.review;
        expect(result.length).toBeGreaterThan(0);
        result.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            review_id: 2,
          });
        });
      });
  });
});
