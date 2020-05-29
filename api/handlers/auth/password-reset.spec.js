const supertest = require("supertest");
const app = require("../../../api");
const request = supertest(app);
const User = require("../../database/models/User");

const sendMailMock = jest.fn();

jest.mock("nodemailer");
const nodemailer = require("nodemailer");
nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });

beforeEach(() => {
  sendMailMock.mockClear();
  nodemailer.createTransport.mockClear();
});

describe("password reset", () => {
  beforeAll(async () => {
    await User.drop();
    await User.sync();
    const user = await User.create({
      id: 3,
      email: "resetpw@test.com",
      encrypted_password:
        "$2b$10$YPkgX1jKlmhw/6dblCrrvu0uvZwJCWg9PYIKQIIeOBO0i7Uh/lOMa",
      isAdmin: true,
    });
    await user.save();
  });

  it("can reset", async () => {
    const a = await request.post("/password-reset").send({
      email: "resetpw@test.com",
    });
    expect(a.statusCode).toEqual(200);
    expect(a.body).toEqual(expect.objectContaining({ status: "ok" }));
    expect(sendMailMock).toHaveBeenCalled();
  });

  it("no reset bad email", async () => {
    const a = await request.post("/password-reset").send({
      email: "bad@email.com",
    });
    expect(a.statusCode).toEqual(200);
    expect(a.body).toEqual(expect.objectContaining({ status: "ok" }));
  });
});
