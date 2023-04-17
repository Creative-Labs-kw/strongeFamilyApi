import request from "supertest";
import { app } from "../app";
import { User } from "../models/User";
import Chance from "chance"; //Generate Random email/password
import { getAllUsers } from "../controllers/userController";
import { Request, Response } from "express";
const chance: Chance.Chance = new Chance();

//$ Test get all users (test controller functions):
jest.mock("../models/User");
describe("getAllUsers", () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {} as Request;
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;
  });

  it("should get all users successfully", async () => {
    const users = [
      {
        id: "1",
        email: "user1@test.com",
        password: "password1",
        name: "User 1",
      },
      {
        id: "2",
        email: "user2@test.com",
        password: "password2",
        name: "User 2",
      },
    ];

    (User.find as jest.Mock).mockResolvedValue(users);

    await getAllUsers(req, res);

    expect(res.json).toHaveBeenCalledWith(users);
  });

  it("should handle server errors", async () => {
    const error = new Error("Server error");
    (User.find as jest.Mock).mockRejectedValue(error);

    await getAllUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith("Server error");
  });
});
//$ ---------------------------------------------
// //$  login  :
describe("POST /login", () => {
  it("should log in a user with valid credentials", async () => {
    const user = {
      email: chance.email(),
      password: chance.string({ length: 10 }),
    };

    // Create a new user
    const createUserResponse = await request(app)
      .post("/users/register")
      .send(user);

    const userId = createUserResponse.body.userId; //Take the userID

    // Login with the new user's credentials
    const response = await request(app).post("/users/login").send(user);

    // Check that the response contains a token and user ID
    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("userId", response.body.userId);

    // Clean up by deleting the test user
    await request(app).delete(`/users/${userId}`);
  });
});
// //$ ---------------------------------------------

// //$ Return wrong user login
it("should return 401 if credentials are invalid", async () => {
  const response = await request(app)
    .post("/users/login")
    .send({ email: "test@test.com", password: "wrong_password" });
  expect(response.status).toBe(400);
});
// //$ ---------------------------------------------

// //$  Register
describe("POST /register", () => {
  it("should create new user and return JWT token", async () => {
    // Generate random email and password using Chance library
    const email = chance.email();
    const password = chance.string({ length: 8 });
    // Make the request to create a new user
    const response = await request(app).post("/users/register").send({
      email,
      password,
      name: chance.name(),
    });
    expect(response.status).toBe(201);
    expect(response.body).toBeDefined();
    expect(response.body.token).toBeDefined();
    // Verify that the user was saved in the database
    const savedUser = await User.findOne({ email });

    // Compare the email sent in the request with the one saved in the database
    expect(savedUser.email).toBe(email);
  });
});
