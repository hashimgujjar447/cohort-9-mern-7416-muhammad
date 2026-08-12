import { expect } from "chai";
import crypto from "crypto";

import authService from "../../src/modules/auth/auth.service.js";
import UserModel from "../../src/modules/auth/auth.model.js";
import bcrypt from "bcryptjs";

describe("AuthService - register()", () => {
  const data = {
    firstName: "Muhammad",
    lastName: "Hashim",
    username: "hashim",
    email: "hashim@test.com",
    password: "Password@123",
  };

  it("should register a new user successfully", async () => {
    const result = await authService.register(data);

    expect(result.status).to.equal(201);
    expect(result.success).to.be.true;
    expect(result.message).to.equal(
      "Registration successful. Please verify your email.",
    );

    const user = await UserModel.findOne({
      email: data.email,
    }).select("+password");

    expect(user).to.not.be.null;
    expect(user!.firstName).to.equal(data.firstName);
    expect(user!.lastName).to.equal(data.lastName);
    expect(user!.username).to.equal(data.username);
    expect(user!.email).to.equal(data.email);
    expect(user!.isVerified).to.be.false;
    expect(user!.emailVerificationToken).to.exist;
    expect(user!.emailVerificationTokenExpiry).to.exist;

    expect(user!.password).to.not.equal(data.password);
    expect(await user!.comparePassword(data.password)).to.be.true;
  });

  it("should not resend verification OTP if existing OTP is still valid", async () => {
    await authService.register(data);

    const existingUser = await UserModel.findOne({ email: data.email });

    const oldOtp = existingUser!.emailVerificationToken;
    const oldExpiry = existingUser!.emailVerificationTokenExpiry;

    const result = await authService.register(data);

    expect(result.status).to.equal(200);
    expect(result.success).to.be.true;
    expect(result.message).to.equal(
      "A email verification OTP is already send on your email please check",
    );

    const updatedUser = await UserModel.findOne({ email: data.email });

    expect(updatedUser).to.not.be.null;
    expect(updatedUser!.emailVerificationToken).to.equal(oldOtp);
    expect(updatedUser!.emailVerificationTokenExpiry!.getTime()).to.equal(
      oldExpiry!.getTime(),
    );

    const users = await UserModel.find();

    expect(users).to.have.length(1);
  });
  it("should resend verification OTP if existing OTP has expired", async () => {
    await UserModel.create({
      ...data,
      isVerified: false,
      emailVerificationToken: await bcrypt.hash("123456", 10),
      emailVerificationTokenExpiry: new Date(Date.now() - 10 * 60 * 1000),
    });

    const existingUser = await UserModel.findOne({ email: data.email });

    const oldOtp = existingUser!.emailVerificationToken;

    const result = await authService.register(data);

    expect(result.status).to.equal(200);
    expect(result.success).to.be.true;
    expect(result.message).to.equal(
      "A new verification OTP has been sent to your email.",
    );

    const updatedUser = await UserModel.findOne({ email: data.email });

    expect(updatedUser!.emailVerificationToken).to.not.equal(oldOtp);
    expect(
      updatedUser!.emailVerificationTokenExpiry!.getTime(),
    ).to.be.greaterThan(Date.now());
  });

  it("should return 409 if username already exists", async () => {
    await UserModel.create({
      firstName: "Muhammad",
      lastName: "Hashim",
      username: "hashim",
      email: "old@test.com",
      password: "Password@123",
    });

    const result = await authService.register({
      firstName: "Ali",
      lastName: "Khan",
      username: "hashim",
      email: "new@test.com",
      password: "Password@123",
    });

    expect(result.status).to.equal(409);
    expect(result.success).to.be.false;
    expect(result.message).to.equal(
      "Username already exists. Please write another username",
    );
  });

  it("should return 409 if a verified user tries to register again", async () => {
    await UserModel.create({
      firstName: "Muhammad",
      lastName: "Hashim",
      username: "hashim",
      email: "hashim@test.com",
      password: "Password@123",
      isVerified: true,
    });

    const result = await authService.register({
      firstName: "Muhammad",
      lastName: "Hashim",
      username: "another_username",
      email: "hashim@test.com",
      password: "Password@123",
    });

    expect(result.status).to.equal(409);
    expect(result.success).to.be.false;
    expect(result.message).to.equal("User already exists. Please login.");
  });
});

