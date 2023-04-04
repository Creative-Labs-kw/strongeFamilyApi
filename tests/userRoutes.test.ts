import request from "supertest";
import { app } from "../app";
import mongoose, { ConnectOptions } from "mongoose";
import config from "../config";
import User from "../models/User";

describe("User routes", () => {
  beforeAll(async () => {
    await mongoose.connect(`http://localhost:${config.server.port}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  describe("GET /users", () => {
    it("should return a list of users", async () => {
      const res = await request(app).get("/users");
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBeTruthy();
    });
  });

  describe("POST /users", () => {
    it("should create a new user", async () => {
      const res = await request(app)
        .post("/users")
        .send({ name: "John Doe", email: "john.doe@example.com" });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "John Doe");
      expect(res.body).toHaveProperty("email", "john.doe@example.com");
      expect(res.body).toHaveProperty("createdAt");
      expect(res.body).toHaveProperty("updatedAt");
    });

    it("should return a 400 error if name is missing", async () => {
      const res = await request(app)
        .post("/users")
        .send({ email: "john.doe@example.com" });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error", "Name is required");
    });

    it("should return a 400 error if email is missing", async () => {
      const res = await request(app).post("/users").send({ name: "John Doe" });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error", "Email is required");
    });

    it("should return a 400 error if email is invalid", async () => {
      const res = await request(app)
        .post("/users")
        .send({ name: "John Doe", email: "invalid-email" });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error", "Invalid email");
    });
  });

  describe("GET /users/:id", () => {
    it("should return a user by id", async () => {
      const user = await request(app)
        .post("/users")
        .send({ name: "John Doe", email: "john.doe@example.com" });

      const res = await request(app).get(`/users/${user.body._id}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("_id", user.body._id);
      expect(res.body).toHaveProperty("name", "John Doe");
      expect(res.body).toHaveProperty("email", "john.doe@example.com");
      expect(res.body).toHaveProperty("createdAt");
      expect(res.body).toHaveProperty("updatedAt");
    });

    it("should return a 404 error if user is not found", async () => {
      const res = await request(app).get("/users/123");
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty("error", "User not found");
    });
  });
});
