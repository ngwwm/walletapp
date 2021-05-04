const request = require("supertest");
const app = require("../app");

describe("Test /balance with existing user", () => {
  test("It should response the POST method", () => {
    return request(app)
      .post("/api/v1/wallet/balance")
 			.send({user_id: 1001})
      .set('Accept', 'application/json')
      .then(response => {
        expect(response.body.user_id).toBe(1001) && 
        expect(response.statusCode).toBe(200);
      });
  });
});

describe("Test /balance with user not found", () => {
  test("It should response the POST method", () => {
    return request(app)
      .post("/api/v1/wallet/balance")
 			.send({user_id: 9002})
      .set('Accept', 'application/json')
      .then(response => {
        expect(response.statusCode).toBe(404);
      });
  });
});
