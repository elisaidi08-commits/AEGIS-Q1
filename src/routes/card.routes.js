const { Router } = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const cardController = require('../controllers/card.controller');

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Cards
 *   description: Card management (virtual and physical)
 */

/**
 * @swagger
 * /api/cards:
 *   get:
 *     summary: List all cards
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of cards
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticate, cardController.getCards);

/**
 * @swagger
 * /api/cards:
 *   post:
 *     summary: Create a new virtual card
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Virtual card created
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticate, cardController.createCard);

/**
 * @swagger
 * /api/cards/{id}:
 *   put:
 *     summary: Update card settings (limits, contactless, online payments)
 *     tags: [Cards]
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
 *               daily_limit:
 *                 type: number
 *                 example: 1000
 *               monthly_limit:
 *                 type: number
 *                 example: 5000
 *               contactless_enabled:
 *                 type: boolean
 *               online_payments_enabled:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Card updated
 *       404:
 *         description: Card not found
 */
router.put('/:id', authenticate, cardController.updateCard);

/**
 * @swagger
 * /api/cards/{id}/freeze:
 *   put:
 *     summary: Freeze or unfreeze a card
 *     tags: [Cards]
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
 *         description: Card freeze status toggled
 *       404:
 *         description: Card not found
 */
router.put('/:id/freeze', authenticate, cardController.freezeCard);

/**
 * @swagger
 * /api/cards/{id}/block:
 *   put:
 *     summary: Permanently block a card
 *     tags: [Cards]
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
 *         description: Card blocked permanently
 *       404:
 *         description: Card not found
 */
router.put('/:id/block', authenticate, cardController.blockCard);

module.exports = router;
