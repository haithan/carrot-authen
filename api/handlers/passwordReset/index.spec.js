const MockedSocket = require("socket.io-mock");
jest.mock("../../models");
jest.mock("../../utils/notification", () => {
  return new MockedSocket();
});

const supertest = require("supertest");
const models = require("../../models");

const mocks = require("../../mocks")();
models.mockImplementation(() => mocks);

const app = require("../..");
const request = supertest(app);
const constants = require("../../constants");

describe("password reset", () => {
  beforeEach(() => {
    mocks.sequelize.queryInterface.$clearResults();
    mocks.User.$queryInterface.$clearResults();
    mocks.EmailToken.$queryInterface.$clearResults();
    mocks.ResetToken.$queryInterface.$clearResults();

    models.mockImplementation(() => mocks);
  });

  it("can reset", async () => {
    const a = await request.post("/api/v1/password-reset").send({
      email: "test@test.com",
    });
    expect(a.statusCode).toEqual(200);
    expect(a.body).toEqual(
      expect.objectContaining({ message: constants.EMAIL_SENT })
    );
  });

  it("no reset bad email", async () => {
    const a = await request.post("/api/v1/password-reset").send({
      email: "bad@email.com",
    });
    expect(a.statusCode).toEqual(200);
    expect(a.body).toEqual(
      expect.objectContaining({ message: constants.EMAIL_SENT })
    );
  });
});
