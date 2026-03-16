import test from "supertest";
import { afterAll, beforeAll, describe, expect, jest } from "@jest/globals";
const { jest: jestObj } = await import("@jest/globals");
import app from "../app.js";
import prisma from "../config/db.config.js";

//Mock sendVerificationOTP
jestObj.mock("../utils/sendVerificationOtp.utils.js", () => ({
  sendVerificationOTP: jest.fn().mockResolvedValue({ success: true }),
}));

const testUser = {
  name: "test User",
  email: "testemail@gmail.com",
  password: "testUser@123",
};

const deleteTestUserData = async () => {
  const user = await prisma.user.findUnique({
    where: {
      email: testUser.email,
    },
  });

  if (user) {
    await prisma.refreshToken.deleteMany({
      where: {
        userId: user.id,
      },
    });

    await prisma.verificationCode.deleteMany({
      where: {
        userId: user.id,
      },
    });

    await prisma.user.delete({
      where: {
        id: user.id,
      },
    });
  }
};

const signupResponse = async (name, email, password) => {
  const result = await test(app).post("/api/auth/signup").send({
    name,
    email,
    password,
  });

  return result;
};

//Route for signup
describe("POST /api/auth/signup", () => {
  beforeAll(deleteTestUserData);

  //test 1
  it("Should create a user and Return 201", async () => {
    const response = await signupResponse(
      testUser.name,
      testUser.email,
      testUser.password,
    );
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.accessToken).toBeDefined();
  });

  //test 2
  it("Return 422 if sent data is invalid", async () => {
    const response = await signupResponse(
      "",
      testUser.email,
      testUser.password,
    );
    expect(response.status).toBe(422);
    expect(response.body.success).toBe(false);
  });

  //test 3
  it("Return 409 if user already exist", async () => {
    const response = await signupResponse(
      testUser.name,
      testUser.email,
      testUser.password,
    );
    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
  });
});
