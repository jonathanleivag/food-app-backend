export default () => ({
  database: {
    URI_MONGO: process.env.URI_MONGO,
  },
  pusher: {
    API_ID_PUSHER: process.env.APP_ID_PUSHER,
    KEY_PUSHER: process.env.KEY_PUSHER,
    SECRET_PUSHER: process.env.SECRET_PUSHER,
    CLUSTER_PUSHER: process.env.CLUSTER_PUSHER,
  },
  jwt: {
    SECRET: process.env.JWT_SECRET,
  },
});
