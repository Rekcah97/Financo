import test from "supertest";
import { afterAll, beforeAll, describe, expect, jest } from "@jest/globals";
const { jest: jestObj } = await import("@jest/globals");
import app from "../app.js";
import prisma from "../config/db.config.js";

//Mock sendVerificationOTP
jestObj.mock("../utils/sendVerificationOtp.utils.js", () => ({
  sendVerificationOTP: jest.fn().mockResolvedValue({ success: true }),
}));

let testUser = {
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

const saveUser = async () => {
  const user = await prisma.user.findUnique({
    where: {
      email: testUser.email,
    },
  });

  testUser.id = user.id;
};

const signupResponse = async (name, email, password) => {
  const result = await test(app).post("/api/auth/signup").send({
    name,
    email,
    password,
  });

  return result;
};

const refreshResponse = async (token) => {
  const result = await test(app).post("/api/auth/refresh").send({
    refreshToken: token,
  });

  return result;
};

//Route for signup
describe("POST /api/auth/signup", () => {
  beforeAll(deleteTestUserData);
  afterAll(saveUser);

  //test 1
  it("Should create a user and Return 201", async () => {
    const response = await signupResponse(
      testUser.name,
      testUser.email,
      testUser.password,
    );

    testUser.refreshToken = response.body.refreshToken;

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

//Route for refresh Access Token
describe("POST /api/auth/refresh", () => {
  //test 1
  it("Create AccessToken and return 201", async () => {
    const refreshToken = testUser.refreshToken;
    const response = await refreshResponse(refreshToken);

    testUser.refreshToken = response.body.refreshToken;
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.accessToken).toBeDefined();
  });

  //test 2
  it("Return 400 if refreshToken is empty", async () => {
    const refreshToken = "";
    const response = await refreshResponse(refreshToken);
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  //test 3
  it("Return 401 if refreshToken is expired", async () => {
    const refreshToken = testUser.refreshToken;

    const ONE_DAY_MS = 24 * 60 * 60 * 1000;
    const oneDayBeforeNow = Date.now() - ONE_DAY_MS;

    await prisma.refreshToken.update({
      where: {
        token: refreshToken,
      },
      data: {
        expiresAt: new Date(oneDayBeforeNow),
      },
    });

    const response = await refreshResponse(refreshToken);
    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  //test 4
  it("Return 401 if token doesnot exit in database", async () => {
    const refreshToken = testUser.refreshToken;
    const response = await refreshResponse(refreshToken);

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });
});
