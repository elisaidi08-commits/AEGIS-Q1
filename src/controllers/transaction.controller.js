const { db } = require('../config/database');

function centsToEuros(cents) {
  return Number((cents / 100).toFixed(2));
}

function eurosToCents(euros) {
  return Math.round(euros * 100);
}

exports.getTransactions = (req, res) => {
  const account = db.prepare('SELECT id FROM accounts WHERE user_id = ?').get(req.user.id);
  if (!account) {
    return res.status(404).json({
      success: false,
      error: { code: 'ACCOUNT_NOT_FOUND', message: 'No account found' }
    });
  }

  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 20, 100);
  const offset = (page - 1) * limit;

  let where = 'WHERE account_id = ?';
  const params = [account.id];

  if (req.query.type) {
    where += ' AND type = ?';
    params.push(req.query.type);
  }
  if (req.query.category) {
    where += ' AND category = ?';
    params.push(req.query.category);
  }
  if (req.query.date_from) {
    where += ' AND created_at >= ?';
    params.push(req.query.date_from);
  }
  if (req.query.date_to) {
    where += ' AND created_at <= ?';
    params.push(req.query.date_to);
  }

  const total = db.prepare(`SELECT COUNT(*) as count FROM transactions ${where}`).get(...params).count;

  const transactions = db.prepare(`
    SELECT * FROM transactions ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?
  `).all(...params, limit, offset);

  res.json({
    success: true,
    data: transactions.map(t => ({
      ...t,
      amount: centsToEuros(t.amount)
    })),
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
};

exports.getTransaction = (req, res) => {
  const account = db.prepare('SELECT id FROM accounts WHERE user_id = ?').get(req.user.id);
  if (!account) {
    return res.status(404).json({
      success: false,
      error: { code: 'ACCOUNT_NOT_FOUND', message: 'No account found' }
    });
  }

  const transaction = db.prepare('SELECT * FROM transactions WHERE id = ? AND account_id = ?').get(req.params.id, account.id);
  if (!transaction) {
    return res.status(404).json({
      success: false,
      error: { code: 'TRANSACTION_NOT_FOUND', message: 'Transaction not found' }
    });
  }

  res.json({
    success: true,
    data: {
      ...transaction,
      amount: centsToEuros(transaction.amount)
    }
  });
};

exports.transfer = (req, res) => {
  const { amount, iban, description } = req.body;

  const account = db.prepare('SELECT * FROM accounts WHERE user_id = ?').get(req.user.id);
  if (!account) {
    return res.status(404).json({
      success: false,
      error: { code: 'ACCOUNT_NOT_FOUND', message: 'No account found' }
    });
  }

  if (account.status !== 'active') {
    return res.status(403).json({
      success: false,
      error: { code: 'ACCOUNT_INACTIVE', message: 'Account is not active' }
    });
  }

  const amountCents = eurosToCents(amount);

  if (account.balance < amountCents) {
    return res.status(400).json({
      success: false,
      error: { code: 'INSUFFICIENT_FUNDS', message: 'Insufficient funds' }
    });
  }

  const transferFn = db.transaction(() => {
    // Debit from sender
    db.prepare('UPDATE accounts SET balance = balance - ? WHERE id = ?').run(amountCents, account.id);

    const result = db.prepare(`
      INSERT INTO transactions (account_id, type, amount, description, category, counterpart_iban, status)
      VALUES (?, 'transfer_out', ?, ?, 'transfer', ?, 'completed')
    `).run(account.id, amountCents, description || 'Virement sortant', iban);

    // Create notification
    db.prepare(`
      INSERT INTO notifications (user_id, type, title, message)
      VALUES (?, 'transaction', 'Virement envoyé', ?)
    `).run(req.user.id, `Virement de ${amount}€ effectué`);

    return result.lastInsertRowid;
  });

  const txId = transferFn();

  const transaction = db.prepare('SELECT * FROM transactions WHERE id = ?').get(txId);

  res.status(201).json({
    success: true,
    data: {
      ...transaction,
      amount: centsToEuros(transaction.amount)
    }
  });
};

exports.requestMoney = (req, res) => {
  const { amount, email, description } = req.body;

  // Fictitious: just create a pending transaction
  const account = db.prepare('SELECT * FROM accounts WHERE user_id = ?').get(req.user.id);
  if (!account) {
    return res.status(404).json({
      success: false,
      error: { code: 'ACCOUNT_NOT_FOUND', message: 'No account found' }
    });
  }

  const amountCents = eurosToCents(amount);

  const result = db.prepare(`
    INSERT INTO transactions (account_id, type, amount, description, category, counterpart_name, status)
    VALUES (?, 'transfer_in', ?, ?, 'transfer', ?, 'pending')
  `).run(account.id, amountCents, description || 'Demande de paiement', email);

  res.status(201).json({
    success: true,
    data: {
      id: result.lastInsertRowid,
      message: `Payment request of ${amount}€ sent to ${email}`
    }
  });
};

exports.getStats = (req, res) => {
  const account = db.prepare('SELECT id FROM accounts WHERE user_id = ?').get(req.user.id);
  if (!account) {
    return res.status(404).json({
      success: false,
      error: { code: 'ACCOUNT_NOT_FOUND', message: 'No account found' }
    });
  }

  // Expenses by category (current month)
  const now = new Date();
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const byCategory = db.prepare(`
    SELECT category, SUM(amount) as total, COUNT(*) as count
    FROM transactions
    WHERE account_id = ? AND type IN ('debit', 'transfer_out') AND status = 'completed'
    AND created_at >= ?
    GROUP BY category
    ORDER BY total DESC
  `).all(account.id, firstOfMonth);

  // Monthly totals (last 6 months)
  const monthlyTotals = db.prepare(`
    SELECT
      strftime('%Y-%m', created_at) as month,
      SUM(CASE WHEN type IN ('credit', 'transfer_in', 'cashback') THEN amount ELSE 0 END) as income,
      SUM(CASE WHEN type IN ('debit', 'transfer_out') THEN amount ELSE 0 END) as expenses
    FROM transactions
    WHERE account_id = ? AND status = 'completed'
    GROUP BY strftime('%Y-%m', created_at)
    ORDER BY month DESC
    LIMIT 6
  `).all(account.id);

  res.json({
    success: true,
    data: {
      by_category: byCategory.map(c => ({
        category: c.category,
        total: centsToEuros(c.total),
        count: c.count
      })),
      monthly: monthlyTotals.map(m => ({
        month: m.month,
        income: centsToEuros(m.income),
        expenses: centsToEuros(m.expenses)
      }))
    }
  });
};
