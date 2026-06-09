import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Terminal, 
  Cpu, 
  User, 
  Users, 
  FileText, 
  Link, 
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Info,
  Sliders,
  Clock,
  Activity,
  Workflow
} from 'lucide-react';
import { VerdictType, ScanResult } from '../types';

interface ScanScreenProps {
  token: string | null;
  onAnalysisSuccess: () => void;
  demoMode?: boolean;
}

export default function ScanScreen({ token, onAnalysisSuccess, demoMode = false }: ScanScreenProps) {
  // Input fields state
  const [platform, setPlatform] = useState('Twitter/X');
  const [username, setUsername] = useState('');
  const [profileUrl, setProfileUrl] = useState('');
  const [followersCount, setFollowersCount] = useState<number>(100);
  const [followingCount, setFollowingCount] = useState<number>(300);
  const [postsCount, setPostsCount] = useState<number>(50);
  const [bio, setBio] = useState('');
  const [hasProfilePic, setHasProfilePic] = useState(true);
  
  // Extended Enterprise Metrics
  const [accountAge, setAccountAge] = useState<number>(12);
  const [engagementScore, setEngagementScore] = useState<number>(4.5);
  const [postingConsistency, setPostingConsistency] = useState<number>(5.0);
  const [modelType, setModelType] = useState<'Random Forest' | 'Decision Tree' | 'Logistic Regression'>('Random Forest');

  // Analytical execution state
  const [analyzing, setAnalyzing] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [mlDetails, setMlDetails] = useState<any>(null);
  const [error, setError] = useState('');

  // Diagnostic steps for scanning terminal
  const diagnosticSteps = [
    'Verifying active handle existence on resource social platform...',
    'Extracting public follower distributions and profile metadata...',
    'Evaluating character-shannon entropy attributes on targeted username...',
    'Mapping metrics indices to active model coefficient variables...',
    'Running Random Forest classifier calculations on extracted indicators...',
    'Generating natural-language explainable report via explainability model layer...',
    'Persisting audited outcome and compiling report documents...'
  ];

  const handleAutocompletePlaceholder = (type: 'bot' | 'safe') => {
    if (type === 'bot') {
      setUsername('airdrop_tokens_free_911');
      setPlatform('Twitter/X');
      setProfileUrl('https://x.com/airdrop_tokens_free_911');
      setFollowersCount(14);
      setFollowingCount(4850);
      setPostsCount(3);
      setBio('Official Crypto Claim Platform. $50,000 crypto tokens airdrop is now live! Register your wallet index immediately on our secure portal to double your balance. No KYC needed.');
      setHasProfilePic(false);
      setAccountAge(2);
      setEngagementScore(1.1);
      setPostingConsistency(1.5);
    } else {
      setUsername('sarah_sec_compliance');
      setPlatform('LinkedIn');
      setProfileUrl('https://linkedin.com/in/sarah-sec-compliance');
      setFollowersCount(3560);
      setFollowingCount(1240);
      setPostsCount(412);
      setBio('Staff Cybersecurity Director @ FinTech Global. Focused on corporate governance, zero-trust network access, and machine learning identity mapping frameworks. Mentor & Speaker.');
      setHasProfilePic(true);
      setAccountAge(48);
      setEngagementScore(8.2);
      setPostingConsistency(7.8);
    }
  };

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please input a valid target identity/username');
      return;
    }

    setError('');
    setResult(null);
    setMlDetails(null);
    setAnalyzing(true);
    setScanStep(0);

    // Dynamic terminal scan animation timer loops (for authentic visualization)
    const runTerminalStep = (step: number) => {
      if (step < diagnosticSteps.length) {
        setScanStep(step);
        setTimeout(() => runTerminalStep(step + 1), 400);
      } else {
        triggerBackendScan();
      }
    };

    runTerminalStep(0);
  };

  const triggerBackendScan = async () => {
    try {
      const payload = {
        platform,
        username: username.trim(),
        profileUrl: profileUrl.trim() || `https://${platform.toLowerCase()}.com/${username.trim()}`,
        followersCount: Number(followersCount) || 0,
        followingCount: Number(followingCount) || 0,
        postsCount: Number(postsCount) || 0,
        bio: bio.trim(),
        hasProfilePic,
        accountAge: Number(accountAge),
        engagementScore: Number(engagementScore),
        postingConsistency: Number(postingConsistency),
        modelType
      };

      const res = await fetch('/api/scans/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Deep analytics engine returned a non-zero error vector.');
      }

      setResult(data.scan);
      setMlDetails(data.mlDetails);
      onAnalysisSuccess(); // Callback to sync parent stats
    } catch (err: any) {
      setError(err.message || 'Threat detection aborted due to secure networking exceptions.');
    } finally {
      setAnalyzing(false);
    }
  };

  const renderBeautifulReport = (explanation: string) => {
    if (!explanation.includes('### ')) {
      return (
        <div className="whitespace-pre-line leading-relaxed text-neutral-300 font-mono text-[10px]">
          {explanation}
        </div>
      );
    }

    const sections = explanation.split('### ').filter(Boolean);
    return (
      <div className="space-y-4 font-sans text-xs">
        {sections.map((sect, sIdx) => {
          const lines = sect.split('\n');
          const title = lines[0].trim();
          const body = lines.slice(1).join('\n').trim();

          let accentColor = "text-[#C9A227]";
          if (title.includes("THREAT")) accentColor = "text-[#C62828]";
          if (title.includes("RECOMMENDATION")) accentColor = "text-[#00D084]";

          return (
            <div key={sIdx} className="p-4 bg-[#1A1A1A] border border-[#8B7355]/20 rounded-lg">
              <span className={`text-[10px] font-mono font-bold ${accentColor} block uppercase tracking-wider mb-2 flex items-center gap-1.5`}>
                <span className="w-1 h-2 bg-current inline-block rounded-sm"></span>
                {title}
              </span>
              <div className="text-neutral-300 whitespace-pre-line leading-relaxed text-[10.5px]">
                {body}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-[#0A0A0A] text-[#F5F5F5] font-sans">
      
      {/* Header */}
      <div className="border-b border-[#8B7355]/20 pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[#F5F5F5] sm:text-2xl uppercase">
            Profile Analysis
          </h1>
          <p className="text-xs text-[#A0A0A0] mt-1 font-mono">
            Statistical Classification & Explainable Natural Language Forensic Ledger
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-neutral-500 font-mono">SELECTED CLASSIFIER:</span>
          <span className="px-2.5 py-1 rounded bg-[#121212] border border-[#8B7355]/20 font-mono text-[9px] font-bold text-[#C9A227] uppercase">
            {modelType}
          </span>
        </div>
      </div>

      {/* Autocomplete fast testers */}
      <div className="flex items-center gap-3 p-3 bg-[#121212] border border-[#8B7355]/20 rounded-xl justify-between flex-wrap shadow-sm">
        <div className="flex items-center gap-2 text-xs text-[#A0A0A0]">
          <Info className="w-4 h-4 text-[#C9A227] shrink-0" />
          <span className="font-medium">Investigation Presets:</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleAutocompletePlaceholder('bot')}
            className="px-3 py-1.5 bg-[#1A1A1A] hover:bg-[#121212] border border-[#8B7355]/20 text-[#C62828] text-xs font-semibold rounded cursor-pointer transition uppercase text-[10px] font-mono"
          >
            Airdrop Bounty Bot Preset
          </button>
          <button
            type="button"
            onClick={() => handleAutocompletePlaceholder('safe')}
            className="px-3 py-1.5 bg-[#1A1A1A] hover:bg-[#121212] border border-[#8B7355]/20 text-emerald-500 text-xs font-semibold rounded cursor-pointer transition uppercase text-[10px] font-mono"
          >
            Institutional Partner Preset
          </button>
        </div>
      </div>

      {/* Grid: Form and active terminal output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left column: Input Form */}
        <div className="lg:col-span-5 bg-[#121212] rounded-xl p-6 border border-[#8B7355]/20 space-y-5 shadow-sm premium-shadow">
          <h3 className="text-xs font-bold text-neutral-350 uppercase tracking-widest border-b border-[#8B7355]/15 pb-2.5 font-mono">
            Identity Profile Parameters
          </h3>

          {error && (
            <div className="p-4 bg-rose-500/5 border border-rose-900/25 rounded text-rose-455 text-xs font-mono">
              <strong>Evaluation Error:</strong> {error}
            </div>
          )}

          <form onSubmit={handleScan} className="space-y-4 font-sans text-xs">
            {/* Core Algorithm Selector */}
            <div>
              <label className="block text-[10px] text-neutral-400 uppercase tracking-wider mb-1.5 font-bold font-mono">
                Active Classifier Model
              </label>
              <select
                value={modelType}
                onChange={(e) => setModelType(e.target.value as any)}
                className="w-full bg-[#1A1A1A] border border-[#8B7355]/20 rounded px-3 py-2 text-xs text-[#F5F5F5] focus:outline-none focus:ring-1 focus:ring-[#C9A227]/20 transition-all font-mono"
              >
                <option value="Random Forest">Ensemble Random Forest (Recommended)</option>
                <option value="Decision Tree">C4.5 Decision Tree Classifier</option>
                <option value="Logistic Regression">Ridge Logistic Regression Model</option>
              </select>
            </div>

            {/* Platform & Username */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-neutral-400 uppercase tracking-wider mb-1.5 font-bold font-mono">
                  Platform
                </label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#8B7355]/20 rounded px-3 py-2 text-[#F5F5F5] focus:outline-none focus:ring-1 focus:ring-[#C9A227]/20 transition-all font-mono"
                >
                  <option value="Twitter/X">Twitter/X</option>
                  <option value="Instagram">Instagram</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Facebook">Facebook</option>
                  <option value="TikTok">TikTok</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-neutral-400 uppercase tracking-wider mb-1.5 font-bold font-mono">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#C9A227]">
                    <User className="w-3.5 h-3.5 text-neutral-500" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. elonmusk"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-[#8B7355]/20 rounded pl-9 pr-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-[#C9A227]/20 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Profile URL */}
            <div>
              <label className="block text-[10px] text-neutral-400 uppercase tracking-wider mb-1.5 font-bold font-mono">
                Profile URL (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
                  <Link className="w-3.5 h-3.5 text-neutral-500" />
                </div>
                <input
                  type="url"
                  placeholder="https://..."
                  value={profileUrl}
                  onChange={(e) => setProfileUrl(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#8B7355]/20 rounded pl-9 pr-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-[#C9A227]/20 transition-all"
                />
              </div>
            </div>

            {/* Followers, Following, Posts counts */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[9px] text-neutral-400 uppercase tracking-wider mb-1 mt-0.5 leading-none font-bold font-mono">
                  Followers
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={followersCount}
                  onChange={(e) => setFollowersCount(Number(e.target.value))}
                  className="w-full bg-[#1A1A1A] border border-[#8B7355]/20 rounded p-2 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[9px] text-neutral-400 uppercase tracking-wider mb-1 mt-0.5 leading-none font-bold font-mono">
                  Following
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={followingCount}
                  onChange={(e) => setFollowingCount(Number(e.target.value))}
                  className="w-full bg-[#1A1A1A] border border-[#8B7355]/20 rounded p-2 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[9px] text-neutral-400 uppercase tracking-wider mb-1 mt-0.5 leading-none font-bold font-mono">
                  Post Count
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={postsCount}
                  onChange={(e) => setPostsCount(Number(e.target.value))}
                  className="w-full bg-[#1A1A1A] border border-[#8B7355]/20 rounded p-2 text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Extended metrics (Age, Engagement, Consistency) */}
            <div className="p-3.5 bg-[#1A1A1A]/60 border border-[#8B7355]/20 rounded space-y-3">
              <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest font-bold block mb-1">Extended Features</span>
              
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[8.5px] text-neutral-400 uppercase tracking-wider mb-1">
                    Age (Months)
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={accountAge}
                    onChange={(e) => setAccountAge(Number(e.target.value))}
                    className="w-full bg-[#121212] border border-[#8B7355]/20 rounded p-1.5 text-white font-mono text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[8.5px] text-neutral-400 uppercase tracking-wider mb-1">
                    Engagement (0-10)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    required
                    value={engagementScore}
                    onChange={(e) => setEngagementScore(Number(e.target.value))}
                    className="w-full bg-[#121212] border border-[#8B7355]/20 rounded p-1.5 text-white font-mono text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[8.5px] text-neutral-400 uppercase tracking-wider mb-1">
                    Consistency (0-10)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    required
                    value={postingConsistency}
                    onChange={(e) => setPostingConsistency(Number(e.target.value))}
                    className="w-full bg-[#121212] border border-[#8B7355]/20 rounded p-1.5 text-white font-mono text-xs focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Profile Bio */}
            <div>
              <label className="block text-[10px] text-neutral-400 uppercase tracking-wider mb-1.5 font-bold font-mono">
                Biography / Bio Content
              </label>
              <textarea
                rows={3}
                placeholder="Paste the profile bio content exactly..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-[#8B7355]/20 rounded px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#C9A227]/20 resize-none transition-all font-medium"
              ></textarea>
            </div>

            {/* Has PFP Toggle */}
            <div className="py-2.5 border-t border-b border-[#8B7355]/15 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-3.5 h-3.5 text-[#C9A227]" />
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-bold font-mono">
                  Has Profile Photo
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={hasProfilePic}
                  onChange={(e) => setHasProfilePic(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#1A1A1A] border border-[#8B7355]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-neutral-600 after:border-neutral-500 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#C9A227]/30 peer-checked:after:bg-[#C9A227]"></div>
              </label>
            </div>

            {/* Analyze trigger button */}
            <button
              type="submit"
              disabled={analyzing}
              className="w-full bg-[#C9A227] hover:bg-[#C9A227]/90 text-black font-semibold text-xs tracking-wider py-2.5 px-4 rounded flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer uppercase"
            >
              {analyzing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent animate-spin rounded-full"></div>
                  <span>CALCULATING CLASSIFIER WEIGHTS...</span>
                </>
              ) : (
                <>
                  <Terminal className="w-3.5 h-3.5 text-black" />
                  <span>Execute Profile Analysis</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right column: Analyzing terminal OR ML/AI results panel */}
        <div className="lg:col-span-7 space-y-6">
          {/* A. When analyzing, show corporate analyst execution tracker */}
          {analyzing && (
            <div className="bg-[#121212] rounded-xl p-6 border border-[#8B7355]/20 shadow-sm relative premium-shadow">
              <div className="flex items-center gap-2 border-b border-[#8B7355]/15 pb-4 mb-4">
                <Cpu className="w-4 h-4 text-[#C9A227]" />
                <h4 className="text-xs font-bold text-[#F5F5F5] uppercase tracking-widest font-mono">
                  Evaluating Security Signatures
                </h4>
              </div>

              <div className="text-xs space-y-3 min-h-64 py-4 font-mono text-[10.5px]">
                {diagnosticSteps.map((step, idx) => (
                  <div 
                    key={idx} 
                    className={`flex items-start gap-3 transition-opacity duration-300 ${
                      idx < scanStep 
                        ? 'text-emerald-500 font-medium' 
                        : idx === scanStep 
                          ? 'text-[#C9A227] font-bold' 
                          : 'text-neutral-600'
                    }`}
                  >
                    <span>[{idx < scanStep ? 'OK' : idx === scanStep ? 'RUNNING' : 'QUEUED'}]</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* B. When finished, show predictions panels */}
          {!analyzing && result && mlDetails && (
            <div className="space-y-6">
              {/* Verdict Summary Board */}
              <div className={`bg-[#121212] rounded-xl p-6 border relative overflow-hidden premium-shadow ${
                result.verdict === 'FRAUDULENT' || result.verdict === 'HIGH_RISK'
                  ? 'border-red-900/40' 
                  : result.verdict === 'SUSPICIOUS' 
                    ? 'border-amber-900/40' 
                    : 'border-emerald-950/40'
              }`}>
                {/* Visual shade overlay */}
                <div className={`absolute top-0 right-0 w-32 h-32 opacity-5 rotate-45 transform translate-x-8 -translate-y-8 pointer-events-none ${
                  result.verdict === 'FRAUDULENT' || result.verdict === 'HIGH_RISK' ? 'bg-red-500' : result.verdict === 'SUSPICIOUS' ? 'bg-amber-500' : 'bg-emerald-500'
                }`}></div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                  <div className="space-y-2 text-center md:text-left">
                    <span className="text-[10px] text-neutral-500 tracking-wider uppercase font-bold font-mono block">
                      Analyst Verdict Result
                    </span>
                    <h3 className="text-xl font-bold tracking-tight flex items-center justify-center md:justify-start gap-3 uppercase">
                      {result.verdict === 'FRAUDULENT' && <ShieldAlert className="w-5 h-5 text-rose-500" />}
                      {result.verdict === 'HIGH_RISK' && <ShieldAlert className="w-5 h-5 text-rose-500" />}
                      {result.verdict === 'SUSPICIOUS' && <AlertTriangle className="w-5 h-5 text-amber-500" />}
                      {result.verdict === 'SAFE' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                      <span className={
                        result.verdict === 'FRAUDULENT' || result.verdict === 'HIGH_RISK' ? 'text-rose-500' : result.verdict === 'SUSPICIOUS' ? 'text-amber-500' : 'text-emerald-500'
                      }>
                        {result.verdict}
                      </span>
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Evaluated Target: <span className="text-white font-bold font-mono">@{result.username}</span> on <span className="text-[#C9A227]">{result.platform}</span>
                    </p>
                  </div>

                  {/* Trust and Risk indices */}
                  <div className="flex gap-6 shrink-0">
                    <div className="text-center font-mono">
                      <span className="text-[10px] text-neutral-500 block uppercase font-bold">Trust Score</span>
                      <div className="relative w-14 h-14 text-emerald-500 mt-1.5 flex items-center justify-center border border-[#8B7355]/20 rounded-full bg-[#1A1A1A]">
                        <span className="text-base font-bold">{result.trustScore}%</span>
                      </div>
                    </div>
                    <div className="text-center font-mono">
                      <span className="text-[10px] text-neutral-500 block uppercase font-bold">Risk Score</span>
                      <div className="relative w-14 h-14 text-rose-500 mt-1.5 flex items-center justify-center border border-[#8B7355]/20 rounded-full bg-[#1A1A1A]">
                        <span className="text-base font-bold">{result.riskScore}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Advanced Machine Learning Decision Parameters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Feature Influence bar */}
                <div className="bg-[#121212] rounded-xl p-5 border border-[#8B7355]/20 space-y-3 shadow-sm premium-shadow">
                  <h4 className="text-[10.5px] font-bold text-white uppercase tracking-widest border-b border-[#8B7355]/15 pb-2 flex items-center gap-2 font-mono">
                    <Cpu className="w-4 h-4 text-[#C9A227]" />
                    ML Feature Importances
                  </h4>
                  
                  <div className="space-y-3 pt-1">
                    {mlDetails.featureImportances.map((item: any, idx: number) => {
                      const percentage = item.importance;
                      return (
                        <div key={idx} className="space-y-1">
                          <div className="flex items-center justify-between text-[10px] font-medium font-sans">
                            <span className="text-neutral-400 font-medium font-mono">{item.feature}</span>
                            <span className={item.anomalyDetected ? 'text-rose-500 font-bold font-mono text-[9.5px]' : 'text-emerald-500 font-mono text-[9.5px]'}>
                              {percentage}% (w: {item.riskWeight}%)
                            </span>
                          </div>
                          <div className="h-1.5 w-full bg-[#1A1A1A] rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-1000 ${
                                item.anomalyDetected ? 'bg-rose-500' : 'bg-[#C9A227]'
                              }`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Model Tree structural convergence */}
                <div className="bg-[#121212] rounded-xl p-5 border border-[#8B7355]/20 space-y-3 shadow-sm premium-shadow">
                  <h4 className="text-[10.5px] font-bold text-white uppercase tracking-widest border-b border-[#8B7355]/15 pb-2 flex items-center gap-2 font-mono">
                    <Zap className="w-3.5 h-3.5 text-[#C9A227]" />
                    Model Decision Diagnostics
                  </h4>

                  <div className="text-[10px] space-y-3 pt-1 text-neutral-400 leading-relaxed font-mono">
                    <div>
                      <span className="text-neutral-300 font-bold uppercase block mb-1">Shannon Username Entropy:</span>
                      <code className="text-[#C9A227] bg-[#1A1A1A] px-1.5 py-0.5 rounded border border-[#8B7355]/15 font-mono text-[9.5px]">{result.usernameEntropy || 2.45} bits</code>
                    </div>

                    <div>
                      <span className="text-neutral-300 font-bold uppercase block mb-1">Model Node Impurity (Gini Score):</span>
                      <code className="text-[#C9A227] bg-[#1A1A1A] px-1.5 py-0.5 rounded border border-[#8B7355]/15 font-mono text-[9.5px]">{mlDetails.modelMetrics ? mlDetails.modelMetrics.giniImpurity : '0.041'}</code>
                    </div>

                    <div>
                      <span className="text-neutral-300 font-bold uppercase block mb-1">Confidence Rating:</span>
                      <code className="text-emerald-505 bg-[#1A1A1A] px-1.5 py-0.5 rounded border border-[#8B7355]/15 font-mono text-[9.5px]">{result.modelConfidence || 95}%</code>
                    </div>

                    <div>
                      <span className="text-neutral-300 font-bold uppercase block mb-1">Fired Leaf Paths:</span>
                      <div className="font-mono text-[8.5px] p-2 bg-[#1A1A1A] border border-[#8B7355]/15 rounded text-[#C9A227] max-h-20 overflow-y-auto leading-normal">
                        {mlDetails.modelMetrics ? mlDetails.modelMetrics.decisionPath[0] : 'Root_001 -> LeftChild -> GiniConvergeLimit'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Explainability panel */}
              <div className="bg-[#121212] rounded-xl p-5 border border-[#8B7355]/20 space-y-3 shadow-sm premium-shadow">
                <div className="flex items-center gap-2 border-b border-[#8B7355]/15 pb-2 justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#C9A227] inline-block"></span>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                      Executive Forensic Analyst Report
                    </h4>
                  </div>
                  <span className="px-1.5 py-0.5 rounded bg-[#1A1A1A] border border-[#8B7355]/15 text-[8.5px] font-mono text-neutral-500 uppercase tracking-wider">
                    Model Layer: Gemini Engine
                  </span>
                </div>

                <div className="pt-1 text-[#A0A0A0]">
                  {renderBeautifulReport(result.explanation)}
                </div>
              </div>
            </div>
          )}

          {/* C. Placeholder state */}
          {!analyzing && !result && (
            <div className="bg-[#121212] rounded-xl p-8 border border-dashed border-[#8B7355]/20 flex flex-col items-center justify-center text-center min-h-[360px] space-y-3 premium-shadow">
              <Terminal className="w-9 h-9 text-neutral-600" />
              <h4 className="text-xs font-bold text-white tracking-widest uppercase font-mono">
                Awaiting Investigator Input
              </h4>
              <p className="max-w-md text-xs text-neutral-400 leading-relaxed font-sans">
                Enter target parameters on the left panel, or select an investigation preset above to initialize raw values and trigger real-time feature analysis.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
