module.exports = {
  services: {
    chat: process.env.SERVICE_CHAT,
  },
  jwt: {
    privateKey: process.env.JWT_PRIVATE,
    publicKey: process.env.JWT_PUBLIC,
    server: process.env.JWT_SERVER,
  },
  db: {
    uri: process.env.DB_URI,
  },
  auth: {
    apple: {
      client_id: process.env.AUTH_APPLE_CLIENT,
      team_id: process.env.AUTH_APPLE_TEAM,
      callback_uri: process.env.AUTH_APPLE_CALLBACK,
      key_id: process.env.AUTH_APPLE_KEY_ID,
      key: process.env.AUTH_APPLE_KEY,
      scope: "email name",
    },
    facebook: {
      id: process.env.AUTH_FB_ID,
      secret: process.env.AUTH_FB_SECRET,
      callback: process.env.AUTH_FB_CALLBACK,
    },
    google: {
      id: process.env.AUTH_GOOG_ID,
      secret: process.env.AUTH_GOOG_SECRET,
      callback: process.env.AUTH_GOOG_CALLBACK,
    },
  },
};
