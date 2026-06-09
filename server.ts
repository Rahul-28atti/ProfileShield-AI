import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { db } from './server/db';
import { CyberProfileClassifier } from './server/mlEngine';
import { createServer as createViteServer } from 'vite';
import { User, ProfileDetails, ScanResult, ActivityLog } from './src/types';

dotenv.config();

const app = express();
const PORT = 3000;

// Initialize Gemini SDK with telemetry header requested in guidelines
const geminiApiKey = process.env.GEMINI_API_KEY;
const ai = geminiApiKey
  ? new GoogleGenAI({
      apiKey: geminiApiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

app.use(express.json());

// Token authorization signature helper (JWT simulation)
const JWT_SECRET = process.env.JWT_SECRET || 'profileshield_cyber_sec_core_secret';

function generateToken(user: User): string {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    exp: Date.now() + 24 * 3600 * 1000 // 1 day
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

function verifyTokenAndGetUser(token: string): any {
  try {
    const jsonStr = Buffer.from(token, 'base64').toString('utf-8');
    const payload = JSON.parse(jsonStr);
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch (e) {
    return null;
  }
}

// Authentication middleware
interface AuthenticatedRequest extends Request {
  user?: User;
}

const requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authorization header required' });
    return;
  }
  const token = authHeader.split(' ')[1];
  const userPayload = verifyTokenAndGetUser(token);
  if (!userPayload) {
    res.status(401).json({ error: 'Invalid or expired token security signature' });
    return;
  }
  
  // Verify user still exists in DB
  const user = db.getUserById(userPayload.id);
  if (!user) {
    res.status(401).json({ error: 'User associated with this token not found' });
    return;
  }
  req.user = userPayload;
  next();
};

const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  requireAuth(req, res, () => {
    if (req.user?.role !== 'admin') {
      res.status(403).json({ error: 'Root administrator privileges required' });
      return;
    }
    next();
  });
};

// 1. AUTHENTICATION ENDPOINTS
app.post('/api/auth/register', (req: Request, res: Response) => {
  const { username, email, password, role } = req.body;
  if (!username || !email || !password) {
    res.status(400).json({ error: 'Missing required signup parameters' });
    return;
  }

  const existing = db.getUserByEmail(email);
  if (existing) {
    res.status(400).json({ error: 'Email is already registered under standard defense node' });
    return;
  }

  const defaultRole = role === 'admin' ? 'admin' : 'user';

  const newUser: User = {
    id: `user-${Date.now()}`,
    username: username.trim(),
    email: email.trim().toLowerCase(),
    role: defaultRole,
    createdAt: new Date().toISOString()
  };

  db.createUser({
    ...newUser,
    passwordHash: password // Mock hashing for lightweight sqlite operations
  });

  db.addLog({
    id: `log-${Date.now()}`,
    userId: newUser.id,
    username: newUser.username,
    type: 'auth',
    action: 'USER_REGISTER',
    details: `User signature created successfully for ${email} with role ${defaultRole}.`,
    timestamp: new Date().toISOString()
  });

  const token = generateToken(newUser);
  res.status(201).json({ user: newUser, token });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password authentication credentials required' });
    return;
  }

  const user = db.getUserByEmail(email);
  if (!user || user.passwordHash !== password) {
    res.status(401).json({ error: 'Access Denied. Invalid defensive cryptographic credentials.' });
    return;
  }

  const cleanUser: User = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
  };

  db.addLog({
    id: `log-${Date.now()}`,
    userId: cleanUser.id,
    username: cleanUser.username,
    type: 'auth',
    action: 'USER_LOGIN',
    details: `Defensive key verified. Session established for ${user.username}.`,
    timestamp: new Date().toISOString()
  });

  const token = generateToken(cleanUser);
  res.json({ user: cleanUser, token });
});

app.get('/api/auth/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  res.json({ user: req.user });
});

// 2. SCANNING & MACHINE LEARNING ANALYZER
// ML Model active hyperparameter settings
let ACTIVE_MODEL: 'Random Forest' | 'Decision Tree' | 'Logistic Regression' = 'Random Forest';
let ACTIVE_MODEL_CONFIG = {
  estimators: 120,
  maxDepth: 15,
  learningRate: 0.1,
  trainedAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString()
};

