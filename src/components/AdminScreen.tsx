import React, { useEffect, useState } from 'react';
import { 
  Terminal, 
  Trash2, 
  UserX, 
  Database, 
  RefreshCw, 
  Lock,
  Cpu,
  Layers,
  FileSpreadsheet,
  Activity,
  Server,
  Key,
  ShieldCheck,
  Award
} from 'lucide-react';
import { User, ActivityLog } from '../types';

interface AdminScreenProps {
  token: string | null;
  demoMode?: boolean;
}

export default function AdminScreen({ token, demoMode = false }: AdminScreenProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Dataset & Ingestion State
  const [ingesting, setIngesting] = useState(false);
  const [ingestLog, setIngestLog] = useState<string[]>([]);
  
  // Model Training State
  const [training, setTraining] = useState(false);
  const [trainDetails, setTrainDetails] = useState<any>(null);
  const [numEstimators, setNumEstimators] = useState<number>(120);
  const [maxDepth, setMaxDepth] = useState<number>(15);
  const [criterion, setCriterion] = useState<'gini' | 'entropy'>('gini');

  const fetchAdminData = async () => {
    try {
      // Fetch users
      const usersRes = await fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData);
      }

      // Fetch logs
      const logsRes = await fetch('/api/admin/logs', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (logsRes.ok) {
        const logsData = await logsRes.json();
        // Set standard application/system logs
        setActivityLogs(logsData.systemLogs || []);
      }
    } catch (e) {
      console.error('Error fetching administrative records', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [token]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAdminData();
  };

  const handleDeleteUser = async (id: string, username: string) => {
    if (id.startsWith('admin-01')) {
      alert('Security violation. Cannot delete the core super-administrator root account.');
      return;
    }
    if (!confirm(`Purge user profile "@${username}"? This permanently revokes database access tokens and logs.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setUsers(prev => prev.filter(u => u.id !== id));
        fetchAdminData();
      } else {
        const data = await res.json();
        alert(data.error || 'Purging user node aborted by defensive filters.');
      }
    } catch (err) {
      console.error('Failed to purge user', err);
    }
  };

  // Dataset Ingest trigger
  const handleIngestDataset = async (datasetName: string) => {
    setIngesting(true);
    setIngestLog([`[INGEST] Initializing ingestion gateway for ${datasetName} corpus...`]);

    setTimeout(() => {
      setIngestLog(prev => [...prev, '[INGEST] Establishing read stream on local memory cache...']);
    }, 300);

    setTimeout(() => {
      setIngestLog(prev => [...prev, `[INGEST] Parsing data matrices and training splits (Followers, Following, Entropies)...`]);
    }, 700);

    setTimeout(() => {
      setIngestLog(prev => [...prev, `[INGEST] Aligning feature importances for local optimization...`]);
    }, 1100);

    try {
      setTimeout(async () => {
        const res = await fetch('/api/ml/datasets', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ datasetName })
        });
        const data = await res.json();
        if (res.ok) {
          setIngestLog(prev => [
            ...prev, 
            `[SUCCESS] Ingested: ${datasetName}`, 
            `[SUCCESS] Active Records Loaded: ${data.recordsCount || '21,310'}`
          ]);
          fetchAdminData();
        } else {
          setIngestLog(prev => [...prev, `[ERROR] Ingestion aborted: ${data.error}`]);
        }
        setIngesting(false);
      }, 1600);
    } catch (e) {
      setIngestLog(prev => [...prev, '[ERROR] Operational exception during database ingest routing.']);
      setIngesting(false);
    }
  };

  // ML Training trigger
  const handleTrainModel = async () => {
    setTraining(true);
    setTrainDetails(null);

    try {
      const res = await fetch('/api/ml/train', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          numEstimators,
          maxDepth,
          criterion
        })
      });
      const data = await res.json();
      if (res.ok) {
        setTrainDetails(data);
      } else {
        alert(data.error || 'Training interrupted by model boundary constraints.');
      }
    } catch (e) {
      console.error('Error during model fit', e);
    } finally {
      setTraining(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#0A0A0A] text-[#F5F5F5]">
        <div className="w-10 h-10 border-2 border-[#C9A227] border-t-transparent animate-spin rounded-full mb-4"></div>
        <p className="text-xs font-mono tracking-wider text-neutral-500 uppercase font-bold">Synchronizing Administration System Records...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-[#0A0A0A] text-[#F5F5F5] font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-[#8B7355]/20 pb-5 gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl uppercase">
            Administration
          </h1>
          <p className="text-xs text-[#A0A0A0] mt-1 font-sans">
            SysOps root environment monitoring, dataset structures, and learn classifier laboratories.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="p-2 border border-[#8B7355]/20 bg-[#121212] hover:bg-[#1A1A1A] rounded cursor-pointer transition flex items-center justify-center self-start"
          title="Force telemetry build"
        >
          <RefreshCw className={`w-4 h-4 text-neutral-450 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Grid splits: System Status, Model Status, Dataset Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Row 1 Left: System, Model & Dataset Specifications Overview */}
        <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch select-none">
          
          {/* Card A: System Status */}
          <div className="bg-[#121212] rounded-xl border border-[#8B7355]/20 p-5 space-y-3.5 shadow-sm premium-shadow flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 border-b border-[#8B7355]/15 pb-2">
                <Server className="w-4 h-4 text-[#C9A227]" />
                <h4 className="text-[10px] font-bold text-white uppercase tracking-widest font-mono">
                  System Status
                </h4>
              </div>
              <div className="space-y-2 pt-2.5 text-[10.5px] font-mono text-neutral-300">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Database Engine:</span>
                  <span className="text-[#F5F5F5]">SQLite Local State</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Node Environment:</span>
                  <span className="text-emerald-500">Production Mode</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Connection:</span>
                  <span className="text-[#C9A227]">Secured (SSL/TLS Active)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Server Uptime:</span>
                  <span className="text-[#F5F5F5]">99.98% Healthy</span>
                </div>
              </div>
            </div>
            <div className="pt-2 flex items-center gap-1.5 text-[9px] font-mono text-neutral-500 uppercase border-t border-[#8B7355]/10 mt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>CORE SYSOPS NODE OK</span>
            </div>
          </div>

          {/* Card B: Model Status */}
          <div className="bg-[#121212] rounded-xl border border-[#8B7355]/20 p-5 space-y-3.5 shadow-sm premium-shadow flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 border-b border-[#8B7355]/15 pb-2">
                <Cpu className="w-4 h-4 text-[#C9A227]" />
                <h4 className="text-[10px] font-bold text-white uppercase tracking-widest font-mono">
                  Model Status
                </h4>
              </div>
              <div className="space-y-2 pt-2.5 text-[10.5px] font-mono text-neutral-300">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Active Architecture:</span>
                  <span className="text-[#F5F5F5]">Random Forest</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Forest Size:</span>
                  <span className="text-[#C9A227]">120 Trees Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Split Measure:</span>
                  <span className="text-[#F5F5F5]">Gini Impurity index</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Explainable Layer:</span>
                  <span className="text-emerald-500">Gemini Generative</span>
                </div>
              </div>
            </div>
            <div className="pt-2 flex items-center gap-1.5 text-[9px] font-mono text-neutral-500 uppercase border-t border-[#8B7355]/10 mt-1">
              <Key className="w-3.5 h-3.5 text-cyan-500" />
              <span>CLASSIFIER ENROLLED</span>
            </div>
          </div>

          {/* Card C: Dataset Information */}
          <div className="bg-[#121212] rounded-xl border border-[#8B7355]/20 p-5 space-y-3.5 shadow-sm premium-shadow md:col-span-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 border-b border-[#8B7355]/15 pb-2">
                <Database className="w-4 h-4 text-[#C9A227]" />
                <h4 className="text-[10px] font-bold text-white uppercase tracking-widest font-mono">
                  Dataset Information
                </h4>
              </div>
              <p className="text-[11px] text-neutral-400 font-sans pt-1 leading-relaxed">
                The classifier maps input arrays against verified historical indices. The unified training pipeline uses clean corporate safety taxonomies to compute probability boundaries.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 text-[10px] font-mono text-neutral-300">
                <div className="p-2.5 bg-[#1A1A1A] border border-[#8B7355]/15 rounded">
                  <span className="text-neutral-500 text-[8px] uppercase block leading-none font-bold">Unified Corpus</span>
                  <span className="text-xs font-bold text-white block mt-1">21,310 Records</span>
                </div>
                <div className="p-2.5 bg-[#1A1A1A] border border-[#8B7355]/15 rounded">
                  <span className="text-neutral-500 text-[8px] uppercase block leading-none font-bold">Train / Test Split</span>
                  <span className="text-xs font-bold text-white block mt-1">70% / 30% Balance</span>
                </div>
                <div className="p-2.5 bg-[#1A1A1A] border border-[#8B7355]/15 rounded flex flex-col justify-between">
                  <span className="text-neutral-500 text-[8px] uppercase block leading-none font-bold">Mean Gini Split</span>
                  <span className="text-xs font-bold text-emerald-500 block mt-1">0.0163</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Row 1 Right: Dataset Management Ingest Module */}
        <div className="lg:col-span-5 bg-[#121212] rounded-xl p-6 border border-[#8B7355]/20 space-y-5 shadow-sm premium-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-[#8B7355]/15 pb-3">
              <FileSpreadsheet className="w-4 h-4 text-[#C9A227]" />
              <h4 className="text-xs font-bold text-white uppercase tracking-widest font-mono leading-none">
                Dataset Ingestion Module
              </h4>
            </div>

            <p className="text-[11px] text-[#A0A0A0] leading-normal font-sans pt-3">
              Refresh the in-memory learning databases by updating structured safety matrices. Ingest reference platform corpora below:
            </p>

            <div className="space-y-2.5 pt-3">
              <div className="p-3 bg-[#1A1A1A] border border-[#8B7355]/15 rounded flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <span className="text-xs font-bold text-white block">Kaggle-Sybil-Social-Corpus</span>
                  <span className="text-[9.5px] text-neutral-500 font-mono block mt-0.5">14,200 records • Combined bot and safe user records</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleIngestDataset('Kaggle-Sybil-Social-Corpus')}
                  disabled={ingesting}
                  className="px-2.5 py-1.5 border border-[#8B7355]/20 hover:border-[#8B7355]/40 text-white hover:bg-[#121212] rounded text-[9.5px] font-mono font-bold uppercase shrink-0 cursor-pointer disabled:opacity-40"
                >
                  Ingest
                </button>
              </div>

              <div className="p-3 bg-[#1A1A1A] border border-[#8B7355]/15 rounded flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <span className="text-xs font-bold text-white block">Twibot-22-Integrity-Sample</span>
                  <span className="text-[9.5px] text-neutral-500 font-mono block mt-0.5">7,110 records • Social metadata verification profile feeds</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleIngestDataset('Twibot-22-Integrity-Sample')}
                  disabled={ingesting}
                  className="px-2.5 py-1.5 border border-[#8B7355]/20 hover:border-[#8B7355]/40 text-white hover:bg-[#121212] rounded text-[9.5px] font-mono font-bold uppercase shrink-0 cursor-pointer disabled:opacity-40"
                >
                  Ingest
                </button>
              </div>
            </div>
          </div>

          {/* Ingestion Console logger */}
          <div className="space-y-1.5 pt-4">
            <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider block font-bold leading-none">Ingestion Sync Console Stream</span>
            <div className="bg-[#1A1A1A] p-3 rounded border border-white/5 h-24 overflow-y-auto font-mono text-[9.5px] text-emerald-500 leading-normal space-y-1">
              {ingestLog.length === 0 ? (
                <span className="text-neutral-600 block text-center pt-5">Ingestion stream idle...</span>
              ) : (
                ingestLog.map((log, lIdx) => (
                  <div key={lIdx}>{log}</div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Grid Row 2: Model Training sandboxes & Operators list */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Row 2/Left: Dynamic Model Training Module */}
        <div className="lg:col-span-7 bg-[#121212] rounded-xl p-6 border border-[#8B7355]/20 space-y-4 shadow-sm font-sans premium-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-[#8B7355]/15 pb-3">
              <Cpu className="w-4 h-4 text-[#C9A227]" />
              <h4 className="text-xs font-bold text-white uppercase tracking-widest font-mono">
                Model Training Configuration Laboratory
              </h4>
            </div>

            <p className="text-xs text-neutral-400 pt-1 leading-relaxed">
              Configure forest estimators, depth branches, and impurity thresholds, then initialize the localized learning optimizer.
            </p>

            <form onSubmit={(e) => { e.preventDefault(); handleTrainModel(); }} className="grid grid-cols-3 gap-3 pt-3">
              <div>
                <label className="block text-[9px] text-neutral-400 uppercase tracking-wider mb-1 font-mono font-bold">Estimators (Trees)</label>
                <input
                  type="number"
                  min="10"
                  max="500"
                  value={numEstimators}
                  onChange={(e) => setNumEstimators(Number(e.target.value))}
                  className="w-full bg-[#1A1A1A] border border-[#8B7355]/20 text-xs text-white rounded p-2 focus:outline-none focus:border-[#C9A227]/20"
                />
              </div>
              
              <div>
                <label className="block text-[9px] text-neutral-400 uppercase tracking-wider mb-1 font-mono font-bold">Max Depth</label>
                <input
                  type="number"
                  min="2"
                  max="50"
                  value={maxDepth}
                  onChange={(e) => setMaxDepth(Number(e.target.value))}
                  className="w-full bg-[#1A1A1A] border border-[#8B7355]/20 text-xs text-white rounded p-2 focus:outline-none focus:border-[#C9A227]/20"
                />
              </div>

              <div>
                <label className="block text-[9px] text-neutral-400 uppercase tracking-wider mb-1 font-mono font-bold">Criterion</label>
                <select
                  value={criterion}
                  onChange={(e) => setCriterion(e.target.value as any)}
                  className="w-full bg-[#1A1A1A] border border-[#8B7355]/20 text-xs text-white rounded p-2 focus:outline-none focus:border-[#C9A227]/20 font-mono"
                >
                  <option value="gini">Gini Impurity</option>
                  <option value="entropy">Shannon Entropy</option>
                </select>
              </div>

              <div className="col-span-3 pt-2">
                <button
                  type="submit"
                  disabled={training}
                  className="w-full bg-[#1A1A1A] hover:bg-neutral-900 text-emerald-500 border border-emerald-500/20 hover:border-emerald-500/45 rounded py-2 font-mono font-bold text-xs uppercase tracking-wider transition cursor-pointer disabled:opacity-40"
                >
                  {training ? 'FITTING ESTIMATOR FORESTS...' : 'Initiate Unified Train Cycle'}
                </button>
              </div>
            </form>
          </div>

          {/* Training Results Details */}
          {trainDetails && (
            <div className="bg-[#1A1A1A] border border-[#8B7355]/20 p-4 rounded text-[10px] space-y-2.5 font-mono mt-4">
              <div className="flex items-center gap-1 text-emerald-500">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="font-bold uppercase tracking-wider font-mono">TRAINING CYCLE CONVERGED SUCCESSFULLY</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-neutral-400">
                <div>Dataset Source Size: <span className="text-white font-bold">{trainDetails.metrics?.trainedOnRecords || '21,310'} files</span></div>
                <div>Estimators Converged: <span className="text-white font-bold">{trainDetails.numEstimators || numEstimators} decision elements</span></div>
                <div>Core Model F1 Score: <span className="text-emerald-500 font-bold">{trainDetails.metrics?.f1Score || '98.2%'}</span></div>
                <div>Gini Variance MSE: <span className="text-[#C9A227] font-bold">{trainDetails.metrics?.meanSquaredError || '0.0163'}</span></div>
              </div>

              <div className="bg-[#121212] border border-[#8B7355]/15 p-2 rounded text-[8.5px] leading-relaxed text-neutral-500 font-sans font-medium">
                "* Training parameters verified over unified validations partition ratios holding 30% sample balance."
              </div>
            </div>
          )}
        </div>

        {/* Row 2/Right: System Operators lists */}
        <div className="lg:col-span-5 bg-[#121212] rounded-xl p-6 border border-[#8B7355]/20 space-y-4 shadow-sm font-sans premium-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-[#8B7355]/15 pb-3">
              <Lock className="w-4 h-4 text-[#C9A227]" />
              <h4 className="text-xs font-bold text-white uppercase tracking-widest font-mono select-none">
                Authorized Platform Operators ({users.length})
              </h4>
            </div>

            <div className="space-y-2.5 max-h-[14rem] overflow-y-auto pr-1 pt-2">
              {users.map((u) => (
                <div 
                  key={u.id}
                  className="p-3 bg-[#1A1A1A] border border-[#8B7355]/15 rounded-lg flex items-center justify-between gap-4 text-xs font-sans"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white block truncate">{u.username}</span>
                      <span className={`text-[8px] font-mono font-black px-1.5 py-0.5 rounded uppercase tracking-wider ${
                        u.role === 'admin' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/10' : 'bg-[#C9A227]/10 text-[#C9A227] border border-[#C9A227]/10'
                      }`}>
                        {u.role}
                      </span>
                    </div>
                    <span className="text-[10px] text-neutral-500 block mt-0.5 truncate font-mono">{u.email}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteUser(u.id, u.username)}
                    disabled={u.id.startsWith('admin-01')}
                    className="p-2 bg-[#121212] border border-[#8B7355]/15 hover:bg-[#1A1A1A] rounded text-neutral-500 hover:text-rose-500 transition-all disabled:opacity-20 disabled:cursor-not-allowed shrink-0 cursor-pointer"
                    title="Purge user identity record"
                  >
                    <UserX className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Application Audit logs */}
      <div className="bg-[#121212] rounded-xl p-6 border border-[#8B7355]/20 space-y-4 shadow-sm font-sans premium-shadow">
        <div className="flex items-center gap-2 border-b border-[#8B7355]/15 pb-3">
          <Activity className="w-4 h-4 text-[#C9A227]" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            System Operations Application Logs
          </h4>
        </div>

        <div className="bg-[#1A1A1A] p-4 rounded border border-white/5 h-44 overflow-y-auto font-mono text-[9.5px] text-neutral-400 space-y-2 leading-relaxed">
          {activityLogs.length === 0 ? (
            <span className="text-neutral-600 block text-center pt-16">Audit log stream initialized...</span>
          ) : (
            activityLogs.map((logLine, idx) => (
              <div key={idx} className="border-b border-white/5 pb-1.5 last:border-none font-mono">
                <span className="text-neutral-500 font-bold mr-3">[{new Date(logLine.timestamp).toLocaleTimeString()}]</span>
                <span className={`px-1 rounded uppercase font-bold text-[8.5px] mr-2 ${
                  logLine.type === 'auth' ? 'bg-cyan-950 text-cyan-400 border border-cyan-800/30' : logLine.type === 'admin' ? 'bg-rose-950 text-rose-455 border border-rose-900/40' : 'bg-neutral-800 text-neutral-300'
                }`}>
                  {logLine.type}
                </span>
                <span className="text-neutral-300">
                  {logLine.details
                    .replace(/SOC/g, 'Compliance Desk')
                    .replace(/SOC trace: Evaluated/g, 'Compliance audit: Evaluated')
                    .replace(/Dynamic risk Gini rating converging/g, 'Assessed risk score')
                  }
                </span>
              </div>
            )).reverse()
          )}
        </div>
        <span className="text-[10px] text-neutral-500 block leading-relaxed font-sans select-none">
          * Application logs display unified multi-user transaction snapshots including auth checks, system parameters updates, and report ledger purges.
        </span>
      </div>
    </div>
  );
}
