const { db } = require('../config/database');

function centsToEuros(cents) {
  return Number((cents / 100).toFixed(2));
}

function eurosToCents(euros) {
  return Math.round(euros * 100);
}

function formatGoal(goal) {
  return {
    ...goal,
    target_amount: centsToEuros(goal.target_amount),
    current_amount: centsToEuros(goal.current_amount),
    auto_save_amount: centsToEuros(goal.auto_save_amount),
    auto_save_enabled: !!goal.auto_save_enabled,
    progress: Number(((goal.current_amount / goal.target_amount) * 100).toFixed(1))
  };
}

exports.getGoals = (req, res) => {
  const goals = db.prepare('SELECT * FROM savings_goals WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);

  res.json({
    success: true,
    data: goals.map(formatGoal)
  });
};

exports.createGoal = (req, res) => {
  const { name, target_amount, icon, color, deadline, auto_save_amount, auto_save_enabled } = req.body;

  const result = db.prepare(`
    INSERT INTO savings_goals (user_id, name, target_amount, icon, color, deadline, auto_save_amount, auto_save_enabled)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    req.user.id,
    name,
    eurosToCents(target_amount),
    icon || 'target',
    color || '#34F288',
    deadline || null,
    auto_save_amount ? eurosToCents(auto_save_amount) : 0,
    auto_save_enabled ? 1 : 0
  );

  const goal = db.prepare('SELECT * FROM savings_goals WHERE id = ?').get(result.lastInsertRowid);

  res.status(201).json({
    success: true,
    data: formatGoal(goal)
  });
};

exports.updateGoal = (req, res) => {
  const goal = db.prepare('SELECT * FROM savings_goals WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!goal) {
    return res.status(404).json({
      success: false,
      error: { code: 'GOAL_NOT_FOUND', message: 'Savings goal not found' }
    });
  }

  const { name, target_amount, icon, color, deadline, auto_save_amount, auto_save_enabled } = req.body;

  db.prepare(`
    UPDATE savings_goals SET
      name = COALESCE(?, name),
      target_amount = COALESCE(?, target_amount),
      icon = COALESCE(?, icon),
      color = COALESCE(?, color),
      deadline = COALESCE(?, deadline),
      auto_save_amount = COALESCE(?, auto_save_amount),
      auto_save_enabled = COALESCE(?, auto_save_enabled)
    WHERE id = ?
  `).run(
    name || null,
    target_amount != null ? eurosToCents(target_amount) : null,
    icon || null,
    color || null,
    deadline || null,
    auto_save_amount != null ? eurosToCents(auto_save_amount) : null,
    auto_save_enabled != null ? (auto_save_enabled ? 1 : 0) : null,
    req.params.id
  );

  const updated = db.prepare('SELECT * FROM savings_goals WHERE id = ?').get(req.params.id);

  res.json({
    success: true,
    data: formatGoal(updated)
  });
};

exports.deposit = (req, res) => {
  const { amount } = req.body;

  const goal = db.prepare('SELECT * FROM savings_goals WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!goal) {
    return res.status(404).json({
      success: false,
      error: { code: 'GOAL_NOT_FOUND', message: 'Savings goal not found' }
    });
  }

  const account = db.prepare('SELECT * FROM accounts WHERE user_id = ?').get(req.user.id);
  if (!account) {
    return res.status(404).json({
      success: false,
      error: { code: 'ACCOUNT_NOT_FOUND', message: 'No account found' }
    });
  }

  const amountCents = eurosToCents(amount);

  if (account.balance < amountCents) {
    return res.status(400).json({
      success: false,
      error: { code: 'INSUFFICIENT_FUNDS', message: 'Insufficient funds' }
    });
  }

  const depositFn = db.transaction(() => {
    db.prepare('UPDATE accounts SET balance = balance - ? WHERE id = ?').run(amountCents, account.id);
    db.prepare('UPDATE savings_goals SET current_amount = current_amount + ? WHERE id = ?').run(amountCents, goal.id);

    db.prepare(`
      INSERT INTO transactions (account_id, type, amount, description, category, status)
      VALUES (?, 'debit', ?, ?, 'other', 'completed')
    `).run(account.id, amountCents, `Épargne : ${goal.name}`);
  });

  depositFn();

  const updated = db.prepare('SELECT * FROM savings_goals WHERE id = ?').get(req.params.id);

  res.json({
    success: true,
    data: formatGoal(updated)
  });
};

exports.withdraw = (req, res) => {
  const { amount } = req.body;

  const goal = db.prepare('SELECT * FROM savings_goals WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!goal) {
    return res.status(404).json({
      success: false,
      error: { code: 'GOAL_NOT_FOUND', message: 'Savings goal not found' }
    });
  }

  const amountCents = eurosToCents(amount);

  if (goal.current_amount < amountCents) {
    return res.status(400).json({
      success: false,
      error: { code: 'INSUFFICIENT_SAVINGS', message: 'Not enough savings in this goal' }
    });
  }

  const account = db.prepare('SELECT * FROM accounts WHERE user_id = ?').get(req.user.id);

  const withdrawFn = db.transaction(() => {
    db.prepare('UPDATE savings_goals SET current_amount = current_amount - ? WHERE id = ?').run(amountCents, goal.id);
    db.prepare('UPDATE accounts SET balance = balance + ? WHERE id = ?').run(amountCents, account.id);

    db.prepare(`
      INSERT INTO transactions (account_id, type, amount, description, category, status)
      VALUES (?, 'credit', ?, ?, 'other', 'completed')
    `).run(account.id, amountCents, `Retrait épargne : ${goal.name}`);
  });

  withdrawFn();

  const updated = db.prepare('SELECT * FROM savings_goals WHERE id = ?').get(req.params.id);

  res.json({
    success: true,
    data: formatGoal(updated)
  });
};

exports.deleteGoal = (req, res) => {
  const goal = db.prepare('SELECT * FROM savings_goals WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!goal) {
    return res.status(404).json({
      success: false,
      error: { code: 'GOAL_NOT_FOUND', message: 'Savings goal not found' }
    });
  }

  // If there's money left, return it to the account
  if (goal.current_amount > 0) {
    const account = db.prepare('SELECT * FROM accounts WHERE user_id = ?').get(req.user.id);
    db.prepare('UPDATE accounts SET balance = balance + ? WHERE id = ?').run(goal.current_amount, account.id);
  }

  db.prepare('DELETE FROM savings_goals WHERE id = ?').run(req.params.id);

  res.json({
    success: true,
    data: { message: 'Savings goal deleted successfully' }
  });
};
