const supertest = require("supertest");
const app = require("../../../api");
const request = supertest(app);
const { User } = require("../../database/models")();
const constants = require("../../constants");

describe("login", () => {
  beforeAll(async () => {
    await User.drop();
    await User.sync();
    const user = await User.create({
      id: 2,
      email: "test5@test.com",
      encrypted_password:
        "$2b$10$YPkgX1jKlmhw/6dblCrrvu0uvZwJCWg9PYIKQIIeOBO0i7Uh/lOMa",
      isAdmin: true,
    });
    await user.save();
  });

  it("can login", async () => {
    const a = await request.post("/login").send({
      email: "test5@test.com",
      password: "TestPass",
    });
    expect(a.statusCode).toEqual(200);
    expect(a.body).toEqual(expect.objectContaining({ auth: true }));
  });

  it("can not login with bad email and password", async () => {
    const a = await request.post("/login").send({
      email: "baduser@test.com",
      password: "BadPass",
    });
    expect(a.statusCode).toEqual(400);
    expect(a.body).toEqual(
      expect.objectContaining({ message: constants.INVALID_CREDENTIALS })
    );
  });

  it("can not login with bad password", async () => {
    const a = await request.post("/login").send({
      email: "test5@test.com",
      password: "BadPass",
    });
    expect(a.statusCode).toEqual(400);
    expect(a.body).toEqual(
      expect.objectContaining({ message: constants.INVALID_CREDENTIALS })
    );
  });

  it("can cms login", async () => {
    const a = await request.post("/login?cms=true").send({
      email: "test5@test.com",
      password: "TestPass",
    });
    expect(a.statusCode).toEqual(200);
    expect(a.body).toEqual(expect.objectContaining({ auth: true }));
  });

  it("can not cms login", async () => {
    const a = await request.post("/login?cms=true").send({
      email: "test4@test.com",
      password: "TestPass",
    });
    expect(a.statusCode).toEqual(400);
    expect(a.body).toEqual(
      expect.objectContaining({ message: constants.INVALID_CREDENTIALS })
    );
  });

  it("can not cms login with bad email and password", async () => {
    const a = await request.post("/login?cms=true").send({
      email: "bad@email.com",
      password: "badPass",
    });
    expect(a.statusCode).toEqual(400);
    expect(a.body).toEqual(
      expect.objectContaining({ message: constants.INVALID_CREDENTIALS })
    );
  });
});
