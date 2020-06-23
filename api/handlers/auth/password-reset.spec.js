jest.mock("sequelize");
jest.mock("../../database/models");

const supertest = require("supertest");
const models = require("../../database/models");

const mocks = require("../../database/mocks")();
models.mockImplementation(() => mocks);

const app = require("../..");
const request = supertest(app);
const constants = require("../../constants");

const sendMailMock = jest.fn();

jest.mock("nodemailer");
const nodemailer = require("nodemailer");
nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });

beforeEach(() => {
  sendMailMock.mockClear();
  nodemailer.createTransport.mockClear();
});

describe("password reset", () => {
  beforeEach(() => {
    mocks.sequelize.queryInterface.$clearResults();
    mocks.User.$queryInterface.$clearResults();
    mocks.EmailToken.$queryInterface.$clearResults();
    mocks.ResetToken.$queryInterface.$clearResults();

    models.mockImplementation(() => mocks);
  });

  it("can reset", async () => {
    const a = await request.post("/password-reset").send({
      email: "test@test.com",
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
