import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  changePasswordSchema,
} from "../auth.validation";

describe("registerSchema", () => {
  const validData = {
    firstName: "Muhammad",
    lastName: "Hashim",
    username: "hashim",
    email: "hashim@example.com",
    password: "Password123",
  };

  it("should accept valid registration data", () => {
    const result = registerSchema.safeParse(validData);

    expect(result.success).toBe(true);
  });

  it("should reject invalid registration data", () => {
    const result = registerSchema.safeParse({
      ...validData,
      email: "invalid-email",
      password: "123",
    });

    expect(result.success).toBe(false);
  });

  it("should reject empty required fields", () => {
    const result = registerSchema.safeParse({
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
    });

    expect(result.success).toBe(false);
  });
});

describe("loginSchema", () => {
  it("should accept valid login data", () => {
    const result = loginSchema.safeParse({
      email: "hashim@example.com",
      password: "Password123",
    });

    expect(result.success).toBe(true);
  });

  it("should reject invalid login data", () => {
    const result = loginSchema.safeParse({
      email: "invalid-email",
      password: "123",
    });

    expect(result.success).toBe(false);
  });
});

describe("verifyEmailSchema", () => {
  it("should accept valid verification data", () => {
    const result = verifyEmailSchema.safeParse({
      otpCode: "123456",
      email: "hashim@example.com",
    });

    expect(result.success).toBe(true);
  });

  it("should reject invalid OTP", () => {
    const result = verifyEmailSchema.safeParse({
      otpCode: "123",
      email: "hashim@example.com",
    });

    expect(result.success).toBe(false);
  });
});

describe("changePasswordSchema", () => {
  it("should accept matching valid passwords", () => {
    const result = changePasswordSchema.safeParse({
      password: "Password123",
      confirmPassword: "Password123",
    });

    expect(result.success).toBe(true);
  });

  it("should reject passwords that do not match", () => {
    const result = changePasswordSchema.safeParse({
      password: "Password123",
      confirmPassword: "Password456",
    });

    expect(result.success).toBe(false);
  });
});