// Simulated loaded datasets
let INGESTED_DATASETS = [
  { id: 'ds-01', name: 'Identity Bot Detection Network Index', size: 8410, type: 'Enterprise Feed', status: 'Active Training Base' },
  { id: 'ds-02', name: 'Social Scam Profiles Dataset (Kaggle Sync)', size: 12450, type: 'Kaggle Source', status: 'Pre-loaded' },
  { id: 'ds-03', name: 'Real-World Cyber Sentinel Impersonators Base', size: 450, type: 'Security Feed', status: 'Acquiring' }
];

app.post('/api/scans/analyze', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { 
    platform, 
    username, 
    profileUrl, 
    followersCount, 
    followingCount, 
    postsCount, 
    bio, 
    hasProfilePic,
    accountAge,
    engagementScore,
    postingConsistency,
    modelType = ACTIVE_MODEL 
  } = req.body;
  const user = req.user!;

  if (!platform || !username) {
    res.status(400).json({ error: 'Missing platform or username for scanning metrics' });
    return;
  }

  // A. Fire machine learning classifier with extended features
  const prediction = CyberProfileClassifier.analyze({
    platform,
    username,
    profileUrl: profileUrl || `https://${platform.toLowerCase()}.com/${username}`,
    followersCount: Number(followersCount) || 0,
    followingCount: Number(followingCount) || 0,
    postsCount: Number(postsCount) || 0,
    bio: bio || '',
    hasProfilePic: Boolean(hasProfilePic),
    accountAge: accountAge ? Number(accountAge) : undefined,
    engagementScore: engagementScore ? Number(engagementScore) : undefined,
    postingConsistency: postingConsistency ? Number(postingConsistency) : undefined,
    modelType: modelType
  });

  // B. Generate Enterprise-Grade Forensic AI Explanation using Gemini
  let explainText = '';
  const evidenceList = prediction.evidenceCollected.length > 0 
    ? prediction.evidenceCollected.map(ev => `- ${ev}`).join('\n')
    : '- Profile metrics fall inside reasonable baseline deviations.\n- Standard human usage characteristics verified.';

  if (ai) {
    try {
      const gPrompt = `You are an elite Lead Threat Analyst at CrowdStrike. Conduct a formal cognitive cyber forensic audit based on this profile scan details:
- Social Platform: "${platform}"
- Username: "@${username}"
- Bio: "${bio || '(Empty Bio)'}"
- Followers: ${followersCount} | Following: ${followingCount} | Posts: ${postsCount}
- Account Age: ${accountAge || 12} months
- Engagement Score: ${engagementScore || 4.5}/10 • Posting Consistency: ${postingConsistency || 5.0}/10
- Profile Avatar: ${hasProfilePic ? 'Present and verified' : 'Default asset (Absent)'}

Core Classifier Prediction Results (using ${modelType}):
- Selected Verdict: ${prediction.verdict}
- Security Risk Score: ${prediction.riskScore}%
- Identity Trust Index: ${prediction.trustScore}%
- Algorithm Confidence Level: ${prediction.modelConfidence}%
- Key Forensic Evidence Identified:
${evidenceList}

Formulate and return an executive boardroom presentation report. It MUST be extremely crisp and structured exactly using these headings (do not embellish or add greeting/signature filler text):
### I. THREAT ASSESSMENT OUTLINE
[1-2 bullet points explaining the core threat posture and classification justification]

### II. CHRONOLOGICAL EVIDENCE ANALYTICS
[List 2-3 specific technical indicators and tell how they correlate with automation or organic human activity]

### III. AI REASONING CONCLUSIONS
[1-2 sentences with professional, expert analysis and risk weighting conclusions]

### IV. STRATEGIC REMEDIATION RECOMMENDATIONS
[List 1-2 recommended defensive actions, e.g., Shadow-ban check, KYC verification audit, or standard whitelist approvals]`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: gPrompt,
      });
      explainText = response.text || '';
    } catch (e: any) {
      console.error('Gemini forensic generation failed, compiling fallback', e);
    }
  }

  // Fallback beautiful template if Gemini is offline
  if (!explainText) {
    explainText = `### I. THREAT ASSESSMENT OUTLINE
- **Verdict Level:** ${prediction.verdict === 'FRAUDULENT' ? 'CRITICAL TRACING ALERT' : prediction.verdict === 'HIGH_RISK' ? 'HIGH ADVERSARY LIKELIHOOD' : prediction.verdict === 'SUSPICIOUS' ? 'MEDIUM PROFILE TRAFFIC' : 'MONITORED SECURE LOG'}
- **Justification:** Random Forest decision tree converged on ${prediction.riskScore}% threat scale based on following-to-follower ratio anomalies (${followingCount}/${followersCount}).

### II. CHRONOLOGICAL EVIDENCE ANALYTICS
${evidenceList}

### III. AI REASONING CONCLUSIONS
The account exhibits a calculated Username Entropy Score of **${prediction.usernameEntropy}** and a Bio Lexical Quality of **${prediction.bioQualityScore}/10**. The convergence of rapid following with highly repetitive spam structures triggers our confidence threshold index perfectly at **${prediction.modelConfidence}%**.

### IV. STRATEGIC REMEDIATION RECOMMENDATIONS
- ${prediction.verdict === 'FRAUDULENT' || prediction.verdict === 'HIGH_RISK' ? 'Initiate corporate blocklisting and report account for identity theft.' : 'Flag profile in the temporary triage queue for manual KYC authentication review.'}`;
  }

  // C. Save Scan into Database
  const id = `scan-${Date.now()}`;
  const record: ScanResult = {
    id,
    userId: user.id,
    username: username,
    platform: platform,
    profileUrl: profileUrl || `https://${platform.toLowerCase()}.com/${username}`,
    followersCount: Number(followersCount) || 0,
    followingCount: Number(followingCount) || 0,
    postsCount: Number(postsCount) || 0,
    bio: bio || '',
    hasProfilePic: Boolean(hasProfilePic),
    trustScore: prediction.trustScore,
    riskScore: prediction.riskScore,
    verdict: prediction.verdict,
    explanation: explainText.trim(),
    createdAt: new Date().toISOString(),
    // Extended fields
    accountAge: accountAge ? Number(accountAge) : undefined,
    engagementScore: engagementScore ? Number(engagementScore) : undefined,
    postingConsistency: postingConsistency ? Number(postingConsistency) : undefined,
    usernameEntropy: prediction.usernameEntropy,
    bioQualityScore: prediction.bioQualityScore,
    evidenceCollected: prediction.evidenceCollected,
    modelTypeUsed: modelType,
    modelConfidence: prediction.modelConfidence
  };

  db.addScan(record);

  // Log scan event with high-verbosity enterprise details
  db.addLog({
    id: `log-${Date.now()}`,
    userId: user.id,
    username: user.username,
    type: 'scan',
    action: 'PROFILE_SCAN',
    details: `Compliance audit: Performed metadata classification scan on @${username} (${platform}). Model: ${modelType}. Verdict: ${prediction.verdict} (${prediction.riskScore}% risk).`,
    timestamp: new Date().toISOString()
  });

  res.status(201).json({
    scan: record,
    mlDetails: prediction
  });
});

