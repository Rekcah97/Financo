import test from "supertest";
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  jest,
} from "@jest/globals";

jest.unstable_mockModule("../utils/sendVerificationOtp.utils.js", () => ({
  sendVerificationOTP: jest.fn().mockResolvedValue({ success: true }),
}));

// App import must come AFTER the mock is set up
const { default: app } = await import("../app.js");
const { default: prisma } = await import("../config/db.config.js");
import bcrypt from "bcrypt";

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

const siginResponse = async (email, password) => {
  const result = await test(app).post("/api/auth/signin").send({
    email: email,
    password: password,
  });

  return result;
};

const verifyEmailResponse = async (otp, accessToken) => {
  const result = await test(app)
    .post("/api/auth/verifyEmail")
    .set("Authorization", `Bearer ${accessToken}`)
    .send({
      otp: otp,
    });

  return result;
};

const resentOtpResponse = async (email, accessToken) => {
  const result = await test(app)
    .post("/api/auth/resentOtp")
    .set("Authorization", `Bearer ${accessToken}`)
    .send({
      email: email,
    });
  return result;
};

const logoutResponse = async (refreshToken) => {
  const result = await test(app).post("/api/auth/logout").send({
    refreshToken: refreshToken,
  });
  return result;
};

const ONE_HOUR_MS = 60 * 60 * 1000;
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
    testUser.accessToken = response.body.accessToken;

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

//Route for sigin
describe("POST /api/auth/signin", () => {
  //test 1
  it("should login in the user and return 200", async () => {
    const response = await siginResponse(testUser.email, testUser.password);

    testUser.refreshToken = response.body.refreshToken;
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.accessToken).toBeDefined();
  });

  //test 2
  it("Return 422 if the sent data is invalid", async () => {
    const response = await siginResponse("test", testUser.password);

    expect(response.status).toBe(422);
    expect(response.body.success).toBe(false);
  });

  //test 3
  it("Return 404 if the user doesnot exist", async () => {
    const response = await siginResponse("test@gmail.com", testUser.password);

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });

  it("Return 401 if the password is incorrect", async () => {
    const response = await siginResponse(testUser.email, "testPassword");

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });
});

describe("POST /api/auth/resentOtp", () => {
  //test 1
  it("should resent Otp and return 200", async () => {
    const response = await resentOtpResponse(
      testUser.email,
      testUser.accessToken,
    );

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it("Return 400 if the user is already verified", async () => {
    await prisma.user.update({
      where: {
        id: testUser.id,
      },
      data: {
        verified: true,
      },
    });
    const response = await resentOtpResponse(
      testUser.email,
      testUser.accessToken,
    );

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});

describe("POST /api/auth/verifyEmail", () => {
  const rawOtp = "1234";
  const saltRounds = 10;

  beforeEach(async () => {
    await prisma.user.update({
      where: {
        id: testUser.id,
      },

      data: {
        verified: false,
      },
    });
  });
  beforeAll(async () => {
    await prisma.verificationCode.deleteMany({
      where: {
        userId: testUser.id,
      },
    });
    const hashedOtp = await bcrypt.hash(rawOtp, saltRounds);
    const oneHrFromNow = Date.now() + ONE_HOUR_MS;
    const otpDetails = await prisma.verificationCode.create({
      data: {
        code: hashedOtp,
        expiresAt: new Date(oneHrFromNow),
        userId: testUser.id,
      },
    });
    testUser.otpId = otpDetails.id;
  });

  //test 1
  it("Should verify the user", async () => {
    const response = await verifyEmailResponse(rawOtp, testUser.accessToken);
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  //test 2
  it("Return 400 if the otp is empty", async () => {
    const otp = "";
    const response = await verifyEmailResponse(otp, testUser.accessToken);
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  //test 3
  it("Return 404 if the otp is not stored in database", async () => {
    const wrongOtp = "2345";
    const response = await verifyEmailResponse(wrongOtp, testUser.accessToken);
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });

  //test 4
  it("Return 400 if the otp is expired", async () => {
    const oneHrBeforeNow = Date.now() - ONE_HOUR_MS;
    const hashedOtp = await bcrypt.hash(rawOtp, saltRounds);
    await prisma.verificationCode.create({
      data: {
        code: hashedOtp,
        userId: testUser.id,
        expiresAt: new Date(oneHrBeforeNow),
      },
    });
    const response = await verifyEmailResponse(rawOtp, testUser.accessToken);
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});

describe("POST /api/auth/logout", () => {
  //test1
  it("Should logout the use and give 200", async () => {
    const response = await logoutResponse(testUser.refreshToken);
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  //test 2
  it("Return 400 if the refresh token", async () => {
    const response = await logoutResponse("");
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});
