const request = require("supertest");
const app = require("../../app");

describe("Test de non régression /hello", () => {
  it("répond avec Hello world", async () => {
    const res = await request(app).get("/hello");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Hello world");
  });
});

test("GET /hello ne casse pas", async () => {
  const res = await request(app).get("/hello");
  expect(res.statusCode).toBe(200);
  expect(res.body.message).toBe("Hello world");
});

test("GET /hello retourne un résultat attendu", async () => {
  const res = await request(app).get("/hello");
  expect(res.body).toMatchSnapshot();
});
