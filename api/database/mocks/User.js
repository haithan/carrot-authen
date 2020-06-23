const data = {
  id: 4,
  email: "test@test.com",
  encrypted_password:
    "$2b$10$.S2/5iFdVmuTKIoxya4zIeqE8hcsidNg7WsflGejdf6CcvJ/rM/Ou",
  createdAt: new Date(),
  updatedAt: new Date(),
  verified: false,
  isAdmin: true,
  validatePassword: (password) => {
    return new Promise((resolve) => {
      if (password === "TestPass") resolve(true);
      else resolve(false);
    });
  },
  setPassword: () => Promise.resolve(),
};

module.exports = (dbMock) => {
  return dbMock.define("user", data);
};
