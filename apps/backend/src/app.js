const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const errorHandler = require('./infrastructure/middleware/global/errorHandler');

// Import Repositories
const UserSequelizeRepository = require('./infrastructure/repositories/implementations/UserSequelizeRepository');

// Import Adapters
const MockEmailAdapter = require('./infrastructure/adapters/notification/MockEmailAdapter');

// Import Services
const AuthService = require('./application/services/AuthService');
// (Other services would be imported here)

// Import Controllers
const AuthController = require('./presentation/controllers/AuthController');

// Import Routes
const authRoutes = require('./presentation/routes/authRoutes');

const app = express();

// 1. Global Middleware
app.use(helmet()); // Security Headers
app.use(cors()); // CORS
app.use(express.json({ limit: '10kb' })); // Body parser

// Rate Limiting
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Documentation Route
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 2. Dependency Injection / Composition Root
const userRepository = new UserSequelizeRepository();
const emailAdapter = new MockEmailAdapter();

const authService = new AuthService(userRepository, emailAdapter);
const authController = new AuthController(authService);

// 3. Routes
app.use('/api/auth', authRoutes(authController));

// Placeholder routes for structure completeness
app.get('/', (req, res) => res.send('API Running'));

// 4. Error Handling
app.all('*', (req, res, next) => {
  const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  err.statusCode = 404;
  next(err);
});

app.use(errorHandler);

module.exports = app;