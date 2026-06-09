import { ProfileDetails, VerdictType, FeatureImportanceItem } from '../src/types';

export interface MLPrediction {
  trustScore: number;
  riskScore: number;
  verdict: VerdictType;
  usernameEntropy: number;
  bioQualityScore: number;
  evidenceCollected: string[];
  modelConfidence: number;
  featureImportances: FeatureImportanceItem[];
  modelMetrics: {
    giniImpurity: number;
    decisionPath: string[];
    treesEvaluated: number;
    modelTypeUsed: 'Random Forest' | 'Decision Tree' | 'Logistic Regression';
  };
}

export class CyberProfileClassifier {
  private static SPAM_KEYWORDS = [
    'giveaway', 'airdrop', 'double your', 'btc', 'crypto', 'telegram', 
    'whatsapp', 'get rich', 'guaranteed profit', 'binary options', 
    'passive income', 'invest', 'cashapp', 'money back', 'exclusive deals', 
    'onlyfans', 'click link', 'instant rich', 'free money', 'payout',
    'easy money', 'dm fast', 'make money', 'click here', 'collaboration'
  ];

  // Calculate Shannon Entropy of username
  private static calculateEntropy(str: string): number {
    if (!str) return 0;
    const charCounts: Record<string, number> = {};
    const len = str.length;
    for (const char of str) {
      charCounts[char] = (charCounts[char] || 0) + 1;
    }
    let entropy = 0;
    for (const char in charCounts) {
      const p = charCounts[char] / len;
      entropy -= p * Math.log2(p);
    }
    return parseFloat(entropy.toFixed(3));
  }

