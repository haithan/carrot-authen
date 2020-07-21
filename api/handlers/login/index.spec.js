const MockedSocket = require("socket.io-mock");
jest.mock("../../models");
jest.mock("../../utils/notification", () => {
  return new MockedSocket();
});

const supertest = require("supertest");
const models = require("../../models");
const constants = require("../../constants");

const mocks = require("../../mocks")();
models.mockImplementation(() => mocks);

const app = require("../..");
const request = supertest(app);
models.mockImplementation(() => mocks);

describe("login", () => {
  beforeEach(() => {
    mocks.sequelize.queryInterface.$clearResults();
    mocks.User.$queryInterface.$clearResults();
    mocks.EmailToken.$queryInterface.$clearResults();
    mocks.ResetToken.$queryInterface.$clearResults();

    models.mockImplementation(() => mocks);
  });

  it("can login", async () => {
    const a = await request.post("/api/v1/login").send({
      email: "test@test.com",
      password: "TestPass",
    });
    expect(a.statusCode).toEqual(200);
    expect(a.body).toEqual(expect.objectContaining({ auth: true }));
  });

  it("can not login with bad email and password", async () => {
    const a = await request.post("/api/v1/login").send({
      email: "baduser@test.com",
      password: "BadPass",
    });
    expect(a.statusCode).toEqual(400);
    expect(a.body).toEqual(
      expect.objectContaining({ message: constants.INVALID_CREDENTIALS })
    );
  });

  it("can not login with bad password", async () => {
    const a = await request.post("/api/v1/login").send({
      email: "test5@test.com",
      password: "BadPass",
    });
    expect(a.statusCode).toEqual(400);
    expect(a.body).toEqual(
      expect.objectContaining({ message: constants.INVALID_CREDENTIALS })
    );
  });

  it("can cms login", async () => {
    const a = await request.post("/api/v1/login?cms=true").send({
      email: "test@test.com",
      password: "TestPass",
    });
    expect(a.statusCode).toEqual(200);
    expect(a.body).toEqual(expect.objectContaining({ auth: true }));
  });

  it("can not cms login", async () => {
    const data = {
      id: 4,
      email: "test@test.com",
      encrypted_password:
        "$2b$10$.S2/5iFdVmuTKIoxya4zIeqE8hcsidNg7WsflGejdf6CcvJ/rM/Ou",
      createdAt: new Date(),
      updatedAt: new Date(),
      verified: false,
      isAdmin: false,
      validatePassword: (password) => {
        return new Promise((resolve) => {
          if (password === "TestPass") resolve(true);
          else resolve(false);
        });
      },
    };
    await mocks.User.$queryInterface.$useHandler((query) => {
      if (query === "findOne") {
        return data;
      }
      return Promise.resolve();
    });
    await mocks.User.$queueResult(data);

    const a = await request.post("/api/v1/login?cms=true").send({
      email: "test@test.com",
      password: "TestPass",
    });
    expect(a.statusCode).toEqual(400);
    expect(a.body).toEqual(
      expect.objectContaining({ message: constants.INVALID_CREDENTIALS })
    );
  });

  it("can not cms login with bad email and password", async () => {
    const a = await request.post("/api/v1/login?cms=true").send({
      email: "bad@email.com",
      password: "badPass",
    });
    expect(a.statusCode).toEqual(400);
    expect(a.body).toEqual(
      expect.objectContaining({ message: constants.INVALID_CREDENTIALS })
    );
  });
});
