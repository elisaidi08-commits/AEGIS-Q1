const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../config/database');

function centsToEuros(cents) {
  return cents / 100;
}

exports.register = (req, res) => {
  const { first_name, last_name, email, phone, password, date_of_birth, parent_email } = req.body;

  // Check if user already exists
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    return res.status(409).json({
      success: false,
      error: { code: 'EMAIL_EXISTS', message: 'An account with this email already exists' }
    });
  }

  // Calculate age
  const birth = new Date(date_of_birth);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;

  const is_minor = age < 18;

  if (is_minor && !parent_email) {
    return res.status(400).json({
      success: false,
      error: { code: 'PARENT_EMAIL_REQUIRED', message: 'Parent email is required for users under 18' }
    });
  }

  const password_hash = bcrypt.hashSync(password, 10);

  // Generate referral code
  const referralCode = `AEGIS-${first_name.toUpperCase().slice(0,3)}${Math.floor(Math.random() * 10000)}`;

  const insert = db.prepare(`
    INSERT INTO users (first_name, last_name, email, phone, password_hash, date_of_birth, is_minor, parent_email, referral_code)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = insert.run(first_name, last_name, email, phone || null, password_hash, date_of_birth, is_minor ? 1 : 0, is_minor ? parent_email : null, referralCode);

  // Create a default account with a fictional Belgian IBAN
  const ibanNum = String(Math.floor(Math.random() * 10000000000000000)).padStart(16, '0');
  const iban = `BE68 ${ibanNum.slice(0,4)} ${ibanNum.slice(4,8)} ${ibanNum.slice(8,12)} ${ibanNum.slice(12,16)}`;

  db.prepare('INSERT INTO accounts (user_id, iban, balance) VALUES (?, ?, 0)').run(result.lastInsertRowid, iban);

  const token = jwt.sign({ id: result.lastInsertRowid, email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

  res.status(201).json({
    success: true,
    data: {
      token,
      user: {
        id: result.lastInsertRowid,
        first_name,
        last_name,
        email,
        is_minor,
        referral_code: referralCode
      }
    }
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user) {
    return res.status(401).json({
      success: false,
      error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' }
    });
  }

  const valid = bcrypt.compareSync(password, user.password_hash);
  if (!valid) {
    return res.status(401).json({
      success: false,
      error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' }
    });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

  res.json({
    success: true,
    data: {
      token,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        avatar_url: user.avatar_url,
        language: user.language,
        referral_code: user.referral_code
      }
    }
  });
};

exports.refresh = (req, res) => {
  // Re-issue a new token from the current valid token
  const token = jwt.sign({ id: req.user.id, email: req.user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

  res.json({
    success: true,
    data: { token }
  });
};

exports.forgotPassword = (req, res) => {
  const { email } = req.body;

  const user = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  // Always return success to prevent email enumeration
  res.json({
    success: true,
    data: { message: 'If an account with this email exists, a reset link has been sent' }
  });
};

exports.logout = (req, res) => {
  db.prepare('INSERT OR IGNORE INTO blacklisted_tokens (token) VALUES (?)').run(req.token);

  res.json({
    success: true,
    data: { message: 'Logged out successfully' }
  });
};
