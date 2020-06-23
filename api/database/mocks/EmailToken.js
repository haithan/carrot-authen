const data = {
  id: 4,
  email: "test@test.com",
  token: "stringValueGoesHere",
  expiration: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
  used: false,
};

module.exports = (dbMock) => {
  return dbMock.define("user_emailtokens", data);
};
