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

describe("register", () => {
  beforeEach(() => {
    mocks.sequelize.queryInterface.$clearResults();
    mocks.User.$queryInterface.$clearResults();
    mocks.EmailToken.$queryInterface.$clearResults();
    mocks.ResetToken.$queryInterface.$clearResults();

    models.mockImplementation(() => mocks);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("can register", async () => {
    let i = 0;
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
        if (i === 0) {
          i++;
          return null;
        } else {
          return data;
        }
      }
      return Promise.resolve();
    });

    const a = await request.post("/api/v1/register").send({
      email: "test2@test.com",
      password: "TestPass",
    });
    expect(a.statusCode).toEqual(200);
    expect(a.body).toEqual(
      expect.objectContaining({ message: constants.USER_CREATED })
    );
  });

  it("no dupe", async () => {
    const a = await request.post("/api/v1/register").send({
      email: "test82369@test.com",
      password: "TestPass",
    });
    expect(a.statusCode).toEqual(400);
    expect(a.body).toEqual({ message: constants.EMAIL_ALREADY_EXISTS });
  });
});
