test("GET /hello ne casse pas", async () => {
  const res = await request(app).get("/hello");
  expect(res.statusCode).toBe(200);
  expect(res.body.message).toBe("Hello world");
});

test("GET /hello retourne un résultat attendu", async () => {
  const res = await request(app).get("/hello");
  expect(res.body).toMatchSnapshot();
});