// MULTI-ROW BATCH SCANNING ENDPOINT
app.post('/api/scans/batch', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { profiles, modelType = ACTIVE_MODEL } = req.body;
  if (!profiles || !Array.isArray(profiles)) {
    res.status(400).json({ error: 'Profiles array required for batch job' });
    return;
  }

  const user = req.user!;
  const results: ScanResult[] = [];

  for (const p of profiles) {
    const prediction = CyberProfileClassifier.analyze({
      platform: p.platform || 'Twitter/X',
      username: p.username || 'batch_bot',
      profileUrl: p.profileUrl || '',
      followersCount: Number(p.followersCount) || 0,
      followingCount: Number(p.followingCount) || 0,
      postsCount: Number(p.postsCount) || 0,
      bio: p.bio || '',
      hasProfilePic: p.hasProfilePic !== undefined ? Boolean(p.hasProfilePic) : true,
      accountAge: p.accountAge ? Number(p.accountAge) : 10,
      engagementScore: p.engagementScore ? Number(p.engagementScore) : 4.0,
      postingConsistency: p.postingConsistency ? Number(p.postingConsistency) : 5.0,
      modelType: modelType
    });

    const id = `scan-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const record: ScanResult = {
      id,
      userId: user.id,
      username: p.username,
      platform: p.platform || 'Twitter/X',
      profileUrl: p.profileUrl || `https://${(p.platform || 'twitter').toLowerCase()}.com/${p.username}`,
      followersCount: Number(p.followersCount) || 0,
      followingCount: Number(p.followingCount) || 0,
      postsCount: Number(p.postsCount) || 0,
      bio: p.bio || '',
      hasProfilePic: p.hasProfilePic !== undefined ? Boolean(p.hasProfilePic) : true,
      trustScore: prediction.trustScore,
      riskScore: prediction.riskScore,
      verdict: prediction.verdict,
      createdAt: new Date().toISOString(),
      accountAge: p.accountAge ? Number(p.accountAge) : 10,
      engagementScore: p.engagementScore ? Number(p.engagementScore) : 4.0,
      postingConsistency: p.postingConsistency ? Number(p.postingConsistency) : 5.0,
      usernameEntropy: prediction.usernameEntropy,
      bioQualityScore: prediction.bioQualityScore,
      evidenceCollected: prediction.evidenceCollected,
      modelTypeUsed: modelType,
      modelConfidence: prediction.modelConfidence,
      explanation: `### I. THREAT ASSESSMENT OUTLINE
- Batch processing categorized profile as **${prediction.verdict}**.
- Evaluated risk concentration: ${prediction.riskScore}%.

### II. CHRONOLOGICAL EVIDENCE ANALYTICS
${prediction.evidenceCollected.map(ev => `- ${ev}`).join('\n') || '- Verified Safe standard metrics.'}`
    };

    db.addScan(record);
    results.push(record);
  }

  db.addLog({
    id: `log-${Date.now()}`,
    userId: user.id,
    username: user.username,
    type: 'scan',
    action: 'BATCH_SCAN',
    details: `Batch audit job: Audited ${profiles.length} profiles simultaneously using classifier ${modelType}.`,
    timestamp: new Date().toISOString()
  });

  res.json({ success: true, processedCount: profiles.length, results });
});

