import dotenv from "dotenv";
dotenv.config();
import { expect } from "chai";
import jwt from "jsonwebtoken";

import { generateAccessToken } from "../../src/utils/generateAccessToken.js";
import { IJwtPayload } from "../../src/modules/auth/auth.types.js";

describe("generateAccessToken()", () => {
  const user = {
    userId: "hajs3",
    email: "hashim@test.com",
    username: "hashim",
  };

  it("should return a JWT token string", () => {
    const token = generateAccessToken(user);

    expect(token).to.be.a("string");
    expect(token).to.not.be.empty;
  });

  it("should generate a valid JWT token", () => {
    const token = generateAccessToken(user);

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!,
    ) as IJwtPayload;

    expect(decoded).to.exist;
  });

  it("should contain the correct userId, email and username in the payload", () => {
    const token = generateAccessToken(user);

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!,
    ) as IJwtPayload;

    expect(decoded.userId).to.equal(user.userId);
    expect(decoded.email).to.equal(user.email);
    expect(decoded.username).to.equal(user.username);
  });

  it("should contain issued at and expiration claims", () => {
    const token = generateAccessToken(user);

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!,
    ) as jwt.JwtPayload;

    expect(decoded.iat).to.exist;
    expect(decoded.exp).to.exist;
    expect(decoded.exp!).to.be.greaterThan(decoded.iat!);
  });
});
