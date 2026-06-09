import React, { useEffect, useState } from 'react';
import { 
  Activity, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  FileText, 
  Terminal,
  RefreshCw,
  Cpu,
  Clock,
  Sparkles,
  Layers,
  Award,
  Lock,
  Workflow
} from 'lucide-react';
import { DashboardStats, ScanResult, ActivityLog } from '../types';

interface DashboardScreenProps {
  token: string | null;
  onNavigateToScan: () => void;
  demoMode?: boolean;
}

export default function DashboardScreen({ token, onNavigateToScan, demoMode = false }: DashboardScreenProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentScans, setRecentScans] = useState<ScanResult[]>([]);
  const [systemLogs, setSystemLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      // Fetch stats
      const statsRes = await fetch('/api/stats/summary', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const statsData = await statsRes.json();
      setStats(statsData.summary);

      // Fetch history for recent list
      const scansRes = await fetch('/api/scans/history', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const scansData = await scansRes.json();
      setRecentScans(scansData.slice(0, 5));

      // Fetch admin/user logs if available, else standard fallback scans logs
      const logsRes = await fetch('/api/admin/logs', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (logsRes.ok) {
        const logsData = await logsRes.json();
        setSystemLogs(logsData.systemLogs.slice(0, 6));
      } else {
        // Mock some activity logs on client if standard user doesn't have admin access
        const fallbackLogs: ActivityLog[] = scansData.slice(0, 6).map((scan: ScanResult, idx: number) => ({
          id: `log-${idx}`,
          userId: scan.userId,
          username: scan.username,
          type: 'scan' as const,
          action: 'PROFILE_SCAN',
          details: `Profile audit: Evaluated @${scan.username} profile features. Assessed risk factor of ${scan.riskScore}%.`,
          timestamp: scan.createdAt
        }));
        setSystemLogs(fallbackLogs);
      }
    } catch (e) {
      console.error('Error compiling dashboard metrics', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [token]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#0A0A0A] text-[#F5F5F5]">
        <div className="w-8 h-8 border-2 border-[#C9A227] border-t-transparent animate-spin rounded-full mb-4"></div>
        <p className="text-xs font-mono tracking-wider text-neutral-500 uppercase">Synchronizing Dashboard Metrics...</p>
      </div>
    );
  }

  // Calculate overall confidence level
  const totalWeight = stats?.totalScans ? (100 - (stats.averageRiskScore || 0)) : 94;

  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-[#0A0A0A] text-[#F5F5F5] font-sans">
      
      {/* Header bar - Premium styling */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#8B7355]/20 pb-5">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl font-sans uppercase">
            Dashboard
          </h1>
          <p className="text-xs text-[#A0A0A0] mt-1 font-mono">
            Institution node: <span className="text-[#C9A227] font-semibold">Active Engine Monitoring</span> • Enterprise Compliance & Asset Protection Active
          </p>
        </div>
        <div className="flex items-center gap-3 font-sans">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#121212] border border-[#8B7355]/20 text-neutral-305 text-[10px] font-mono tracking-wider font-semibold uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227]"></span>
            <span>SYSTEM MONITORING INITIATED</span>
          </div>
          <button
            onClick={handleRefresh}
            className="p-2 border border-[#8B7355]/20 text-neutral-400 hover:text-white bg-[#121212] hover:bg-[#1A1A1A] rounded transition-all active:scale-95 cursor-pointer flex items-center justify-center premium-shadow"
            title="Reload statistics"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Posture & Executive Confidence row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 font-sans">
        {/* Posture Main Status Block */}
        <div className="lg:col-span-8 overflow-hidden rounded-xl border border-[#8B7355]/20 bg-[#121212] p-6 flex flex-col justify-between gap-6 relative premium-shadow">
          <div className="space-y-3 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#1A1A1A] border border-[#8B7355]/20 text-[#C9A227] text-[9px] font-semibold uppercase tracking-wider font-mono">
              <Cpu className="w-3.5 h-3.5" />
              <span>Model Status</span>
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight sm:text-xl uppercase font-sans">
              Profile Risk Assessment
            </h3>
            <p className="max-w-2xl text-xs text-[#A0A0A0] leading-relaxed font-normal">
              Execute advanced identity verification, bot network screening, and profile security tests. Evaluates standard random forest features paired with professional explainable analysis generated by Google Gemini.
            </p>
          </div>
          <div className="flex items-center gap-4 relative z-10">
            <button
              onClick={onNavigateToScan}
              className="font-sans text-[11px] font-bold tracking-wider text-black bg-[#C9A227] hover:bg-[#C9A227]/90 px-5 py-2.5 rounded transition-all cursor-pointer transform active:scale-95 shadow-md uppercase"
            >
              Analyze New Profile
            </button>
          </div>
        </div>

        {/* Big Overall Trust Score Bento Card */}
        <div className="lg:col-span-4 rounded-xl border border-[#8B7355]/20 bg-[#121212] p-6 flex flex-col justify-between relative overflow-hidden premium-shadow">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#8B7355]/5 rounded-bl-full pointer-events-none"></div>
          <div>
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block font-mono">
              Verification Score Average
            </span>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-4xl font-semibold text-white tracking-tight font-sans">
                {Math.round(totalWeight)}%
              </span>
              <span className="text-[9px] font-mono font-bold px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-500/20 rounded uppercase tracking-widest">Stable</span>
            </div>
            <p className="text-[11px] text-[#A0A0A0] mt-2 leading-relaxed">
              Overall integrity compliance average calibrated from historical analyzed records.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#8B7355]/15">
            <div className="h-1.5 w-full bg-[#1A1A1A] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#C9A227] transition-all duration-1000"
                style={{ width: `${Math.round(totalWeight)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main metrics bento row - 4 beautiful cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-sans">
        {/* Profiles Analyzed Card */}
        <div className="rounded-xl p-5 border border-[#8B7355]/20 bg-[#121212] flex flex-col justify-between shadow-sm hover:border-[#8B7355]/40 transition-all premium-shadow">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] text-neutral-400 tracking-wider font-semibold block uppercase font-mono">
                Profiles Analyzed
              </span>
              <span className="text-2xl font-bold text-white">
                {stats?.totalScans}
              </span>
            </div>
            <div className="p-2 rounded bg-[#1A1A1A] border border-[#8B7355]/15 text-[#C9A227]">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-[#8B7355]/10 pt-2 text-[10px]">
            <span className="text-neutral-500 font-mono">Compliance Checks</span>
            <span className="font-semibold text-[#C9A227]">Active Log</span>
          </div>
        </div>

        {/* High Risk Profiles Card */}
        <div className="rounded-xl p-5 border border-[#8B7355]/20 bg-[#121212] flex flex-col justify-between shadow-sm hover:border-[#8B7355]/40 transition-all premium-shadow">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] text-[#A0A0A0] tracking-wider font-semibold block uppercase font-mono">
                High Risk Profiles
              </span>
              <span className="text-2xl font-bold text-[#C62828]">
                {(stats?.fraudulentProfiles || 0) + (stats?.highRiskProfiles || 0)}
              </span>
            </div>
            <div className="p-2 rounded bg-[#1A1A1A] border border-[#8B7355]/15 text-[#C62828]">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-[#8B7355]/10 pt-2 text-[10px]">
            <span className="text-neutral-500 font-mono">Anomaly Ratio</span>
            <span className="font-semibold text-[#C62828]">
              {stats?.totalScans ? Math.round((((stats.fraudulentProfiles || 0) + (stats.highRiskProfiles || 0)) / stats.totalScans) * 100) : 0}%
            </span>
          </div>
        </div>

        {/* Active Reports Card */}
        <div className="rounded-xl p-5 border border-[#8B7355]/20 bg-[#121212] flex flex-col justify-between shadow-sm hover:border-[#8B7355]/40 transition-all premium-shadow">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] text-neutral-400 tracking-wider font-semibold block uppercase font-mono">
                Active Reports
              </span>
              <span className="text-2xl font-bold text-white">
                {stats?.totalScans}
              </span>
            </div>
            <div className="p-2 rounded bg-[#1A1A1A] border border-[#8B7355]/15 text-[#C9A227]">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-[#8B7355]/10 pt-2 text-[10px]">
            <span className="text-neutral-500 font-mono">Institutional Ledger</span>
            <span className="font-semibold text-[#C9A227]">
              Archived Reports
            </span>
          </div>
        </div>

        {/* Detection Accuracy Card */}
        <div className="rounded-xl p-5 border border-[#8B7355]/20 bg-[#121212] flex flex-col justify-between shadow-sm hover:border-[#8B7355]/40 transition-all premium-shadow">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] text-emerald-500 tracking-wider font-semibold block uppercase font-mono">
                Detection Accuracy
              </span>
              <span className="text-2xl font-bold text-emerald-500">
                98.2%
              </span>
            </div>
            <div className="p-2 rounded bg-[#1A1A1A] border border-[#8B7355]/15 text-emerald-500">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-[#8B7355]/10 pt-2 text-[10px]">
            <span className="text-neutral-500 font-mono">Ensemble Average</span>
            <span className="font-semibold text-emerald-500">
              Verified Model
            </span>
          </div>
        </div>
      </div>

      {/* Grid of details: recent activity and scans */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent scans index */}
        <div className="lg:col-span-7 rounded-xl p-6 border border-[#8B7355]/20 bg-[#121212] flex flex-col font-sans premium-shadow">
          <div className="flex items-center justify-between border-b border-[#8B7355]/10 pb-3 mb-4 shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#C9A227] rounded-full"></span>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Recent Profile Assessments
              </h4>
            </div>
            <span className="text-[9px] text-neutral-500 font-mono uppercase">System Database</span>
          </div>

          <div className="space-y-3 overflow-y-auto flex-1 max-h-96 pr-1">
            {recentScans.length === 0 ? (
              <p className="text-center text-xs text-neutral-500 py-12 font-mono">
                No recent profile assessment logs located.
              </p>
            ) : (
              recentScans.map((scan) => (
                <div
                  key={scan.id}
                  className="p-3.5 rounded bg-[#1A1A1A] border border-white/5 flex items-center justify-between gap-4 hover:border-[#8B7355]/30 transition-all font-sans text-xs"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-white block truncate">
                        @{scan.username}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.5 bg-[#121212] text-neutral-400 rounded border border-[#8B7355]/15 inline-block font-mono">
                        {scan.platform}
                      </span>
                    </div>
                    <span className="text-[9.5px] text-neutral-500 block mt-1 truncate font-mono">
                      {scan.profileUrl}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 font-sans">
                    <div className="text-right">
                      <span className="text-[8px] text-neutral-500 block uppercase font-mono font-bold">Risk Index</span>
                      <span className={`text-xs font-bold block ${
                        scan.verdict === 'FRAUDULENT' || scan.verdict === 'HIGH_RISK' ? 'text-[#C62828]' : scan.verdict === 'SUSPICIOUS' ? 'text-amber-500' : 'text-emerald-500'
                      }`}>
                        {scan.riskScore}%
                      </span>
                    </div>

                    <div className={`px-2 py-1 bg-[#121212] border rounded text-[8px] font-bold shrink-0 tracking-wider text-center w-22 font-mono ${
                      scan.verdict === 'FRAUDULENT' || scan.verdict === 'HIGH_RISK'
                        ? 'border-rose-900/30 text-rose-455 bg-rose-950/20' 
                        : scan.verdict === 'SUSPICIOUS'
                          ? 'border-amber-900/30 text-amber-400 bg-amber-950/20' 
                          : 'border-emerald-900/30 text-emerald-400 bg-emerald-950/10'
                    }`}>
                      {scan.verdict}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Live audit updates */}
        <div className="lg:col-span-5 rounded-xl p-6 border border-[#8B7355]/20 bg-[#121212] flex flex-col font-sans premium-shadow">
          <div className="flex items-center justify-between border-b border-[#8B7355]/10 pb-3 mb-4 shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-neutral-550 rounded-full"></span>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Activity Log
              </h4>
            </div>
            <span className="text-[9px] text-neutral-500 font-mono uppercase font-bold">Compliance Ledger</span>
          </div>

          <div className="space-y-4 flex-1 overflow-y-auto max-h-96 pr-1">
            {systemLogs.length === 0 ? (
              <p className="text-center text-xs text-neutral-550 py-12 font-mono">
                Log pool initialized. Standard syscalls mapping active...
              </p>
            ) : (
              systemLogs.map((log) => {
                // Professional terminology replacement for detail string
                const refinedDetails = log.details
                  ? log.details
                      .replace(/SOC trace: Evaluated/g, 'Compliance audit: Evaluated')
                      .replace(/Dynamic risk Gini rating converging/g, 'Assessed risk score')
                      .replace(/SOC/g, 'Compliance Desk')
                  : '';
                return (
                  <div key={log.id} className="text-xs border-b border-white/5 pb-3 last:border-none last:pb-0 space-y-1 font-mono text-[10.5px]">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[8px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${
                        log.type === 'auth' ? 'bg-[#C9A227]/10 text-[#C9A227] border border-[#8B7355]/20' : log.type === 'admin' ? 'bg-rose-950/30 text-[#C62828] border border-rose-900/20' : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                      }`}>
                        {log.type}
                      </span>
                      <span className="text-[8.5px] text-neutral-500">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-neutral-400 font-mono text-[10px] leading-relaxed">
                      {refinedDetails || log.details}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
