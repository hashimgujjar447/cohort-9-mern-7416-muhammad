import { randomInt } from "node:crypto";
import bcrypt from "bcryptjs";

export const generateOtp = async (): Promise<{
  otp: string;
  hashedOtp: string;
  expiresAt: Date;
}> => {
  const otp = randomInt(100000, 1000000).toString();

  const hashedOtp = await bcrypt.hash(otp, 10);

  return {
    otp,
    hashedOtp,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  };
};
