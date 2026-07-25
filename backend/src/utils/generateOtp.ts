import bcrypt from "bcryptjs";

export const generateOtp = async () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const hashedOtp = await bcrypt.hash(otp, 10);

  return {
    otp,
    hashedOtp,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  };
};
