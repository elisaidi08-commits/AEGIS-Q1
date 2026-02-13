const { Router } = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const savingsController = require('../controllers/savings.controller');

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Savings
 *   description: Savings goals management
 */

/**
 * @swagger
 * /api/savings:
 *   get:
 *     summary: List all savings goals
 *     tags: [Savings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of savings goals with progress
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticate, savingsController.getGoals);

/**
 * @swagger
 * /api/savings:
 *   post:
 *     summary: Create a new savings goal
 *     tags: [Savings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, target_amount]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Voyage Tokyo"
 *               target_amount:
 *                 type: number
 *                 example: 2500
 *               icon:
 *                 type: string
 *                 example: plane
 *               color:
 *                 type: string
 *                 example: "#34F288"
 *               deadline:
 *                 type: string
 *                 format: date
 *               auto_save_amount:
 *                 type: number
 *                 example: 50
 *               auto_save_enabled:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Savings goal created
 */
router.post('/', authenticate, [
  body('name').trim().notEmpty().withMessage('Goal name is required'),
  body('target_amount').isFloat({ min: 1 }).withMessage('Target amount must be at least 1€')
], validate, savingsController.createGoal);

/**
 * @swagger
 * /api/savings/{id}:
 *   put:
 *     summary: Update a savings goal
 *     tags: [Savings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               target_amount:
 *                 type: number
 *               icon:
 *                 type: string
 *               color:
 *                 type: string
 *               deadline:
 *                 type: string
 *                 format: date
 *               auto_save_amount:
 *                 type: number
 *               auto_save_enabled:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Savings goal updated
 *       404:
 *         description: Goal not found
 */
router.put('/:id', authenticate, savingsController.updateGoal);

/**
 * @swagger
 * /api/savings/{id}/deposit:
 *   post:
 *     summary: Add money to a savings goal
 *     tags: [Savings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount]
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 50
 *     responses:
 *       200:
 *         description: Deposit successful
 *       400:
 *         description: Insufficient funds
 */
router.post('/:id/deposit', authenticate, [
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0')
], validate, savingsController.deposit);

/**
 * @swagger
 * /api/savings/{id}/withdraw:
 *   post:
 *     summary: Withdraw money from a savings goal
 *     tags: [Savings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount]
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 25
 *     responses:
 *       200:
 *         description: Withdrawal successful
 *       400:
 *         description: Insufficient savings
 */
router.post('/:id/withdraw', authenticate, [
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0')
], validate, savingsController.withdraw);

/**
 * @swagger
 * /api/savings/{id}:
 *   delete:
 *     summary: Delete a savings goal (remaining funds returned to account)
 *     tags: [Savings]
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
 *         description: Goal deleted
 *       404:
 *         description: Goal not found
 */
router.delete('/:id', authenticate, savingsController.deleteGoal);

module.exports = router;