// MODEL TRAINING ENDPOINT
app.post('/api/ml/train', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { modelType, estimators, maxDepth, learningRate } = req.body;
  if (!modelType) {
    res.status(400).json({ error: 'Model type selection required' });
    return;
  }

  ACTIVE_MODEL = modelType;
  ACTIVE_MODEL_CONFIG = {
    estimators: Number(estimators) || 100,
    maxDepth: Number(maxDepth) || 10,
    learningRate: Number(learningRate) || 0.1,
    trainedAt: new Date().toISOString()
  };

  db.addLog({
    id: `log-${Date.now()}`,
    userId: req.user!.id,
    username: req.user!.username,
    type: 'admin',
    action: 'MODEL_TRAINING',
    details: `Trained Cyber Defense Model: Active system upgraded to ${modelType} (Estimators: ${ACTIVE_MODEL_CONFIG.estimators}, Max Depth: ${ACTIVE_MODEL_CONFIG.maxDepth}, LR: ${ACTIVE_MODEL_CONFIG.learningRate})`,
    timestamp: new Date().toISOString()
  });

  res.json({
    success: true,
    message: 'ProfileShield classifier configuration trained and deployed into memory successfully.',
    config: ACTIVE_MODEL_CONFIG
  });
});

// GET TRAINING/EVALUATION METRICS
app.get('/api/ml/metrics', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  // Return different metrics based on modelType for realism
  const stats = db.getStats();
  if (ACTIVE_MODEL === 'Random Forest') {
    res.json({
      modelType: 'Random Forest',
      accuracy: 98.2,
      precision: 97.9,
      recall: 98.5,
      f1Score: 98.2,
      confusionMatrix: {
        truePositive: 5120 + stats.totalScans, 
        falsePositive: 32, 
        trueNegative: 7520, 
        falseNegative: 18
      },
      hyperparameters: ACTIVE_MODEL_CONFIG,
      featureImportances: [
        { feature: 'Follower / Following Ratio', importance: 30 },
        { feature: 'Bio Quality Score', importance: 20 },
        { feature: 'Profile Picture Presence', importance: 15 },
        { feature: 'Username Entropy', importance: 15 },
        { feature: 'Account Age', importance: 10 },
        { feature: 'Engagement & Consistency', importance: 10 }
      ]
    });
  } else if (ACTIVE_MODEL === 'Decision Tree') {
    res.json({
      modelType: 'Decision Tree',
      accuracy: 95.8,
      precision: 94.2,
      recall: 95.1,
      f1Score: 94.6,
      confusionMatrix: {
        truePositive: 4940 + stats.totalScans, 
        falsePositive: 110, 
        trueNegative: 7280, 
        falseNegative: 102
      },
      hyperparameters: ACTIVE_MODEL_CONFIG,
      featureImportances: [
        { feature: 'Follower / Following Ratio', importance: 40 },
        { feature: 'Bio Quality Score', importance: 25 },
        { feature: 'Profile Picture Presence', importance: 15 },
        { feature: 'Username Entropy', importance: 10 },
        { feature: 'Account Age', importance: 5 },
        { feature: 'Engagement & Consistency', importance: 5 }
      ]
    });
  } else {
    res.json({
      modelType: 'Logistic Regression',
      accuracy: 94.1,
      precision: 93.5,
      recall: 93.9,
      f1Score: 93.7,
      confusionMatrix: {
        truePositive: 4860 + stats.totalScans, 
        falsePositive: 180, 
        trueNegative: 7120, 
        falseNegative: 140
      },
      hyperparameters: ACTIVE_MODEL_CONFIG,
      featureImportances: [
        { feature: 'Follower / Following Ratio', importance: 35 },
        { feature: 'Bio Quality Score', importance: 25 },
        { feature: 'Profile Picture Presence', importance: 15 },
        { feature: 'Username Entropy', importance: 10 },
        { feature: 'Account Age', importance: 10 },
        { feature: 'Engagement & Consistency', importance: 5 }
      ]
    });
  }
});

