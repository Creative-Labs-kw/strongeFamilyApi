import { ExtractJwt } from "passport-jwt";
import { User } from "../models/User";
import config from "../config";
import { sign } from "jsonwebtoken";
import passport from "passport";
import { Strategy as JwtStrategy } from "passport-jwt";
import { JwtPayload } from "jsonwebtoken";

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwt.secret,
};

passport.use(
  new JwtStrategy(
    jwtOptions,
    async (
      payload: JwtPayload,
      done: (error: any, user?: any, info?: any) => void
    ) => {
      try {
        const user = await User.findById(payload.user.id);
        if (!user) {
          return done(null, false);
        }
        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

export const authMiddleware = passport.authenticate("jwt", { session: false });

// * Make Mock Token For <testing> file
export function generateToken(payload: JwtPayload): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");

  const token = sign(payload, secret);
  return token;
}
