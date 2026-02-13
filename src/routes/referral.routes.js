const { Router } = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const referralController = require('../controllers/referral.controller');

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Referrals
 *   description: Referral program management
 */

/**
 * @swagger
 * /api/referrals:
 *   get:
 *     summary: Get my referrals and referral code
 *     tags: [Referrals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Referral list and code
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticate, referralController.getReferrals);

/**
 * @swagger
 * /api/referrals/invite:
 *   post:
 *     summary: Send a referral invitation (fictitious email)
 *     tags: [Referrals]
 *     security:
 *       - bearerAuth: []
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
 *                 example: ami@example.com
 *     responses:
 *       201:
 *         description: Invitation sent
 *       409:
 *         description: Email already invited
 */
router.post('/invite', authenticate, [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required')
], validate, referralController.invite);

module.exports = router;
