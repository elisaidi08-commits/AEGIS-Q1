const bcrypt = require('bcryptjs');
const { db } = require('../config/database');

exports.getProfile = (req, res) => {
  const user = db.prepare(`
    SELECT id, first_name, last_name, email, phone, date_of_birth, avatar_url, language, is_minor, parent_email, created_at, updated_at
    FROM users WHERE id = ?
  `).get(req.user.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      error: { code: 'USER_NOT_FOUND', message: 'User not found' }
    });
  }

  res.json({
    success: true,
    data: user
  });
};

exports.updateProfile = (req, res) => {
  const { first_name, last_name, avatar_url, language, phone } = req.body;

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  if (!user) {
    return res.status(404).json({
      success: false,
      error: { code: 'USER_NOT_FOUND', message: 'User not found' }
    });
  }

  db.prepare(`
    UPDATE users SET
      first_name = COALESCE(?, first_name),
      last_name = COALESCE(?, last_name),
      avatar_url = COALESCE(?, avatar_url),
      language = COALESCE(?, language),
      phone = COALESCE(?, phone),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(first_name || null, last_name || null, avatar_url || null, language || null, phone || null, req.user.id);

  const updated = db.prepare(`
    SELECT id, first_name, last_name, email, phone, date_of_birth, avatar_url, language, is_minor, parent_email, created_at, updated_at
    FROM users WHERE id = ?
  `).get(req.user.id);

  res.json({
    success: true,
    data: updated
  });
};

exports.changePassword = (req, res) => {
  const { current_password, new_password } = req.body;

  const user = db.prepare('SELECT password_hash FROM users WHERE id = ?').get(req.user.id);
  if (!user) {
    return res.status(404).json({
      success: false,
      error: { code: 'USER_NOT_FOUND', message: 'User not found' }
    });
  }

  const valid = bcrypt.compareSync(current_password, user.password_hash);
  if (!valid) {
    return res.status(400).json({
      success: false,
      error: { code: 'WRONG_PASSWORD', message: 'Current password is incorrect' }
    });
  }

  const password_hash = bcrypt.hashSync(new_password, 10);
  db.prepare('UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(password_hash, req.user.id);

  res.json({
    success: true,
    data: { message: 'Password updated successfully' }
  });
};

exports.deleteAccount = (req, res) => {
  db.prepare('DELETE FROM users WHERE id = ?').run(req.user.id);

  res.json({
    success: true,
    data: { message: 'Account deleted successfully' }
  });
};
