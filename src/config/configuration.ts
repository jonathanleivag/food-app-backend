export default () => ({
  database: {
    URI_MONGO: process.env.URI_MONGO,
  },
  api: {
    URL_API: process.env.URL_API,
    EMAIL: process.env.EMAIL,
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
  mercadopago: {
    PUBLIC_KEY_MERCADOPAGO: process.env.PUBLIC_KEY_MERCADOPAGO,
    ACCESS_TOKEN_MERCADOPAGO: process.env.ACCESS_TOKEN_MERCADOPAGO,
    CLIENT_ID_MERCADOPAGO: process.env.CLIENT_ID_MERCADOPAGO,
    CLIENT_SECRET_MERCADOPAGO: process.env.CLIENT_SECRET_MERCADOPAGO,
  },
});
