import { expect } from "chai";
import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  changePasswordSchema,
  resetPasswordRequestSchema,
} from "../../src/modules/auth/auth.validations.js";

describe("Auth Validations", () => {
  describe("registerSchema", () => {
    it("should pass with valid data", () => {
      const result = registerSchema.safeParse({
        firstName: "Ali",
        lastName: "Khan",
        username: "alikhan",
        email: "ali@test.com",
        password: "123456",
      });
      expect(result.success).to.be.true;
    });

    it("should fail if firstName is missing", () => {
      const result = registerSchema.safeParse({
        lastName: "Khan",
        username: "alikhan",
        email: "ali@test.com",
        password: "123456",
      });
      expect(result.success).to.be.false;
    });

    it("should fail if email is invalid", () => {
      const result = registerSchema.safeParse({
        firstName: "Ali",
        lastName: "Khan",
        username: "alikhan",
        email: "not-an-email",
        password: "123456",
      });
      expect(result.success).to.be.false;
      expect(result.error!.issues[0].message).to.equal("Invalid email address");
    });

    it("should fail if password is less than 6 characters", () => {
      const result = registerSchema.safeParse({
        firstName: "Ali",
        lastName: "Khan",
        username: "alikhan",
        email: "ali@test.com",
        password: "123",
      });
      expect(result.success).to.be.false;
      expect(result.error!.issues[0].message).to.include("6 characters");
    });

    it("should fail if username is less than 3 characters", () => {
      const result = registerSchema.safeParse({
        firstName: "Ali",
        lastName: "Khan",
        username: "ab",
        email: "ali@test.com",
        password: "123456",
      });
      expect(result.success).to.be.false;
    });
  });

  describe("loginSchema", () => {
    it("should pass with valid email and password", () => {
      const result = loginSchema.safeParse({
        email: "ali@test.com",
        password: "123456",
      });
      expect(result.success).to.be.true;
    });

    it("should fail if email is missing", () => {
      const result = loginSchema.safeParse({ password: "123456" });
      expect(result.success).to.be.false;
    });

    it("should fail if password is missing", () => {
      const result = loginSchema.safeParse({ email: "ali@test.com" });
      expect(result.success).to.be.false;
    });
  });

  describe("verifyEmailSchema", () => {
    it("should pass with valid email and otpCode", () => {
      const result = verifyEmailSchema.safeParse({
        email: "ali@test.com",
        otpCode: "123456",
      });
      expect(result.success).to.be.true;
    });

    it("should fail if otpCode is missing", () => {
      const result = verifyEmailSchema.safeParse({ email: "ali@test.com" });
      expect(result.success).to.be.false;
    });
  });

  describe("resetPasswordRequestSchema", () => {
    it("should pass with valid email", () => {
      const result = resetPasswordRequestSchema.safeParse({
        email: "ali@test.com",
      });
      expect(result.success).to.be.true;
    });

    it("should fail with invalid email", () => {
      const result = resetPasswordRequestSchema.safeParse({
        email: "invalid",
      });
      expect(result.success).to.be.false;
    });
  });

  describe("changePasswordSchema", () => {
    it("should pass when passwords match", () => {
      const result = changePasswordSchema.safeParse({
        password: "newpass123",
        confirmPassword: "newpass123",
      });
      expect(result.success).to.be.true;
    });

    it("should fail when passwords do not match", () => {
      const result = changePasswordSchema.safeParse({
        password: "newpass123",
        confirmPassword: "different",
      });
      expect(result.success).to.be.false;
      expect(result.error!.issues[0].message).to.equal(
        "Passwords do not match",
      );
    });

    it("should fail if password is less than 6 characters", () => {
      const result = changePasswordSchema.safeParse({
        password: "123",
        confirmPassword: "123",
      });
      expect(result.success).to.be.false;
    });
  });
});
