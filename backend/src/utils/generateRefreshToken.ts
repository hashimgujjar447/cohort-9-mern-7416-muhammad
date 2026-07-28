import jwt from "jsonwebtoken";

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
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: "7d", // ya 30d
    },
  );
};
