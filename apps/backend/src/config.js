require('dotenv').config();

module.exports = {
  app: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
  },
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    dialect: process.env.DB_DIALECT || 'postgres',
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
  integrations: {
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
    },
    pagomovil: {
      url: process.env.PAGOMOVIL_API_URL,
      key: process.env.PAGOMOVIL_API_KEY,
    }
  }
};