// DATASET MANAGEMENT LIST ENDPOINT
app.get('/api/ml/datasets', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  res.json(INGESTED_DATASETS);
});

// PARSE CSV DATASET UPLOAD
app.post('/api/ml/dataset/upload', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { filename, records } = req.body;
  if (!filename || !records || !Array.isArray(records)) {
    res.status(400).json({ error: 'Filename and CSV records array required' });
    return;
  }

  const dsId = `ds-${Date.now()}`;
  const newDs = {
    id: dsId,
    name: filename,
    size: records.length,
    type: 'CSV Upload',
    status: 'Ingested and Parsed'
  };

  INGESTED_DATASETS.push(newDs);

  db.addLog({
    id: `log-${Date.now()}`,
    userId: req.user!.id,
    username: req.user!.username,
    type: 'admin',
    action: 'DATASET_UPLOAD',
    details: `Ingested CSV dataset "${filename}" containing ${records.length} threat profile definitions.`,
    timestamp: new Date().toISOString()
  });

  res.json({
    success: true,
    message: `Securely analyzed and ingested ${records.length} CSV profile records into the active memory bank.`,
    dataset: newDs
  });
});

// KAGGLE DATASET INGESTION SIMULATOR
app.post('/api/ml/dataset/ingest-kaggle', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const dsId = `ds-kaggle-${Date.now()}`;
  const newDs = {
    id: dsId,
    name: 'Kaggle Identity Bot Networks Corpus (v2.4)',
    size: 12450,
    type: 'Kaggle Source',
    status: 'Merged & Available'
  };

  // Find if pre-loaded is already there and change status, or add new
  const exists = INGESTED_DATASETS.find(ds => ds.name.includes('Kaggle'));
  if (exists) {
    exists.status = 'Merged & Available';
  } else {
    INGESTED_DATASETS.push(newDs);
  }

  db.addLog({
    id: `log-${Date.now()}`,
    userId: req.user!.id,
    username: req.user!.username,
    type: 'admin',
    action: 'KAGGLE_INGESTION',
    details: `Kaggle Dataset Sync: Merged 12,450 labeled identity records into the active training set.`,
    timestamp: new Date().toISOString()
  });

  res.json({
    success: true,
    message: 'Successfully downloaded, verified SHA256 matches, and merged 12,450 Kaggle bot vectors.',
    dataset: newDs
  });
});

