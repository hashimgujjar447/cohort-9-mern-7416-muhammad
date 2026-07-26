import jwt from "jsonwebtoken";
import { getEnv } from "./env.js";

interface RefreshTokenPayload {
  userId: string;
  email: string;
  username: string;
}

export const generateRefreshToken = ({
  userId,
  email,
  username,
}: RefreshTokenPayload): string => {
  return jwt.sign(
    {
      userId,
      email,
      username,
    },
    getEnv("REFRESH_TOKEN_SECRET"),
    {
      expiresIn: "7d", // ya 30d
    },
  );
};
