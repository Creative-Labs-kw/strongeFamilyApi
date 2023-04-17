import request from "supertest";
import { app } from "../app";

//$ Get all stores
describe("GET /stores", () => {
  it("should return all stores", async () => {
    const res = await request(app).get("/stores");

    expect(res.status).toBe(200);
  });
});
