require('dotenv').config();

const bcrypt = require('bcryptjs');
const { db, initializeDatabase } = require('../config/database');

// Helper: euros to cents
function e2c(euros) {
  return Math.round(euros * 100);
}

// Helper: date N days ago
function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

console.log('Seeding Aegis Bank database...\n');

// Initialize tables first
initializeDatabase();

// ── Clean existing data ──────────────────────────────
db.exec(`
  DELETE FROM notifications;
  DELETE FROM cashback_rewards;
  DELETE FROM referrals;
  DELETE FROM savings_goals;
  DELETE FROM transactions;
  DELETE FROM cards;
  DELETE FROM accounts;
  DELETE FROM blacklisted_tokens;
  DELETE FROM users;
`);

// ── 1. Create demo user ──────────────────────────────
const passwordHash = bcrypt.hashSync('demo1234', 10);

const userResult = db.prepare(`
  INSERT INTO users (first_name, last_name, email, phone, password_hash, date_of_birth, avatar_url, language, is_minor, parent_email)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(
  'Eli', 'Saïdi', 'eli@aegisbank.io', '+32 470 12 34 56',
  passwordHash, '2003-10-08', null, 'fr', 0, null
);

const userId = userResult.lastInsertRowid;
console.log(`✓ User created: Eli Saïdi (id: ${userId})`);

// ── 2. Create bank account ───────────────────────────
const accountResult = db.prepare(`
  INSERT INTO accounts (user_id, iban, balance, currency, status)
  VALUES (?, ?, ?, ?, ?)
`).run(userId, 'BE68 5390 0754 7034', e2c(1847.32), 'EUR', 'active');

const accountId = accountResult.lastInsertRowid;
console.log(`✓ Account created: BE68 5390 0754 7034 — 1 847,32 €`);

// ── 3. Create cards ──────────────────────────────────
db.prepare(`
  INSERT INTO cards (account_id, type, card_number_masked, expiry_date, status, daily_limit, monthly_limit, contactless_enabled, online_payments_enabled)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(accountId, 'virtual', '**** **** **** 7291', '09/28', 'active', e2c(500), e2c(2500), 1, 1);

db.prepare(`
  INSERT INTO cards (account_id, type, card_number_masked, expiry_date, status, daily_limit, monthly_limit, contactless_enabled, online_payments_enabled)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(accountId, 'physical', '**** **** **** 4289', '12/28', 'active', e2c(1000), e2c(5000), 1, 1);

console.log('✓ Cards created: 1 virtual + 1 physical');

// ── 4. Create transactions (30+ over 3 months) ──────
const insertTx = db.prepare(`
  INSERT INTO transactions (account_id, type, amount, currency, description, category, counterpart_name, counterpart_iban, status, created_at)
  VALUES (?, ?, ?, 'EUR', ?, ?, ?, ?, 'completed', ?)
`);

const transactions = [
  // Month 1 (≈80-90 days ago)
  { type: 'credit', amount: e2c(650), desc: 'Salaire — Carrefour Market', cat: 'salary', name: 'Carrefour Market SA', iban: 'BE71 0000 1234 5678', days: 85 },
  { type: 'debit', amount: e2c(10.99), desc: 'Spotify Premium', cat: 'subscription', name: 'Spotify AB', iban: 'SE35 5000 0000 0549', days: 83 },
  { type: 'debit', amount: e2c(13.49), desc: 'Netflix Standard', cat: 'subscription', name: 'Netflix International', iban: 'NL91 ABNA 0417 1643', days: 82 },
  { type: 'debit', amount: e2c(27.50), desc: 'Uber Eats — Chez Léon', cat: 'food', name: 'Uber Eats', iban: null, days: 80 },
  { type: 'debit', amount: e2c(62.30), desc: 'Courses Delhaize Ixelles', cat: 'food', name: 'Delhaize Group', iban: 'BE68 2100 0000 0001', days: 78 },
  { type: 'debit', amount: e2c(12.00), desc: 'Abonnement STIB mensuel', cat: 'transport', name: 'STIB-MIVB', iban: 'BE22 3100 0000 0005', days: 76 },
  { type: 'transfer_out', amount: e2c(25.00), desc: 'Remboursement ciné — Yasmine', cat: 'transfer', name: 'Yasmine Benali', iban: 'BE68 1234 5678 9012', days: 74 },
  { type: 'debit', amount: e2c(34.99), desc: 'Deliveroo — Pizza Hut', cat: 'food', name: 'Deliveroo Belgium', iban: null, days: 72 },
  { type: 'debit', amount: e2c(49.99), desc: 'Zalando — T-shirt + pantalon', cat: 'shopping', name: 'Zalando SE', iban: 'DE89 3704 0044 0532', days: 70 },
  { type: 'transfer_in', amount: e2c(15.00), desc: 'Part resto — Mehdi', cat: 'transfer', name: 'Mehdi Oukacha', iban: 'BE68 9876 5432 1098', days: 68 },

  // Month 2 (≈40-60 days ago)
  { type: 'credit', amount: e2c(650), desc: 'Salaire — Carrefour Market', cat: 'salary', name: 'Carrefour Market SA', iban: 'BE71 0000 1234 5678', days: 55 },
  { type: 'debit', amount: e2c(10.99), desc: 'Spotify Premium', cat: 'subscription', name: 'Spotify AB', iban: 'SE35 5000 0000 0549', days: 53 },
  { type: 'debit', amount: e2c(13.49), desc: 'Netflix Standard', cat: 'subscription', name: 'Netflix International', iban: 'NL91 ABNA 0417 1643', days: 52 },
  { type: 'debit', amount: e2c(18.70), desc: 'Uber Eats — Wok Away', cat: 'food', name: 'Uber Eats', iban: null, days: 50 },
  { type: 'debit', amount: e2c(75.40), desc: 'Courses Carrefour Woluwe', cat: 'food', name: 'Carrefour Hypermarché', iban: 'BE71 0000 9876 5432', days: 48 },
  { type: 'debit', amount: e2c(12.00), desc: 'Abonnement STIB mensuel', cat: 'transport', name: 'STIB-MIVB', iban: 'BE22 3100 0000 0005', days: 46 },
  { type: 'debit', amount: e2c(22.00), desc: 'Kinepolis Bruxelles — 2 places', cat: 'entertainment', name: 'Kinepolis Group', iban: 'BE76 0000 1122 3344', days: 44 },
  { type: 'transfer_out', amount: e2c(50.00), desc: 'Cadeau anniversaire — Amine', cat: 'transfer', name: 'Amine Derkaoui', iban: 'BE68 4567 8901 2345', days: 42 },
  { type: 'debit', amount: e2c(15.90), desc: 'Deliveroo — Pitaya', cat: 'food', name: 'Deliveroo Belgium', iban: null, days: 40 },
  { type: 'transfer_in', amount: e2c(30.00), desc: 'Remboursement Airbnb — Leïla', cat: 'transfer', name: 'Leïla Amrani', iban: 'BE68 6789 0123 4567', days: 38 },
  { type: 'debit', amount: e2c(89.99), desc: 'Nike Air Force 1 — JD Sports', cat: 'shopping', name: 'JD Sports Belgium', iban: 'BE55 0000 7788 9900', days: 36 },

  // Month 3 — current month (0-30 days ago)
  { type: 'credit', amount: e2c(650), desc: 'Salaire — Carrefour Market', cat: 'salary', name: 'Carrefour Market SA', iban: 'BE71 0000 1234 5678', days: 25 },
  { type: 'debit', amount: e2c(10.99), desc: 'Spotify Premium', cat: 'subscription', name: 'Spotify AB', iban: 'SE35 5000 0000 0549', days: 23 },
  { type: 'debit', amount: e2c(13.49), desc: 'Netflix Standard', cat: 'subscription', name: 'Netflix International', iban: 'NL91 ABNA 0417 1643', days: 22 },
  { type: 'debit', amount: e2c(42.50), desc: 'Courses Delhaize Saint-Gilles', cat: 'food', name: 'Delhaize Group', iban: 'BE68 2100 0000 0001', days: 20 },
  { type: 'debit', amount: e2c(12.00), desc: 'Abonnement STIB mensuel', cat: 'transport', name: 'STIB-MIVB', iban: 'BE22 3100 0000 0005', days: 18 },
  { type: 'debit', amount: e2c(31.20), desc: 'Uber Eats — Thaï Express', cat: 'food', name: 'Uber Eats', iban: null, days: 15 },
  { type: 'transfer_out', amount: e2c(10.00), desc: 'Café — Yasmine', cat: 'transfer', name: 'Yasmine Benali', iban: 'BE68 1234 5678 9012', days: 12 },
  { type: 'debit', amount: e2c(19.99), desc: 'Apple iCloud+ 200 Go', cat: 'subscription', name: 'Apple Distribution', iban: 'IE29 AIBK 9311 5212', days: 10 },
  { type: 'transfer_in', amount: e2c(40.00), desc: 'Remboursement courses — Mehdi', cat: 'transfer', name: 'Mehdi Oukacha', iban: 'BE68 9876 5432 1098', days: 8 },
  { type: 'debit', amount: e2c(24.90), desc: 'Deliveroo — Burger King', cat: 'food', name: 'Deliveroo Belgium', iban: null, days: 5 },
  { type: 'debit', amount: e2c(55.00), desc: 'FNAC — Écouteurs JBL', cat: 'shopping', name: 'FNAC Belgium', iban: 'BE44 0000 3344 5566', days: 3 },
  { type: 'cashback', amount: e2c(2.75), desc: 'Cashback — FNAC', cat: 'other', name: 'Aegis Cashback', iban: null, days: 3 },
  { type: 'cashback', amount: e2c(1.35), desc: 'Cashback — Zalando', cat: 'other', name: 'Aegis Cashback', iban: null, days: 2 },
];

const insertMany = db.transaction(() => {
  for (const tx of transactions) {
    insertTx.run(accountId, tx.type, tx.amount, tx.desc, tx.cat, tx.name, tx.iban || null, daysAgo(tx.days));
  }
});

insertMany();
console.log(`✓ ${transactions.length} transactions created`);

// ── 5. Cashback rewards ──────────────────────────────
// Find the FNAC and Zalando cashback transactions
const fnacCashback = db.prepare("SELECT id FROM transactions WHERE description LIKE '%Cashback — FNAC%' AND account_id = ?").get(accountId);
const zalandoCashback = db.prepare("SELECT id FROM transactions WHERE description LIKE '%Cashback — Zalando%' AND account_id = ?").get(accountId);

db.prepare('INSERT INTO cashback_rewards (user_id, transaction_id, amount, status) VALUES (?, ?, ?, ?)').run(userId, fnacCashback?.id || null, e2c(2.75), 'credited');
db.prepare('INSERT INTO cashback_rewards (user_id, transaction_id, amount, status) VALUES (?, ?, ?, ?)').run(userId, zalandoCashback?.id || null, e2c(1.35), 'credited');
db.prepare('INSERT INTO cashback_rewards (user_id, transaction_id, amount, status) VALUES (?, ?, ?, ?)').run(userId, null, e2c(0.90), 'pending');

console.log('✓ 3 cashback rewards created');

// ── 6. Savings goals ────────────────────────────────
db.prepare(`
  INSERT INTO savings_goals (user_id, name, target_amount, current_amount, icon, color, deadline, auto_save_amount, auto_save_enabled)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(userId, 'Voyage Tokyo', e2c(2500), e2c(780), 'plane', '#34F288', '2026-08-01', e2c(50), 1);

db.prepare(`
  INSERT INTO savings_goals (user_id, name, target_amount, current_amount, icon, color, deadline, auto_save_amount, auto_save_enabled)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(userId, 'MacBook Pro', e2c(1800), e2c(420), 'laptop', '#6366F1', '2026-12-01', e2c(0), 0);

console.log('✓ 2 savings goals created');

// ── 7. Referrals ─────────────────────────────────────
db.prepare(`
  INSERT INTO referrals (referrer_id, referred_email, referral_code, status, reward_amount)
  VALUES (?, ?, ?, ?, ?)
`).run(userId, 'yasmine.b@outlook.com', 'AEGIS-ELI2847', 'rewarded', e2c(5));

db.prepare(`
  INSERT INTO referrals (referrer_id, referred_email, referral_code, status, reward_amount)
  VALUES (?, ?, ?, ?, ?)
`).run(userId, 'mehdi.o@gmail.com', 'AEGIS-ELI5031', 'registered', e2c(5));

db.prepare(`
  INSERT INTO referrals (referrer_id, referred_email, referral_code, status, reward_amount)
  VALUES (?, ?, ?, ?, ?)
`).run(userId, 'amine.d@hotmail.com', 'AEGIS-ELI9174', 'pending', e2c(5));

console.log('✓ 3 referrals created');

// ── 8. Notifications ─────────────────────────────────
const insertNotif = db.prepare(`
  INSERT INTO notifications (user_id, type, title, message, is_read, created_at)
  VALUES (?, ?, ?, ?, ?, ?)
`);

const notifications = [
  { type: 'transaction', title: 'Salaire reçu', message: 'Vous avez reçu 650,00 € de Carrefour Market SA', read: 1, days: 25 },
  { type: 'security', title: 'Nouvelle connexion', message: 'Connexion détectée depuis Bruxelles, Belgique', read: 1, days: 22 },
  { type: 'savings', title: 'Épargne automatique', message: '50,00 € transférés vers "Voyage Tokyo"', read: 1, days: 20 },
  { type: 'transaction', title: 'Paiement effectué', message: 'Paiement de 42,50 € chez Delhaize Group', read: 1, days: 20 },
  { type: 'promo', title: 'Cashback activé !', message: 'Gagnez jusqu\'à 5% de cashback chez nos partenaires ce mois-ci', read: 0, days: 15 },
  { type: 'transaction', title: 'Virement envoyé', message: 'Virement de 10,00 € vers Yasmine Benali', read: 0, days: 12 },
  { type: 'system', title: 'Mise à jour des CGU', message: 'Nos conditions générales ont été mises à jour. Consultez-les dans l\'app.', read: 0, days: 10 },
  { type: 'savings', title: 'Objectif en vue !', message: 'Vous avez atteint 31% de votre objectif "Voyage Tokyo" 🎯', read: 0, days: 8 },
  { type: 'transaction', title: 'Cashback crédité', message: '2,75 € de cashback crédités pour votre achat FNAC', read: 0, days: 3 },
  { type: 'security', title: 'Rappel sécurité', message: 'Pensez à activer l\'authentification à deux facteurs pour protéger votre compte', read: 0, days: 1 },
];

const insertNotifMany = db.transaction(() => {
  for (const n of notifications) {
    insertNotif.run(userId, n.type, n.title, n.message, n.read ? 1 : 0, daysAgo(n.days));
  }
});

insertNotifMany();
console.log(`✓ ${notifications.length} notifications created`);

console.log('\n✅ Seed completed successfully!');
console.log('   Email: eli@aegisbank.io');
console.log('   Password: demo1234');
console.log('\nRun "npm run dev" to start the server.');

process.exit(0);
