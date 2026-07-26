import jwt from "jsonwebtoken";
import { getEnv } from "./env.js";

interface AccessTokenPayload {
  userId: string;
  email: string;
  username: string;
}

export const generateAccessToken = ({
  userId,
  email,
  username,
}: AccessTokenPayload): string => {
  return jwt.sign(
    {
      userId,
      email,
      username,
    },
    getEnv("ACCESS_TOKEN_SECRET"),
    {
      expiresIn: "15m",
    },
  );
};
