const { db } = require('../config/database');

function centsToEuros(cents) {
  return Number((cents / 100).toFixed(2));
}

function eurosToCents(euros) {
  return Math.round(euros * 100);
}

function formatCard(card) {
  return {
    ...card,
    daily_limit: centsToEuros(card.daily_limit),
    monthly_limit: centsToEuros(card.monthly_limit),
    contactless_enabled: !!card.contactless_enabled,
    online_payments_enabled: !!card.online_payments_enabled
  };
}

function getAccountForUser(userId) {
  return db.prepare('SELECT id FROM accounts WHERE user_id = ?').get(userId);
}

exports.getCards = (req, res) => {
  const account = getAccountForUser(req.user.id);
  if (!account) {
    return res.status(404).json({
      success: false,
      error: { code: 'ACCOUNT_NOT_FOUND', message: 'No account found' }
    });
  }

  const cards = db.prepare('SELECT * FROM cards WHERE account_id = ?').all(account.id);

  res.json({
    success: true,
    data: cards.map(formatCard)
  });
};

exports.createCard = (req, res) => {
  const account = getAccountForUser(req.user.id);
  if (!account) {
    return res.status(404).json({
      success: false,
      error: { code: 'ACCOUNT_NOT_FOUND', message: 'No account found' }
    });
  }

  const last4 = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
  const maskedNumber = `**** **** **** ${last4}`;
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
  const year = new Date().getFullYear() + 3;
  const expiryDate = `${month}/${String(year).slice(-2)}`;

  const result = db.prepare(`
    INSERT INTO cards (account_id, type, card_number_masked, expiry_date)
    VALUES (?, 'virtual', ?, ?)
  `).run(account.id, maskedNumber, expiryDate);

  const card = db.prepare('SELECT * FROM cards WHERE id = ?').get(result.lastInsertRowid);

  // Notification
  db.prepare(`
    INSERT INTO notifications (user_id, type, title, message)
    VALUES (?, 'security', 'Nouvelle carte virtuelle', 'Votre carte virtuelle a été créée avec succès')
  `).run(req.user.id);

  res.status(201).json({
    success: true,
    data: formatCard(card)
  });
};

exports.updateCard = (req, res) => {
  const account = getAccountForUser(req.user.id);
  if (!account) {
    return res.status(404).json({
      success: false,
      error: { code: 'ACCOUNT_NOT_FOUND', message: 'No account found' }
    });
  }

  const card = db.prepare('SELECT * FROM cards WHERE id = ? AND account_id = ?').get(req.params.id, account.id);
  if (!card) {
    return res.status(404).json({
      success: false,
      error: { code: 'CARD_NOT_FOUND', message: 'Card not found' }
    });
  }

  const { daily_limit, monthly_limit, contactless_enabled, online_payments_enabled } = req.body;

  db.prepare(`
    UPDATE cards SET
      daily_limit = COALESCE(?, daily_limit),
      monthly_limit = COALESCE(?, monthly_limit),
      contactless_enabled = COALESCE(?, contactless_enabled),
      online_payments_enabled = COALESCE(?, online_payments_enabled)
    WHERE id = ?
  `).run(
    daily_limit != null ? eurosToCents(daily_limit) : null,
    monthly_limit != null ? eurosToCents(monthly_limit) : null,
    contactless_enabled != null ? (contactless_enabled ? 1 : 0) : null,
    online_payments_enabled != null ? (online_payments_enabled ? 1 : 0) : null,
    req.params.id
  );

  const updated = db.prepare('SELECT * FROM cards WHERE id = ?').get(req.params.id);

  res.json({
    success: true,
    data: formatCard(updated)
  });
};

exports.freezeCard = (req, res) => {
  const account = getAccountForUser(req.user.id);
  if (!account) {
    return res.status(404).json({
      success: false,
      error: { code: 'ACCOUNT_NOT_FOUND', message: 'No account found' }
    });
  }

  const card = db.prepare('SELECT * FROM cards WHERE id = ? AND account_id = ?').get(req.params.id, account.id);
  if (!card) {
    return res.status(404).json({
      success: false,
      error: { code: 'CARD_NOT_FOUND', message: 'Card not found' }
    });
  }

  if (card.status === 'blocked') {
    return res.status(400).json({
      success: false,
      error: { code: 'CARD_BLOCKED', message: 'Cannot freeze a blocked card' }
    });
  }

  const newStatus = card.status === 'frozen' ? 'active' : 'frozen';
  db.prepare('UPDATE cards SET status = ? WHERE id = ?').run(newStatus, req.params.id);

  const updated = db.prepare('SELECT * FROM cards WHERE id = ?').get(req.params.id);

  res.json({
    success: true,
    data: formatCard(updated)
  });
};

exports.blockCard = (req, res) => {
  const account = getAccountForUser(req.user.id);
  if (!account) {
    return res.status(404).json({
      success: false,
      error: { code: 'ACCOUNT_NOT_FOUND', message: 'No account found' }
    });
  }

  const card = db.prepare('SELECT * FROM cards WHERE id = ? AND account_id = ?').get(req.params.id, account.id);
  if (!card) {
    return res.status(404).json({
      success: false,
      error: { code: 'CARD_NOT_FOUND', message: 'Card not found' }
    });
  }

  db.prepare('UPDATE cards SET status = ? WHERE id = ?').run('blocked', req.params.id);

  const updated = db.prepare('SELECT * FROM cards WHERE id = ?').get(req.params.id);

  // Notification
  db.prepare(`
    INSERT INTO notifications (user_id, type, title, message)
    VALUES (?, 'security', 'Carte bloquée', 'Votre carte a été bloquée définitivement')
  `).run(req.user.id);

  res.json({
    success: true,
    data: formatCard(updated)
  });
};
