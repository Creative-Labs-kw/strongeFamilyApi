// getToken.ts

import { Request, Response } from "express";
import User from "../models/User";

export const getToken = async (userId: string) => {
  try {
    // Replace 'YourUserModel' with your actual User model
    const user = await User.findById(userId); // Fetch the user from your database

    if (!user) {
      return console.log("No User found");
    }

    // Assuming your user model has a 'token' field
    const userToken = user.token;

    if (!userToken) {
      return console.log("No User Token found");
    }

    return { token: userToken };
  } catch (error) {
    console.error("Error fetching user token:", error);
  }
};