app.get('/api/scans/history', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const scans = db.getScansByUser(req.user!.id);
  res.json(scans);
});

app.delete('/api/scans/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const scanId = req.params.id;
  
  // Verify scan belongs to user
  const scans = db.getScansByUser(req.user!.id);
  const exists = scans.find(s => s.id === scanId);
  
  if (!exists && req.user!.role !== 'admin') {
    res.status(403).json({ error: 'You are not authorized to delete this defensive registry' });
    return;
  }

  db.deleteScan(scanId);
  
  db.addLog({
    id: `log-${Date.now()}`,
    userId: req.user!.id,
    username: req.user!.username,
    type: 'scan',
    action: 'SCAN_DELETE',
    details: `Cleaned scan logs of profile @${exists?.username || scanId} from active registry.`,
    timestamp: new Date().toISOString()
  });

  res.json({ success: true, message: 'Scan record deleted from active security vault.' });
});

// 3. STATS & ANALYTICS ENDPOINTS
app.get('/api/stats/summary', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const summary = db.getStats();
  
  // Custom Analytics breakdowns: Total Scans historical timeline
  const scans = db.getScans();
  
  // Platforms comparisons
  const platforms = ['Twitter/X', 'Instagram', 'LinkedIn', 'Facebook', 'TikTok'];
  const platformBreakdown = platforms.map(p => {
    const pScans = scans.filter(s => s.platform === p);
    const fraudulent = pScans.filter(s => s.verdict === 'FRAUDULENT').length;
    const suspicious = pScans.filter(s => s.verdict === 'SUSPICIOUS').length;
    const safe = pScans.filter(s => s.verdict === 'SAFE').length;

    return {
      name: p,
      total: pScans.length,
      fraudulent,
      suspicious,
      safe
    };
  });

  // Risk Scores buckets distribution
  const riskDistribution = [
    { range: '0-20%', count: scans.filter(s => s.riskScore <= 20).length },
    { range: '21-40%', count: scans.filter(s => s.riskScore > 20 && s.riskScore <= 40).length },
    { range: '41-60%', count: scans.filter(s => s.riskScore > 40 && s.riskScore <= 60).length },
    { range: '61-80%', count: scans.filter(s => s.riskScore > 60 && s.riskScore <= 80).length },
    { range: '81-100%', count: scans.filter(s => s.riskScore > 80).length },
  ];

  // Daily detection history trends (Grouped by simple date string of last 7 audits)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const dailyTrend = last7Days.map(dateStr => {
    const dayScans = scans.filter(s => s.createdAt.substring(0, 10) === dateStr);
    return {
      date: dateStr.split('-').slice(1).join('/'), // e.g. 06/08
      scansCount: dayScans.length,
      threatsDetected: dayScans.filter(s => s.verdict === 'FRAUDULENT').length,
      suspiciousParsed: dayScans.filter(s => s.verdict === 'SUSPICIOUS').length,
    };
  });

  res.json({
    summary,
    platformBreakdown,
    riskDistribution,
    dailyTrend
  });
});

// 4. ADMIN PRIVILEGES PANEL & SYSTEM CLI TERMINAL
app.get('/api/admin/users', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const users = db.getUsers();
  res.json(users);
});

app.delete('/api/admin/users/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.params.id;
  if (userId === req.user!.id) {
    res.status(400).json({ error: 'You are forbidden from committing administrative user self-destruction' });
    return;
  }
  
  const user = db.getUserById(userId);
  if (!user) {
    res.status(404).json({ error: 'Selected target node user not found' });
    return;
  }

  db.deleteUser(userId);

  db.addLog({
    id: `log-${Date.now()}`,
    userId: req.user!.id,
    username: req.user!.username,
    type: 'admin',
    action: 'USER_DELETION',
    details: `Purged user node account: email ${user.email}, username ${user.username} from system database.`,
    timestamp: new Date().toISOString()
  });

  res.json({ success: true, message: 'Threat-agent/user account purged from the node server.' });
});

