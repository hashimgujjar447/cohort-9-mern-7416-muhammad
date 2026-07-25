import { expect } from "chai";
import bcrypt from "bcryptjs";

import { generateOtp } from "../../src/utils/generateOtp.js";

describe("generateOtp()", () => {
  it("should generate a valid OTP with hash and expiry", async () => {
    const { otp, hashedOtp, expiresAt } = await generateOtp();

    expect(otp).to.exist;

    expect(otp).to.have.lengthOf(6);
    expect(otp).to.match(/^\d{6}$/);

    expect(hashedOtp).to.not.equal(otp);

    const isMatch = await bcrypt.compare(otp, hashedOtp);
    expect(isMatch).to.be.true;

    expect(expiresAt).to.be.instanceOf(Date);

    expect(expiresAt.getTime()).to.be.greaterThan(Date.now());

    const remainingTime = expiresAt.getTime() - Date.now();

    expect(remainingTime).to.be.within(9 * 60 * 1000, 10 * 60 * 1000);
  });
});
