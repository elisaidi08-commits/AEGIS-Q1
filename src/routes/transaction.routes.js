const { Router } = require('express');
const { body, query } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const transactionController = require('../controllers/transaction.controller');

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Transaction management and statistics
 */

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: List transactions (paginated, filterable)
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [credit, debit, transfer_in, transfer_out, cashback]
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [food, transport, shopping, entertainment, salary, transfer, subscription, other]
 *       - in: query
 *         name: date_from
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: date_to
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Paginated list of transactions
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticate, transactionController.getTransactions);

/**
 * @swagger
 * /api/transactions/stats:
 *   get:
 *     summary: Get spending statistics (by category, monthly)
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Transaction statistics
 *       401:
 *         description: Unauthorized
 */
router.get('/stats', authenticate, transactionController.getStats);

/**
 * @swagger
 * /api/transactions/{id}:
 *   get:
 *     summary: Get transaction details
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Transaction details
 *       404:
 *         description: Transaction not found
 */
router.get('/:id', authenticate, transactionController.getTransaction);

/**
 * @swagger
 * /api/transactions/transfer:
 *   post:
 *     summary: Send a bank transfer
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount, iban]
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 25.00
 *               iban:
 *                 type: string
 *                 example: "BE68 1234 5678 9012"
 *               description:
 *                 type: string
 *                 example: "Remboursement resto"
 *     responses:
 *       201:
 *         description: Transfer created
 *       400:
 *         description: Insufficient funds or validation error
 */
router.post('/transfer', authenticate, [
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('iban').trim().notEmpty().withMessage('IBAN is required'),
  body('description').optional().trim()
], validate, transactionController.transfer);

/**
 * @swagger
 * /api/transactions/request:
 *   post:
 *     summary: Request money from someone
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount, email]
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 15.00
 *               email:
 *                 type: string
 *                 format: email
 *                 example: ami@example.com
 *               description:
 *                 type: string
 *                 example: "Part pizza"
 *     responses:
 *       201:
 *         description: Payment request created
 */
router.post('/request', authenticate, [
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('description').optional().trim()
], validate, transactionController.requestMoney);

module.exports = router;
