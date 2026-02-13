const { db } = require('../config/database');

function centsToEuros(cents) {
  return Number((cents / 100).toFixed(2));
}

exports.getAccount = (req, res) => {
  const account = db.prepare('SELECT * FROM accounts WHERE user_id = ?').get(req.user.id);

  if (!account) {
    return res.status(404).json({
      success: false,
      error: { code: 'ACCOUNT_NOT_FOUND', message: 'No account found for this user' }
    });
  }

  res.json({
    success: true,
    data: {
      id: account.id,
      iban: account.iban,
      balance: centsToEuros(account.balance),
      currency: account.currency,
      status: account.status,
      created_at: account.created_at
    }
  });
};

exports.getSummary = (req, res) => {
  const account = db.prepare('SELECT * FROM accounts WHERE user_id = ?').get(req.user.id);

  if (!account) {
    return res.status(404).json({
      success: false,
      error: { code: 'ACCOUNT_NOT_FOUND', message: 'No account found for this user' }
    });
  }

  // Get current month boundaries
  const now = new Date();
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const lastOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();

  const expenses = db.prepare(`
    SELECT COALESCE(SUM(amount), 0) as total
    FROM transactions
    WHERE account_id = ? AND type IN ('debit', 'transfer_out') AND status = 'completed'
    AND created_at >= ? AND created_at <= ?
  `).get(account.id, firstOfMonth, lastOfMonth);

  const income = db.prepare(`
    SELECT COALESCE(SUM(amount), 0) as total
    FROM transactions
    WHERE account_id = ? AND type IN ('credit', 'transfer_in', 'cashback') AND status = 'completed'
    AND created_at >= ? AND created_at <= ?
  `).get(account.id, firstOfMonth, lastOfMonth);

  res.json({
    success: true,
    data: {
      balance: centsToEuros(account.balance),
      currency: account.currency,
      month_expenses: centsToEuros(expenses.total),
      month_income: centsToEuros(income.total)
    }
  });
};
