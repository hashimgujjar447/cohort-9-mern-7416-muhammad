import { expect } from "chai";

import { serviceResponse } from "../../src/utils/apiResponse.js";

describe("serviceResponse()", () => {
  it("should return a response without data", () => {
    const result = serviceResponse(200, true, "Request successful");

    expect(result.status).to.equal(200);
    expect(result.success).to.be.true;
    expect(result.message).to.equal("Request successful");

    expect(result).to.not.have.property("data");
  });

  it("should return a response with data", () => {
    const result = serviceResponse(201, true, "User created", {
      user: {
        id: "123",
        name: "Ali",
      },
    });

    expect(result.status).to.equal(201);
    expect(result.success).to.be.true;
    expect(result.message).to.equal("User created");

    expect(result.user).to.deep.equal({
      id: "123",
      name: "Ali",
    });
  });

  it("should merge all data properties into the response", () => {
    const result = serviceResponse(200, true, "Login successful", {
      accessToken: "access-token",
      refreshToken: "refresh-token",
    });

    expect(result.accessToken).to.equal("access-token");
    expect(result.refreshToken).to.equal("refresh-token");
  });

  it("should handle an empty data object", () => {
    const result = serviceResponse(200, true, "Success", {});

    expect(result.status).to.equal(200);
    expect(result.success).to.be.true;
    expect(result.message).to.equal("Success");

    expect(Object.keys(result)).to.have.lengthOf(3);
  });

  it("should return an error response", () => {
    const result = serviceResponse(404, false, "User not found");

    expect(result.status).to.equal(404);
    expect(result.success).to.be.false;
    expect(result.message).to.equal("User not found");
  });
});
