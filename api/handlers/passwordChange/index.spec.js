const MockedSocket = require("socket.io-mock");
const passport = require("passport");
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

describe("password change", () => {
  beforeEach(() => {
    mocks.sequelize.queryInterface.$clearResults();
    mocks.User.$queryInterface.$clearResults();

    models.mockImplementation(() => mocks);
  });

  it("can change password", async () => {
    const auth = {
      token:
        "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJxdXlldHZ1dnVAZ21haWwuY29tIiwiaXNzIjoiQ2Fycm90dCIsImV4cCI6MTYxNDMzMDMxMC4wODQsImF1ZCI6IkNhcnJvdHQiLCJuYmYiOjE2MTE3MzgzMDkuMDg1LCJpYXQiOjE2MTE3MzgzMTAuMDg1LCJqdGkiOiJhZjZiZjYzMC05YTc1LTRjZGYtOGU4ZC0yY2NiMDk2MWI1ZTAifQ.HSibE7fRNX_JTTSpMWkiKNTBLI-9YY-_c6cpcGaWOsZaKW-0PjDvzU1E7dwq944bg4QLX6xRwwv3QkCGHFS_Ng",
    };
    passport.authenticate = jest.fn((authType, options, callback) => () => {
      callback(null, { isAuthenticated: true, auth: true });
    });
    const response = await request
      .post("/api/v1/password-change")
      .set("Authorization", "bearer " + auth.token)
      .send({
        current_password: "TestPass",
        new_password: "TestPassword",
      });
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual(
      expect.objectContaining({ message: constants.PASSWORD_SUCCESS })
    );
  });

  // it("no reset bad email", async () => {
  //   const a = await request.post("/api/v1/password-reset").send({
  //     email: "bad@email.com",
  //   });
  //   expect(a.statusCode).toEqual(200);
  //   expect(a.body).toEqual(
  //     expect.objectContaining({ message: constants.EMAIL_SENT })
  //   );
  // });
});
