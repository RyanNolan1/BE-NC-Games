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
      .get("/api/nonsense")
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
      .get("/api/reviews/nonsense")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Invalid Request!");
      });
  });
});

describe("/api/reviews/:review_id/comments", () => {
  test("GET 200 - responds with an array of comments by review_id", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then((res) => {
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

  test("GET: 200 - responds with an array of comment objects sorted in descending order by created date", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.review).toBeSorted({
          key: "created_at",
          descending: true,
        });
      });
  });

  test("GET: 400 - responds with an error message if an invalid ID (wrong data type) is entered", () => {
    return request(app)
      .get("/api/reviews/nonsense/comments")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Invalid Request!");
      });
  });

  test("GET: 404 - valid but non-existent review_id", () => {
    return request(app)
      .get("/api/reviews/9999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Review not found!");
      });
  });

  test("GET: 200 - returns an empty array if article exists but doesn't contain any comments", () => {
    return request(app)
      .get("/api/reviews/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.review).toEqual([]);
      });
  });

  test("POST - 201: adds the new comment to the database and responds with an object containing the new comment", () => {
    return request(app)
      .post("/api/reviews/2/comments")
      .send({ username: "philippaclaire9", body: "northcoders" })
      .expect(201)
      .then((res) => {
        expect(res.body.comment).toMatchObject({
          comment_id: expect.any(Number),
          votes: 0,
          created_at: expect.any(String),
          author: "philippaclaire9",
          body: "northcoders",
          review_id: 2,
        });
      });
  });

  test("POST - 404: test for an ID that doesn't exist", () => {
    return request(app)
      .post("/api/reviews/9999/comments")
      .send({ username: "philippaclaire9", body: "northcoders" })
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Bad Request!");
      });
  });

  test("POST - 400: test for an ID that is an invalid data type", () => {
    return request(app)
      .post("/api/reviews/nonsense/comments")
      .send({ username: "philippaclaire9", body: "northcoders" })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Invalid Request!");
      });
  });

  test("POST - 400: test that a 400 error is returned when an object has missing information", () => {
    return request(app)
      .post("/api/reviews/2/comments")
      .send({})
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Information Missing!");
      });
  });

  test("POST - 404: Error is returned is when a comment is sent with a username that doesn't already exist", () => {
    return request(app)
      .post("/api/reviews/2/comments")
      .send({ username: "Dave", body: "I love it!" })
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Bad Request!");
      });
  });
});

describe("/api/reviews/:review_id", () => {
  test("PATCH - 200: responds with the updated review", () => {
    const testVotes = { inc_votes: 5 };
    return request(app)
      .patch("/api/reviews/2")
      .send(testVotes)
      .expect(200)
      .then(({ body }) => {
        expect(body.review).toEqual({
          review_id: 2,
          title: "Jenga",
          review_body: "Fiddly fun for all the family",
          designer: "Leslie Scott",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          votes: 10,
          category: "dexterity",
          owner: "philippaclaire9",
          created_at: "2021-01-18T10:01:41.251Z",
        });
      });
  });

  test("PATCH - 200: responds with the updated review when the votes value is a minus", () => {
    const testVotes = { inc_votes: -100 };
    return request(app)
      .patch("/api/reviews/2")
      .send(testVotes)
      .expect(200)
      .then(({ body }) => {
        expect(body.review).toEqual({
          review_id: 2,
          title: "Jenga",
          review_body: "Fiddly fun for all the family",
          designer: "Leslie Scott",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          votes: -95,
          category: "dexterity",
          owner: "philippaclaire9",
          created_at: "2021-01-18T10:01:41.251Z",
        });
      });
  });

  test("PATCH - 404: returns an error message when trying to patch an review that doesn't exist", () => {
    const testVotes = { inc_votes: 10 };
    return request(app)
      .patch("/api/reviews/84884")
      .send(testVotes)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("Review doesn't exist!");
      });
  });

  test("PATCH - 400: returns an error message when trying to patch an review that doesn't exist", () => {
    const testVotes = { inc_votes: 10 };
    return request(app)
      .patch("/api/reviews/nonsense")
      .send(testVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Invalid Request!");
      });
  });

  test("PATCH - 400: returns an error message when trying to patch a review without any vote value", () => {
    const testVotes = {};
    return request(app)
      .patch("/api/reviews/nonsense")
      .send(testVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Invalid Request!");
      });
  });

  test("PATCH - 404: returns an error message when trying to patch a review with a vote that isn't valid", () => {
    const testVotes = { inc_votes: "nonsense" };
    return request(app)
      .patch("/api/reviews/2")
      .send(testVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Invalid Request!");
      });
  });
});

describe("/api/users", () => {
  test("GET 200 - responds with an array of user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((res) => {
        const result = res.body.users;
        expect(result.length).toBeGreaterThan(0);
        result.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
  test("GET: 404 - responds with an error if path doesn't exist", () => {
    return request(app)
      .get("/api/nonsense")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Bad Request!");
      });
  });
});
