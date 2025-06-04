const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./users.db');

db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY,
  email TEXT UNIQUE,
  phone TEXT,
  password TEXT,
  wallet_address TEXT,
  wallet_seed TEXT,
  verification_code TEXT,
  verified INTEGER DEFAULT 0,
  totp_secret TEXT
)`);

db.run(`CREATE TABLE IF NOT EXISTS transactions (
  id INTEGER PRIMARY KEY,
  user_id INTEGER,
  tx_hash TEXT UNIQUE,
  amount REAL,
  currency TEXT,
  recipient TEXT,
  status TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
)`);

module.exports = db;
