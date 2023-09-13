import Family from "../models/Family";
import Jwt, { JwtPayload } from "jsonwebtoken";

const authenticateFamily = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded: JwtPayload = Jwt.verify(
      token,
      process.env.JWT_SECRET
    ) as JwtPayload;
    const familyId = decoded.familyId;

    const family = await Family.findById(familyId);

    if (!family) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.family = family;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default authenticateFamily;