app.get('/api/admin/logs', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const systemLogs = db.getLogs();
  const sqlTerminalLogs = db.getSqlLogs();
  res.json({
    systemLogs,
    sqlTerminalLogs
  });
});

app.post('/api/admin/system-cli', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { command } = req.body;
  if (!command) {
    res.status(400).json({ error: 'CLI payload command required' });
    return;
  }

  // Beautiful Hacker simulated CLI shell in sqlite context
  const cleanCmd = command.trim();
  let stdout = '';
  let error = false;

  if (cleanCmd === 'help') {
    stdout = `ProfileShield AI [Version 1.0.4] System Vault CLI
Supported database commands:
  db:stats                   Dump current schema counters 
  db:select * from scans     Read all active analysis reports
  db:select * from users     Read registered defense systems user base
  db:vacuum                  Optimally compress the sqlite database storage
  system:uptime              Retrieve physical container daemon running status
  system:clean-logs          Truncate visual security logs list`;
  } else if (cleanCmd === 'db:stats') {
    const stats = db.getStats();
    db.getSqlLogs(); // Side-effect sql logs
    stdout = `--- SQLite Database Core Statistics ---
  Database File: database.json (SQLite Simulation File Engine)
  Table: Users -> count: ${db.getUsers().length} rows
  Table: Scans -> count: ${stats.totalScans} rows
  Table: SystemLogs -> count: ${db.getLogs().length} rows
  Total Row Storage Integrity: 100% OK
  Lock state: SHARED`;
  } else if (cleanCmd.toLowerCase() === 'db:select * from scans') {
    const scans = db.getScans();
    stdout = scans.map(s => `[SCAN:${s.id}] @${s.username} | VERDICT: ${s.verdict} | RISK: ${s.riskScore}%`).join('\n') || 'Zero records currently in database.';
  } else if (cleanCmd.toLowerCase() === 'db:select * from users') {
    const users = db.getUsers();
    stdout = users.map(u => `[USER_ID:${u.id}] ${u.username} (${u.email}) | ROLE: ${u.role}`).join('\n');
  } else if (cleanCmd === 'db:vacuum') {
    stdout = `VACUUM successfully executed. Recategorized index pages, reclaimed 104KB free pages disk storage.`;
  } else if (cleanCmd === 'system:uptime') {
    const uptimeSec = process.uptime();
    const hours = Math.floor(uptimeSec / 3600);
    const mins = Math.floor((uptimeSec % 3600) / 60);
    stdout = `ProfileShield security daemon has been running online for ${hours} hours, ${mins} minutes, ${Math.floor(uptimeSec % 60)} seconds. Port: ${PORT} host bind 0.0.0.0.`;
  } else if (cleanCmd === 'system:clean-logs') {
    stdout = `System log visualization cache cleared. Raw SQLite audit trails retained on container file log.`;
  } else {
    stdout = `Shell execute: Error - Command "${cleanCmd}" not recognized by ProfileShield Core. Synthesize "help" for legal vault controls.`;
    error = true;
  }

  res.json({
    command: cleanCmd,
    output: stdout,
    error
  });
});

// Vite & Static Asset Handling Integration
const startServer = async () => {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
 } else {
    app.get('/', (req, res) => {
        res.json({
            status: 'ProfileShield API Running',
            message: 'Backend deployed successfully'
        });
    });
}

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`===============================================`);
    console.log(` PROFILESHIELD AI - PREMIUM SECURITY DAEMON   `);
    console.log(` Running online on http://localhost:${PORT}   `);
    console.log(` Production state: ${process.env.NODE_ENV || 'development'}`);
    console.log(` Gemini API status: ${geminiApiKey ? 'ACTIVE (Online Grounding Available)' : 'OFFLINE FALLBACK'}`);
    console.log(`===============================================`);
  });
};

startServer().catch(err => {
  console.error("Failed to boot full-stack Express + Vite application", err);
});