describe("AuthService - login()", () => {
  const data = {
    email: "hashim@test.com",
    password: "Password@123",
  };

  it("should login a verified user successfully", async () => {
    await UserModel.create({
      firstName: "Muhammad",
      lastName: "Hashim",
      username: "hashim",
      email: "hashim@test.com",
      password: "Password@123",
      isVerified: true,
    });

    const result = await authService.login(data);

    expect(result.status).to.equal(200);
    expect(result.success).to.be.true;
    expect(result.message).to.equal("Login successful");

    expect(result).to.have.property("accessToken");
    expect(result).to.have.property("refreshToken");

    expect(result.accessToken).to.be.a("string");
    expect(result.refreshToken).to.be.a("string");

    expect(result.accessToken).to.not.be.empty;
    expect(result.refreshToken).to.not.be.empty;

    const user = await UserModel.findOne({ email: data.email });

    expect(user).to.not.be.null;
    const expectedHashedToken = crypto
      .createHash("sha256")
      .update(result.refreshToken!)
      .digest("hex");

    expect(user!.refreshToken).to.equal(expectedHashedToken);
  });

  it("should return invalid credentials if user does not exist", async () => {
    await UserModel.create({
      firstName: "Muhammad",
      lastName: "Hashim",
      username: "hashim",
      email: "hashim@gmail.com",
      password: "Password@123",
      isVerified: true,
    });

    const result = await authService.login(data);

    expect(result.status).to.equal(401);
    expect(result.success).to.be.false;
    expect(result.message).to.equal("Invalid email or password.");
  });

  it("should return account not verified if user email is not verified", async () => {
    await UserModel.create({
      firstName: "Muhammad",
      lastName: "Hashim",
      username: "hashim",
      email: "hashim@test.com",
      password: "Password@123",
      isVerified: false,
    });

    const result = await authService.login(data);

    expect(result.status).to.equal(401);
    expect(result.success).to.be.false;
    expect(result.message).to.equal(
      "Account is not verified please verify your account first.",
    );
  });

  it("should return incorrect password if password is invalid", async () => {
    await UserModel.create({
      firstName: "Muhammad",
      lastName: "Hashim",
      username: "hashim",
      email: "hashim@test.com",
      password: "Password@1234",
      isVerified: true,
    });

    const result = await authService.login(data);

    expect(result.status).to.equal(401);
    expect(result.success).to.be.false;
    expect(result.message).to.equal("Invalid email or password.");

    const user = await UserModel.findOne({ email: data.email });

    expect(user!.refreshToken).to.be.null;
  });
});

describe("AuthService - verifyEmail()", () => {
  const data = {
    email: "hashim@test.com",
    otpCode: "123456",
  };

  it("should verify email successfully", async () => {
    const token = await bcrypt.hash("123456", 10);

    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 10);

    await UserModel.create({
      firstName: "Muhammad",
      lastName: "Hashim",
      username: "hashim",
      email: data.email,
      password: "Password@123",
      isVerified: false,
      emailVerificationToken: token,
      emailVerificationTokenExpiry: expiry,
    });

    const result = await authService.verifyEmail(data);

    expect(result.status).to.equal(200);
    expect(result.success).to.be.true;
    expect(result.message).to.equal("Email verified successfully");

    const user = await UserModel.findOne({ email: data.email });

    expect(user).to.not.be.null;
    expect(user!.isVerified).to.be.true;
    expect(user!.emailVerificationToken).to.be.null;
    expect(user!.emailVerificationTokenExpiry).to.be.null;
  });

  it("should return user not found", async () => {
    const result = await authService.verifyEmail(data);

    expect(result.status).to.equal(404);
    expect(result.success).to.be.false;
    expect(result.message).to.equal("User not found");
  });

  it("should return email already verified", async () => {
    await UserModel.create({
      firstName: "Muhammad",
      lastName: "Hashim",
      username: "hashim",
      email: data.email,
      password: "Password@123",
      isVerified: true,
    });

    const result = await authService.verifyEmail(data);

    expect(result.status).to.equal(409);
    expect(result.success).to.be.false;
    expect(result.message).to.equal("Email already verified");
  });

  it("should return verification OTP not found", async () => {
    await UserModel.create({
      firstName: "Muhammad",
      lastName: "Hashim",
      username: "hashim",
      email: data.email,
      password: "Password@123",
      isVerified: false,
      emailVerificationToken: null,
      emailVerificationTokenExpiry: null,
    });

    const result = await authService.verifyEmail(data);

    expect(result.status).to.equal(400);
    expect(result.success).to.be.false;
    expect(result.message).to.equal("Verification OTP not found");
  });

  it("should return OTP has expired", async () => {
    const token = await bcrypt.hash("123456", 10);

    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() - 10);

    await UserModel.create({
      firstName: "Muhammad",
      lastName: "Hashim",
      username: "hashim",
      email: data.email,
      password: "Password@123",
      isVerified: false,
      emailVerificationToken: token,
      emailVerificationTokenExpiry: expiry,
    });

    const result = await authService.verifyEmail(data);

    expect(result.status).to.equal(400);
    expect(result.success).to.be.false;
    expect(result.message).to.equal("OTP has expired");
  });

  it("should return invalid OTP", async () => {
    const token = await bcrypt.hash("654321", 10);

    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 10);

    await UserModel.create({
      firstName: "Muhammad",
      lastName: "Hashim",
      username: "hashim",
      email: data.email,
      password: "Password@123",
      isVerified: false,
      emailVerificationToken: token,
      emailVerificationTokenExpiry: expiry,
    });

    const result = await authService.verifyEmail(data);

    expect(result.status).to.equal(400);
    expect(result.success).to.be.false;
    expect(result.message).to.equal("Invalid OTP");
  });
});