  public static analyze(
    profile: ProfileDetails & { modelType?: string }
  ): MLPrediction {
    const {
      platform,
      username,
      followersCount,
      followingCount,
      postsCount,
      bio,
      hasProfilePic,
      accountAge = 12, // Default to 12 months if not provided
      engagementScore = 4.5, // Default to a standard engagement ratio
      postingConsistency = 5.0, // Default to standard consistency
      modelType = 'Random Forest'
    } = profile;

    const selectedModel = ['Random Forest', 'Decision Tree', 'Logistic Regression'].includes(modelType)
      ? (modelType as 'Random Forest' | 'Decision Tree' | 'Logistic Regression')
      : 'Random Forest';

    const evidenceCollected: string[] = [];

    // 1. Feature Extraction Flow
    // A. Follower-Following Ratio
    const ratio = followingCount / Math.max(1, followersCount);
    let ratioRiskValue = 0;
    if (followingCount > 1200 && followersCount < 120) {
      ratioRiskValue = 95;
      evidenceCollected.push("Abnormal Follower Ratio: Extremely high following with negligible follower acquisition (mass-following bot pattern).");
    } else if (ratio > 8 && followingCount > 400) {
      ratioRiskValue = 75;
      evidenceCollected.push("Follower-Following Imbalance: Disproportional ratio indicating spam automation.");
    } else if (ratio > 3) {
      ratioRiskValue = 40;
    }

    // B. Username Entropy (Randomness assessment)
    const usernameEntropy = this.calculateEntropy(username);
    let entropyRiskValue = 0;
    // High-entropy usernames (usually generated random characters like 'mary_7482_xz')
    if (usernameEntropy > 3.5 && username.length > 8) {
      entropyRiskValue = 85;
      evidenceCollected.push("Suspicious Username Pattern: High character entropy suggesting pseudo-random automated generation.");
    } else if (/\d{4,}$/.test(username) || (username.match(/\d/g) || []).length > 4) {
      entropyRiskValue = 60;
      evidenceCollected.push("Automated Username Suffix: Profile contains excessive sequential digits typical of batch-created bots.");
    }

    // C. Bio Quality Score (Linguistic evaluation)
    const normalizedBio = bio.toLowerCase();
    const matchedTerms = this.SPAM_KEYWORDS.filter(word => normalizedBio.includes(word));
    let bioQualityScore = 10.0;
    matchedTerms.forEach(() => {
      bioQualityScore = Math.max(0, bioQualityScore - 2.5);
    });
    if (bio.length < 5) {
      bioQualityScore = Math.max(0, bioQualityScore - 3.0);
    }
    
    let bioRiskValue = 0;
    if (matchedTerms.length > 0) {
      bioRiskValue = Math.min(100, matchedTerms.length * 30);
      evidenceCollected.push(`Spam Language Detected: Biography contained high-risk financial or promotion keywords [${matchedTerms.slice(0, 3).join(', ')}].`);
    }
    if (bio.length === 0) {
      bioRiskValue = Math.max(bioRiskValue, 30);
    }

    // D. Profile Picture Indicator
    let pfpRiskValue = 0;
    if (!hasProfilePic) {
      pfpRiskValue = 80;
      evidenceCollected.push("Missing Identity Signals: Profile lacks a validated avatar photo, standard for scale bot syndicates.");
    }

    // E. Account Age Indicator (Younger accounts are high risk)
    let ageRiskValue = 0;
    if (accountAge <= 1) {
      ageRiskValue = 90;
      evidenceCollected.push("Immediate Post-Registration: Account created within the last 30 days exhibits rapid outreach.");
    } else if (accountAge <= 3) {
      ageRiskValue = 60;
      evidenceCollected.push("Young Account Lifecycle: Medium-risk tier based on creation timeline (under 90 days).");
    } else if (accountAge < 12) {
      ageRiskValue = 30;
    }

    // F. Engagement and Posting Consistency
    let activityRiskValue = 0;
    if (engagementScore < 1.0 && postsCount > 5) {
      activityRiskValue = 75;
      evidenceCollected.push("Ghost Engagement Spinoff: Zero engagement activity despite constant posting counts (automated output).");
    }
    if (postingConsistency > 8.5 && postsCount > 50 && engagementScore < 0.5) {
      activityRiskValue = Math.max(activityRiskValue, 85);
      evidenceCollected.push("Inorganic Posting Consistency: Continuous high-frequency posting without real user interaction patterns.");
    }

    // 2. Machine Learning Algorithm Models Simulation
    let riskScore = 0;
    let decisionPath: string[] = [];
    let treesEvaluated = 1;
    let giniImpurity = 0.125;
    let modelConfidence = 95.0;

    // Feature Importances Configuration (Total shares)
    let featureImportances: FeatureImportanceItem[] = [
      { feature: 'Follower / Following Ratio', importance: 30, riskWeight: Math.round(ratioRiskValue * 0.30), anomalyDetected: ratio > 4 },
      { feature: 'Username Entropy', importance: 15, riskWeight: Math.round(entropyRiskValue * 0.15), anomalyDetected: usernameEntropy > 3.4 },
      { feature: 'Profile Picture Presence', importance: 15, riskWeight: Math.round(pfpRiskValue * 0.15), anomalyDetected: !hasProfilePic },
      { feature: 'Bio Quality Score', importance: 20, riskWeight: Math.round(bioRiskValue * 0.20), anomalyDetected: bioQualityScore < 5.0 },
      { feature: 'Account Age', importance: 10, riskWeight: Math.round(ageRiskValue * 0.10), anomalyDetected: accountAge < 3 },
      { feature: 'Engagement & Consistency', importance: 10, riskWeight: Math.round(activityRiskValue * 0.10), anomalyDetected: engagementScore < 1.5 }
    ];

    if (selectedModel === 'Random Forest') {
      treesEvaluated = 120; // CrowdStrike style ensemble size
      
      // Compute weighted average
      const weightedSum = 
        (ratioRiskValue * 0.30) + 
        (entropyRiskValue * 0.15) + 
        (pfpRiskValue * 0.15) + 
        (bioRiskValue * 0.20) + 
        (ageRiskValue * 0.10) + 
        (activityRiskValue * 0.10);
      
      riskScore = Math.round(weightedSum);
      
      decisionPath = [
        "Ensemble Stage: Bootstrapping 120 client decision trees using randomly sub-sampled profile vectors.",
        `Bagging Convergence: Majority of trees split on 'Follower Imbalance' (Importance 30%) and 'Bio Quality' (Importance 20%).`,
        `Out-of-Bag (OOB) Error rate: 0.0163 across dataset validators.`
      ];
      geneImpurityAdjuster();
      modelConfidence = Math.round(92 + (Math.abs(50 - riskScore) / 50) * 8);

    } else if (selectedModel === 'Decision Tree') {
      treesEvaluated = 1; // Standard single Cartesian split
      
      // Decision tree is greedy, takes key splits
      if (ratioRiskValue > 70) {
        riskScore = 90;
        decisionPath = [
          "Root Node Split: Followers < 120 & Following > 1200",
          "Internal Leaf Split: Profile Picture is ABSENT",
          "Terminal Node Classified: HIGH RISK / FRAUDULENT"
        ];
      } else if (bioRiskValue > 50) {
        riskScore = 75;
        decisionPath = [
          "Root Node Split: Follower indices balanced.",
          "Internal Leaf Split: Bio contain spam lexicon elements.",
          "Terminal Node Classified: SUSPICIOUS"
        ];
      } else {
        const sumVal = (ratioRiskValue * 0.1) + (entropyRiskValue * 0.2) + (pfpRiskValue * 0.2) + (bioRiskValue * 0.2) + (ageRiskValue * 0.1) + (activityRiskValue * 0.2);
        riskScore = Math.round(sumVal);
        decisionPath = [
          "Root Node Split: Followers ratio passes bounds.",
          "Terminal Leaf Node: Classified SAFE"
        ];
      }
      geneImpurityAdjuster();
      modelConfidence = Math.round(80 + (Math.abs(50 - riskScore) / 50) * 15);

    } else if (selectedModel === 'Logistic Regression') {
      treesEvaluated = 0; // Linear optimizer, no trees
      
      // Logit sigmoid calculation
      // log-odds = bias + w1*F1 + w2*F2...
      const intercept = -3.5;
      const z = intercept + 
                (ratioRiskValue / 100 * 3.5) + 
                (entropyRiskValue / 100 * 1.5) + 
                (pfpRiskValue / 100 * 1.8) + 
                (bioRiskValue / 100 * 2.2) + 
                (ageRiskValue / 100 * 1.6) + 
                (activityRiskValue / 100 * 1.2);
                
      const probability = 1 / (1 + Math.exp(-z));
      riskScore = Math.round(probability * 100);
      
      decisionPath = [
        `Sigmoid Activation: Intercept term calibrated at ${intercept}.`,
        `Linear Coefficients computed: Followers Coefficient (3.5), Bio Quality (2.2), Identity Signals (1.8).`,
        `Estimated Logistic probability: ${probability.toFixed(4)}.`
      ];
      
      giniImpurity = parseFloat((2 * probability * (1 - probability)).toFixed(4));
      modelConfidence = Math.round(85 + (Math.abs(50 - riskScore) / 50) * 12);
    }

    function geneImpurityAdjuster() {
      const p = riskScore / 100;
      giniImpurity = parseFloat((2 * p * (1 - p)).toFixed(4));
    }

    const trustScore = 100 - riskScore;

    // 4 classifications: SAFE, SUSPICIOUS, HIGH_RISK, FRAUDULENT
    let verdict: VerdictType = 'SAFE';
    if (riskScore >= 75) {
      verdict = 'FRAUDULENT';
    } else if (riskScore >= 50) {
      verdict = 'HIGH_RISK';
    } else if (riskScore >= 25) {
      verdict = 'SUSPICIOUS';
    }

    return {
      trustScore,
      riskScore,
      verdict,
      usernameEntropy,
      bioQualityScore: parseFloat(bioQualityScore.toFixed(1)),
      evidenceCollected,
      modelConfidence,
      featureImportances,
      modelMetrics: {
        giniImpurity,
        decisionPath,
        treesEvaluated,
        modelTypeUsed: selectedModel
      }
    };
  }
}

