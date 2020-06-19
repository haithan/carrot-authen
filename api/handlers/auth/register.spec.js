const supertest = require("supertest");
const app = require("../../../api");
const request = supertest(app);
const { User } = require("../../database/models")();
const constants = require("../../constants");

describe("register", () => {
  beforeAll(async () => {
    await User.drop();
    await User.sync();
    const user = await User.create({
      id: 5,
      email: "test5@test.com",
      encrypted_password:
        "$2b$10$YPkgX1jKlmhw/6dblCrrvu0uvZwJCWg9PYIKQIIeOBO0i7Uh/lOMa",
      isAdmin: true,
    });
    await user.save();
  });

  it("can register", async () => {
    const a = await request.post("/register").send({
      email: "test82369@test.com",
      password: "TestPass",
    });
    expect(a.statusCode).toEqual(200);
    expect(a.body).toEqual({ message: constants.USER_CREATED });
  });

  it("no dupe", async () => {
    const a = await request.post("/register").send({
      email: "test82369@test.com",
      password: "TestPass",
    });
    expect(a.statusCode).toEqual(400);
    expect(a.body).toEqual({ message: constants.EMAIL_ALREADY_EXISTS });
  });

  it("no reg with not a real email", async () => {
    const a = await request.post("/register").send({
      email: "notAnEmailAddress",
      password: "TestPass",
    });
    expect(a.statusCode).toEqual(400);
    expect(a.body).toEqual({ message: constants.VALIDATION_ERROR });
  });
});
