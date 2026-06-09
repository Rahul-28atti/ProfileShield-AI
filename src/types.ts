export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface ProfileDetails {
  platform: string;
  username: string;
  profileUrl: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  bio: string;
  hasProfilePic: boolean;
  // New realistic cybersecurity ML features:
  accountAge?: number; // in months
  engagementScore?: number; // 0.0 to 10.0
  postingConsistency?: number; // 0.0 to 10.0
}

export type VerdictType = 'SAFE' | 'SUSPICIOUS' | 'HIGH_RISK' | 'FRAUDULENT';

export interface FeatureImportanceItem {
  feature: string;
  importance: number;
  riskWeight: number;
  anomalyDetected: boolean;
}

export interface ScanResult {
  id: string;
  userId: string;
  username: string;
  platform: string;
  profileUrl: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  bio: string;
  hasProfilePic: boolean;
  trustScore: number;
  riskScore: number;
  verdict: VerdictType;
  explanation: string;
  createdAt: string;
  // Expanded forensic features
  accountAge?: number;
  engagementScore?: number;
  postingConsistency?: number;
  usernameEntropy?: number;
  bioQualityScore?: number;
  evidenceCollected?: string[]; // array of strings for collected proof
  modelTypeUsed?: string; // Random Forest / Decision Tree / Logistic Regression
  modelConfidence?: number; // percentage
}

export interface ActivityLog {
  id: string;
  userId: string;
  username: string;
  type: 'auth' | 'scan' | 'admin' | 'system';
  action: string;
  details: string;
  timestamp: string;
}

export interface DashboardStats {
  totalScans: number;
  fraudulentProfiles: number;
  highRiskProfiles: number; // added to group
  safeProfiles: number;
  suspiciousProfiles: number;
  averageRiskScore: number;
}

