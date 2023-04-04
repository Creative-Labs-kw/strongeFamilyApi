import jwt from "jsonwebtoken";
import config from "../config";

const JWT_SECRET: string = config.jwt.secret;
const JWT_EXPIRATION: string = config.jwt.expiration;

interface IUserPayload {
  id: string;
  email: string;
  isAdmin: boolean;
}

function generateToken(user: IUserPayload): string {
  const payload: IUserPayload = {
    id: user.id,
    email: user.email,
    isAdmin: user.isAdmin,
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
}

function verifyToken(token: string): Promise<IUserPayload> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err: Error | null, payload: any) => {
      if (err) {
        return reject(err);
      }
      resolve(payload);
    });
  });
}

export default {
  generateToken,
  verifyToken,
};