describe("AuthService - resetPasswordRequest()", () => {
  const email = "hashim@test.com";

  it("should return same success message even if user does not exist (email enumeration safe)", async () => {
    const result = await authService.resetPasswordRequest({ email });

    expect(result.status).to.equal(200);
    expect(result.success).to.be.true;
    expect(result.message).to.equal(
      "If an account exists with this email, a password reset link has been sent.",
    );
  });

  it("should save reset token and expiry to user document", async () => {
    await UserModel.create({
      firstName: "Muhammad",
      lastName: "Hashim",
      username: "hashim",
      email,
      password: "Password@123",
      isVerified: true,
    });

    const result = await authService.resetPasswordRequest({ email });

    expect(result.status).to.equal(200);
    expect(result.success).to.be.true;

    const user = await UserModel.findOne({ email });

    expect(user!.resetPasswordToken).to.be.a("string");
    expect(user!.resetPasswordToken).to.not.be.null;
    expect(user!.passwordResetTokenExpiry).to.not.be.null;
    expect(user!.passwordResetTokenExpiry!.getTime()).to.be.greaterThan(
      Date.now(),
    );
  });

  it("should normalize email to lowercase before lookup", async () => {
    await UserModel.create({
      firstName: "Muhammad",
      lastName: "Hashim",
      username: "hashim",
      email,
      password: "Password@123",
      isVerified: true,
    });

    const result = await authService.resetPasswordRequest({
      email: "  HASHIM@TEST.COM  ",
    });

    expect(result.status).to.equal(200);
    expect(result.success).to.be.true;

    const user = await UserModel.findOne({ email });
    expect(user!.resetPasswordToken).to.not.be.null;
  });
});

