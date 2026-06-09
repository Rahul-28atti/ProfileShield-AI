import fs from 'fs';
import path from 'path';
import { User, ScanResult, ActivityLog, DashboardStats } from '../src/types';

const DB_FILE = path.join(process.cwd(), 'database.json');

interface DbState {
  users: Array<User & { passwordHash: string }>;
  scans: ScanResult[];
  logs: ActivityLog[];
  sqlLogs: string[];
}

// Initial Sample Data (Bots, Fraudulent & Safe Accounts)
const INITIAL_USERS = [
  {
    id: 'admin-01',
    username: 'net_sentinel',
    email: 'admin@profileshield.ai',
    role: 'admin' as const,
    passwordHash: 'admin123', // Clean sample pwd
    createdAt: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'user-01',
    username: 'sec_analyst_adam',
    email: 'adam@profileshield.ai',
    role: 'user' as const,
    passwordHash: 'user123',
    createdAt: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString(),
  }
];

const INITIAL_SCANS: ScanResult[] = [
  {
    id: 'scan-1',
    userId: 'user-01',
    username: 'elon_musk_giveaway_airdrop',
    platform: 'Twitter/X',
    profileUrl: 'https://x.com/elon_musk_airdrop8392',
    followersCount: 142,
    followingCount: 3820,
    postsCount: 15,
    bio: 'Official ELON MUSK promotional account. Double your BTC and crypto instantly. Sending 0.1 BTC = you get 1.0 BTC immediately back! DM to participate.',
    hasProfilePic: true,
    trustScore: 4,
    riskScore: 96,
    verdict: 'FRAUDULENT',
    explanation: 'High confidence alert. Account username mimics a highly prominent corporate figure. Following to follower ratio is severely anomalous. Bio content contains explicit financial baiting and cryptocurrencies payout scams: "Double your crypto instantly". Profile exhibits classic bot automation behaviour.',
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
  {
    id: 'scan-2',
    userId: 'user-01',
    username: 'crypto_moon_shill',
    platform: 'Instagram',
    profileUrl: 'https://instagram.com/crypto_moon_shill',
    followersCount: 890,
    followingCount: 7500,
    postsCount: 120,
    bio: 'Passive income expert | Wealth accelerator creator. Let me trade binary options for you. Registered LLC. 100% daily profit guarantee. DM fast!',
    hasProfilePic: false,
    trustScore: 12,
    riskScore: 88,
    verdict: 'FRAUDULENT',
    explanation: 'Scikit-learn classified profile as fraudulent. Lacks a valid profile picture while conducting high-volume following activity. Binary options trading guarantees are a highly recurrent theme for financial fraud identity campaigns.',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'scan-3',
    userId: 'user-01',
    username: 'john_doe_tech',
    platform: 'LinkedIn',
    profileUrl: 'https://linkedin.com/in/john-doe-tech-28492a',
    followersCount: 1204,
    followingCount: 948,
    postsCount: 245,
    bio: 'Senior Cloud Architect at Global Systems Inc. Writing about Node.js, distributed databases, cyberdefense, and microservices architecture. Lifelong learner.',
    hasProfilePic: true,
    trustScore: 95,
    riskScore: 5,
    verdict: 'SAFE',
    explanation: 'This profile exhibits healthy metrics consistent with legitimate users. Balanced follower/following ratios, a professional and realistic career biography, normal posting density, and a valid profile photo indicate a safe profile identity.',
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
  },
  {
    id: 'scan-4',
    userId: 'user-01',
    username: 'mary_travels.02484',
    platform: 'Instagram',
    profileUrl: 'https://instagram.com/mary_travels.02484',
    followersCount: 45,
    followingCount: 980,
    postsCount: 4,
    bio: 'Beach lover 🌸 DM for collaborations! Only fans link below 👇',
    hasProfilePic: true,
    trustScore: 45,
    riskScore: 55,
    verdict: 'SUSPICIOUS',
    explanation: 'Account has low organic activity and high trailing numbers in username, typical of low-quality automation, and has an extremely low post counts compared to total followers outreach. Merits caution as potential spam account.',
    createdAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
  }
];

const INITIAL_LOGS: ActivityLog[] = [
  {
    id: 'log-1',
    userId: 'admin-01',
    username: 'net_sentinel',
    type: 'auth',
    action: 'USER_LOGIN',
    details: 'Administrator logged into ProfileShield console from endpoint 127.0.0.1.',
    timestamp: new Date(Date.now() - 3 * 3600 * 1000).toISOString()
  },
  {
    id: 'log-2',
    userId: 'user-01',
    username: 'sec_analyst_adam',
    type: 'scan',
    action: 'PROFILE_SCAN',
    details: 'Initiated deep ML scan for Twitter profile elon_musk_airdrop8392. Result: FRAUDULENT (96% risk).',
    timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
  }
];

class Database {
  private data: DbState;

  constructor() {
    this.data = {
      users: [],
      scans: [],
      logs: [],
      sqlLogs: []
    };
    this.load();
  }

  private load() {
    if (fs.existsSync(DB_FILE)) {
      try {
        const text = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(text);
        if (!this.data.sqlLogs) this.data.sqlLogs = [];
      } catch (err) {
        console.error("Error reading database file, resetting to defaults", err);
        this.resetToDefaults();
      }
    } else {
      this.resetToDefaults();
    }
  }

  private save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (e) {
      console.error("Error saving database file", e);
    }
  }

  private logSql(statement: string) {
    const formatted = `[${new Date().toISOString()}] SQLITE_EXEC: ${statement}`;
    this.data.sqlLogs.push(formatted);
    // Keep last 150 SQL logs to save memory
    if (this.data.sqlLogs.length > 150) {
      this.data.sqlLogs.shift();
    }
    this.save();
    console.log(formatted);
  }

  private resetToDefaults() {
    this.data = {
      users: [...INITIAL_USERS],
      scans: [...INITIAL_SCANS],
      logs: [...INITIAL_LOGS],
      sqlLogs: [
        `CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, username TEXT, email TEXT, role TEXT, password_hash TEXT, created_at TEXT);`,
        `CREATE TABLE IF NOT EXISTS scans (id TEXT PRIMARY KEY, user_id TEXT, username TEXT, platform TEXT, url TEXT, followers INTEGER, following INTEGER, posts INTEGER, bio TEXT, trust_score INTEGER, risk_score INTEGER, verdict TEXT, explanation TEXT, created_at TEXT);`,
        `CREATE TABLE IF NOT EXISTS system_logs (id TEXT PRIMARY KEY, user_id TEXT, username TEXT, type TEXT, action TEXT, details TEXT, timestamp TEXT);`,
        `INSERT INTO users VALUES ('admin-01', 'net_sentinel', 'admin@profileshield.ai', 'admin', '...', '...');`,
        `INSERT INTO users VALUES ('user-01', 'sec_analyst_adam', 'adam@profileshield.ai', 'user', '...', '...');`
      ]
    };
    this.save();
  }

  public getSqlLogs(): string[] {
    return this.data.sqlLogs;
  }

  // Users Auth Methods
  public getUsers() {
    this.logSql("SELECT id, username, email, role, created_at FROM users;");
    return this.data.users.map(({ passwordHash, ...u }) => u);
  }

  public getUserByEmail(email: string) {
    this.logSql(`SELECT * FROM users WHERE email = '${email.replace(/'/g, "''")}' LIMIT 1;`);
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public getUserById(id: string) {
    this.logSql(`SELECT * FROM users WHERE id = '${id}' LIMIT 1;`);
    return this.data.users.find(u => u.id === id);
  }

  public createUser(user: User & { passwordHash: string }) {
    this.logSql(`INSERT INTO users (id, username, email, role, password_hash, created_at) VALUES ('${user.id}', '${user.username}', '${user.email}', '${user.role}', '******', '${user.createdAt}');`);
    this.data.users.push(user);
    this.save();
    return user;
  }

  public deleteUser(id: string) {
    this.logSql(`DELETE FROM users WHERE id = '${id}';`);
    const initialLength = this.data.users.length;
    this.data.users = this.data.users.filter(u => u.id !== id);
    if (initialLength !== this.data.users.length) {
      this.save();
      return true;
    }
    return false;
  }

  // Profile Scan Methods
  public getScans() {
    this.logSql("SELECT * FROM scans ORDER BY created_at DESC;");
    return this.data.scans;
  }

  public getScansByUser(userId: string) {
    this.logSql(`SELECT * FROM scans WHERE user_id = '${userId}' ORDER BY created_at DESC;`);
    return this.data.scans.filter(s => s.userId === userId);
  }

  public addScan(scan: ScanResult) {
    this.logSql(`INSERT INTO scans (id, user_id, username, platform, url, followers, following, posts, bio, has_pfp, trust, risk, verdict, explanation, created_at) VALUES ('${scan.id}', '${scan.userId}', '${scan.username}', '${scan.platform}', '${scan.profileUrl}', ${scan.followersCount}, ${scan.followingCount}, ${scan.postsCount}, '...', ${scan.hasProfilePic}, ${scan.trustScore}, ${scan.riskScore}, '${scan.verdict}', '...', '${scan.createdAt}');`);
    this.data.scans.unshift(scan);
    this.save();
    return scan;
  }

  public deleteScan(scanId: string) {
    this.logSql(`DELETE FROM scans WHERE id = '${scanId}';`);
    const initialLength = this.data.scans.length;
    this.data.scans = this.data.scans.filter(s => s.id !== scanId);
    if (initialLength !== this.data.scans.length) {
      this.save();
      return true;
    }
    return false;
  }

  // Activity Log Methods
  public getLogs() {
    this.logSql("SELECT * FROM system_logs ORDER BY timestamp DESC LIMIT 100;");
    return this.data.logs;
  }

  public addLog(log: ActivityLog) {
    this.logSql(`INSERT INTO system_logs (id, user_id, username, type, action, details, timestamp) VALUES ('${log.id}', '${log.userId}', '${log.username}', '${log.type}', '${log.action}', '${log.details.replace(/'/g, "''")}', '${log.timestamp}');`);
    this.data.logs.unshift(log);
    // Limit to last 200 system logs
    if (this.data.logs.length > 200) {
      this.data.logs.pop();
    }
    this.save();
    return log;
  }

  // Dashboard Stats calculation
  public getStats(): DashboardStats {
    this.logSql("SELECT COUNT(*), verdict FROM scans GROUP BY verdict;");
    const scans = this.data.scans;
    const totalScans = scans.length;
    const fraudulentProfiles = scans.filter(s => s.verdict === 'FRAUDULENT').length;
    const highRiskProfiles = scans.filter(s => s.verdict === 'HIGH_RISK').length;
    const safeProfiles = scans.filter(s => s.verdict === 'SAFE').length;
    const suspiciousProfiles = scans.filter(s => s.verdict === 'SUSPICIOUS').length;
    
    const sumRisk = scans.reduce((acc, curr) => acc + curr.riskScore, 0);
    const averageRiskScore = totalScans > 0 ? Math.round(sumRisk / totalScans) : 0;

    return {
      totalScans,
      fraudulentProfiles,
      highRiskProfiles,
      safeProfiles,
      suspiciousProfiles,
      averageRiskScore
    };
  }
}

export const db = new Database();
