const { Router } = require('express');
const { authenticate } = require('../middleware/auth');
const accountController = require('../controllers/account.controller');

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Accounts
 *   description: Bank account management
 */

/**
 * @swagger
 * /api/accounts:
 *   get:
 *     summary: Get account details (balance, IBAN, status)
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     iban:
 *                       type: string
 *                       example: "BE68 5390 0754 7034"
 *                     balance:
 *                       type: number
 *                       example: 1847.32
 *                     currency:
 *                       type: string
 *                       example: EUR
 *                     status:
 *                       type: string
 *                       enum: [active, frozen, closed]
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticate, accountController.getAccount);

/**
 * @swagger
 * /api/accounts/summary:
 *   get:
 *     summary: Get monthly summary (balance, expenses, income)
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Monthly summary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     balance:
 *                       type: number
 *                     currency:
 *                       type: string
 *                     month_expenses:
 *                       type: number
 *                     month_income:
 *                       type: number
 *       401:
 *         description: Unauthorized
 */
router.get('/summary', authenticate, accountController.getSummary);

module.exports = router;
