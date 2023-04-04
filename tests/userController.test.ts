import request from "supertest";
import { app } from "../app";
import mongoose from "mongoose";
import User from "../models/User";
import config from "../config";

describe("userController", () => {
  beforeAll(async () => {
    await mongoose.connect(`mongodb://localhost:${config.server.port}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as any);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  describe("POST /users", () => {
    it("should return 201 status code and user data when user is created", async () => {
      const res = await request(app).post("/users").send({
        name: "John Doe",
        email: "john.doe@example.com",
        password: "password",
      });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "John Doe");
      expect(res.body).toHaveProperty("email", "john.doe@example.com");
      expect(res.body).toHaveProperty("createdAt");
      expect(res.body).toHaveProperty("updatedAt");
    });

    it("should return 400 status code when name is missing", async () => {
      const res = await request(app).post("/users").send({
        email: "john.doe@example.com",
        password: "password",
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error", "Name is required");
    });

    it("should return 400 status code when email is missing", async () => {
      const res = await request(app).post("/users").send({
        name: "John Doe",
        password: "password",
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error", "Email is required");
    });

    it("should return 400 status code when password is missing", async () => {
      const res = await request(app).post("/users").send({
        name: "John Doe",
        email: "john.doe@example.com",
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error", "Password is required");
    });

    it("should return 400 status code when email is invalid", async () => {
      const res = await request(app).post("/users").send({
        name: "John Doe",
        email: "invalid-email",
        password: "password",
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error", "Invalid email");
    });

    it("should return 400 status code when password is too short", async () => {
      const res = await request(app).post("/users").send({
        name: "John Doe",
        email: "john.doe@example.com",
        password: "pass",
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty(
        "error",
        "Password must be at least 6 characters long"
      );
    });
  });
});
