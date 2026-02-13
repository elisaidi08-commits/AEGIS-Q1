const { Router } = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const authController = require('../controllers/auth.controller');

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [first_name, last_name, email, password, date_of_birth]
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: Eli
 *               last_name:
 *                 type: string
 *                 example: Saïdi
 *               email:
 *                 type: string
 *                 format: email
 *                 example: eli@aegisbank.io
 *               phone:
 *                 type: string
 *                 example: "+32 470 12 34 56"
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: demo1234
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *                 example: "2003-10-08"
 *               parent_email:
 *                 type: string
 *                 format: email
 *                 description: Required if user is under 18
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email already exists
 */
router.post('/register', [
  body('first_name').trim().notEmpty().withMessage('First name is required'),
  body('last_name').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('date_of_birth').isISO8601().withMessage('Valid date of birth is required (ISO 8601)'),
  body('parent_email').optional().isEmail().withMessage('Valid parent email is required')
], validate, authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login and get a JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: eli@aegisbank.io
 *               password:
 *                 type: string
 *                 example: demo1234
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], validate, authController.login);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh JWT token
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: New token issued
 *       401:
 *         description: Unauthorized
 */
router.post('/refresh', authenticate, authController.refresh);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request a password reset (fictitious)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: eli@aegisbank.io
 *     responses:
 *       200:
 *         description: Reset link sent (fictitious)
 */
router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required')
], validate, authController.forgotPassword);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout and invalidate current token
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/logout', authenticate, authController.logout);

module.exports = router;