describe("AuthService - changeUserPassword()", () => {
  const email = "hashim@test.com";
  const newPassword = "NewPassword@123";

  it("should change password successfully with a valid token", async () => {
    const user = await UserModel.create({
      firstName: "Muhammad",
      lastName: "Hashim",
      username: "hashim",
      email,
      password: "OldPassword@123",
      isVerified: true,
    });

    await authService.resetPasswordRequest({ email });

    const updatedUser = await UserModel.findOne({ email });
    const token = updatedUser!.resetPasswordToken!;

    const result = await authService.changeUserPassword({
      token,
      password: newPassword,
    });

    expect(result.status).to.equal(200);
    expect(result.success).to.be.true;
    expect(result.message).to.equal("Password changed successfully.");

    const finalUser = await UserModel.findOne({ email }).select("+password");

    expect(finalUser!.resetPasswordToken).to.be.null;
    expect(finalUser!.passwordResetTokenExpiry).to.be.null;

    expect(await finalUser!.comparePassword(newPassword)).to.be.true;
  });

  it("should return 401 for an invalid (garbage) token", async () => {
    const result = await authService.changeUserPassword({
      token: "this.is.not.a.valid.jwt",
      password: newPassword,
    });

    expect(result.status).to.equal(401);
    expect(result.success).to.be.false;
    expect(result.message).to.equal("Invalid reset password token.");
  });

  it("should return 401 if token does not match stored token", async () => {
    const user = await UserModel.create({
      firstName: "Muhammad",
      lastName: "Hashim",
      username: "hashim",
      email,
      password: "OldPassword@123",
      isVerified: true,
    });

    await authService.resetPasswordRequest({ email });

    const updatedUser = await UserModel.findOne({ email });
    const realToken = updatedUser!.resetPasswordToken!;

    await UserModel.findByIdAndUpdate(updatedUser!._id, {
      resetPasswordToken: "differenttoken",
    });

    const result = await authService.changeUserPassword({
      token: realToken,
      password: newPassword,
    });

    expect(result.status).to.equal(401);
    expect(result.success).to.be.false;
    expect(result.message).to.equal("Invalid reset password token.");
  });

  it("should return 401 if reset token has expired in DB", async () => {
    await UserModel.create({
      firstName: "Muhammad",
      lastName: "Hashim",
      username: "hashim",
      email,
      password: "OldPassword@123",
      isVerified: true,
    });

    await authService.resetPasswordRequest({ email });

    const expiredDate = new Date();
    expiredDate.setMinutes(expiredDate.getMinutes() - 30);

    const updatedUser = await UserModel.findOne({ email });
    await UserModel.findByIdAndUpdate(updatedUser!._id, {
      passwordResetTokenExpiry: expiredDate,
    });

    const result = await authService.changeUserPassword({
      token: updatedUser!.resetPasswordToken!,
      password: newPassword,
    });

    expect(result.status).to.equal(401);
    expect(result.success).to.be.false;
    expect(result.message).to.equal("Reset password token has expired.");
  });
});

describe("AuthService - refreshAccessToken()", () => {
  const email = "hashim@test.com";

  it("should return a new accessToken for a valid refresh token", async () => {
    await UserModel.create({
      firstName: "Muhammad",
      lastName: "Hashim",
      username: "hashim",
      email,
      password: "Password@123",
      isVerified: true,
    });

    const loginResult = await authService.login({
      email,
      password: "Password@123",
    });

    const refreshToken = loginResult.refreshToken!;

    const result = await authService.refreshAccessToken(refreshToken);

    expect(result.status).to.equal(200);
    expect(result.success).to.be.true;
    expect(result.message).to.equal("Access token refreshed successfully.");
    expect(result).to.have.property("accessToken");
    expect(result.accessToken).to.be.a("string");
    expect(result.accessToken).to.not.be.empty;
  });

  it("should return 401 for an invalid (garbage) refresh token", async () => {
    const result = await authService.refreshAccessToken("invalid.token.here");

    expect(result.status).to.equal(401);
    expect(result.success).to.be.false;
    expect(result.message).to.equal("Invalid refresh token.");
  });

  it("should return 401 if refresh token is revoked (not in DB)", async () => {
    await UserModel.create({
      firstName: "Muhammad",
      lastName: "Hashim",
      username: "hashim",
      email,
      password: "Password@123",
      isVerified: true,
    });

    const loginResult = await authService.login({
      email,
      password: "Password@123",
    });

    const refreshToken = loginResult.refreshToken!;

    await UserModel.findOneAndUpdate({ email }, { refreshToken: null });

    const result = await authService.refreshAccessToken(refreshToken);

    expect(result.status).to.equal(401);
    expect(result.success).to.be.false;
    expect(result.message).to.equal(
      "Refresh token is invalid or has been revoked.",
    );
  });
});

describe("AuthService - logout()", () => {
  const email = "hashim@test.com";

  it("should clear the refreshToken from DB on logout", async () => {
    await UserModel.create({
      firstName: "Muhammad",
      lastName: "Hashim",
      username: "hashim",
      email,
      password: "Password@123",
      isVerified: true,
    });

    const loginResult = await authService.login({
      email,
      password: "Password@123",
    });

    const user = await UserModel.findOne({ email });
    expect(user!.refreshToken).to.not.be.null;

    await authService.logout(user!._id.toString());

    const updatedUser = await UserModel.findOne({ email });
    expect(updatedUser!.refreshToken).to.be.null;
  });

  it("should return success message on logout", async () => {
    const user = await UserModel.create({
      firstName: "Muhammad",
      lastName: "Hashim",
      username: "hashim",
      email,
      password: "Password@123",
      isVerified: true,
    });

    const result = await authService.logout(user._id.toString());

    expect(result.status).to.equal(200);
    expect(result.success).to.be.true;
    expect(result.message).to.equal("Logout successful");
  });
});
