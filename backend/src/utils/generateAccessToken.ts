import jwt from "jsonwebtoken";

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
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: "15m",
    },
  );
};
