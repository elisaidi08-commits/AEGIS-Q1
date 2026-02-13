const { db } = require('../config/database');

function centsToEuros(cents) {
  return Number((cents / 100).toFixed(2));
}

exports.getReferrals = (req, res) => {
  const referrals = db.prepare('SELECT * FROM referrals WHERE referrer_id = ? ORDER BY created_at DESC').all(req.user.id);

  // Generate a referral code for the user if they don't have one
  const user = db.prepare('SELECT first_name FROM users WHERE id = ?').get(req.user.id);
  const existingCode = db.prepare('SELECT referral_code FROM referrals WHERE referrer_id = ? LIMIT 1').get(req.user.id);
  const myCode = existingCode
    ? existingCode.referral_code.split('-').slice(0, 2).join('-') + '-' + Math.floor(Math.random() * 10000)
    : `AEGIS-${user.first_name.toUpperCase().slice(0, 3)}${Math.floor(Math.random() * 10000)}`;

  res.json({
    success: true,
    data: {
      referral_code: existingCode ? existingCode.referral_code : myCode,
      referrals: referrals.map(r => ({
        ...r,
        reward_amount: centsToEuros(r.reward_amount)
      })),
      total_earned: centsToEuros(
        referrals.filter(r => r.status === 'rewarded').reduce((sum, r) => sum + r.reward_amount, 0)
      )
    }
  });
};

exports.invite = (req, res) => {
  const { email } = req.body;

  // Check if already invited
  const existing = db.prepare('SELECT id FROM referrals WHERE referrer_id = ? AND referred_email = ?').get(req.user.id, email);
  if (existing) {
    return res.status(409).json({
      success: false,
      error: { code: 'ALREADY_INVITED', message: 'This email has already been invited' }
    });
  }

  const user = db.prepare('SELECT first_name FROM users WHERE id = ?').get(req.user.id);
  const code = `AEGIS-${user.first_name.toUpperCase().slice(0, 3)}${Math.floor(Math.random() * 10000)}`;

  const result = db.prepare(`
    INSERT INTO referrals (referrer_id, referred_email, referral_code)
    VALUES (?, ?, ?)
  `).run(req.user.id, email, code);

  res.status(201).json({
    success: true,
    data: {
      id: result.lastInsertRowid,
      referral_code: code,
      message: `Invitation sent to ${email}`
    }
  });
};
