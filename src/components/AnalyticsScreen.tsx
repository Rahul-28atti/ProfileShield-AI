import React, { useEffect, useState } from 'react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { LineChart as LineIcon, BarChart3, PieChart as PieIcon, Info, Sparkles, Award, TrendingUp } from 'lucide-react';

interface AnalyticsScreenProps {
  token: string | null;
  refreshTrigger: number;
  demoMode?: boolean;
}

export default function AnalyticsScreen({ token, refreshTrigger, demoMode = false }: AnalyticsScreenProps) {
  const [loading, setLoading] = useState(true);
  const [platformData, setPlatformData] = useState<any[]>([]);
  const [riskData, setRiskData] = useState<any[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);

  // Theme colors - Professional Executive Theme
  const GOLD_ACCENT = '#C9A227';
  const CYAN_ACCENT = '#C9A227'; // Map legacy references to Gold Accent safely
  const BLUE_ACCENT = '#8B7355';
  const EMERALD_GREEN = '#10B981';
  const THREAT_RED = '#EF4444';
  const AMBER_YELLOW = '#F59E0B';

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch('/api/stats/summary', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          setPlatformData(data.platformBreakdown);
          setRiskData(data.riskDistribution);
          setTrendData(data.dailyTrend);
        }
      } catch (e) {
        console.error("Error loading analytics charts", e);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [token, refreshTrigger]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#0A0A0A] text-[#F5F5F5]">
        <div className="w-10 h-10 border-2 border-[#C9A227] border-t-transparent animate-spin rounded-full mb-4"></div>
        <p className="text-xs font-mono tracking-wider text-neutral-500 uppercase">Synchronizing Analytics Telemetry...</p>
      </div>
    );
  }

  // Calculate some insights
  const totalAudits = platformData.reduce((acc, p) => acc + p.total, 0);
  const totalThreats = platformData.reduce((acc, p) => acc + p.fraudulent, 0);
  const highestPlatform = platformData.reduce((max, p) => p.total > max.total ? p : max, { name: 'None', total: 0 });

  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-[#0A0A0A] text-[#F5F5F5] font-sans">
      
      {/* Header */}
      <div className="border-b border-[#8B7355]/20 pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl uppercase">
            Analytics
          </h1>
          <p className="text-xs text-[#A0A0A0] mt-1 font-sans">
            Statistical distribution of risk posture and threat vectors across analyzed profiles.
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#121212] border border-[#8B7355]/20 font-mono text-[10px] font-semibold text-[#C9A227]">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>PORTAL POSTURE: SECURE</span>
        </div>
      </div>

      {/* Highlights line info */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="bg-[#121212] rounded-xl p-5 border border-[#8B7355]/20 shadow-sm premium-shadow">
          <span className="text-neutral-500 font-bold block uppercase mb-1 text-[9px] tracking-wider font-mono">Total Assessments</span>
          <span className="text-lg font-bold text-white block mt-1">{totalAudits} audits executed</span>
        </div>
        <div className="bg-[#121212] rounded-xl p-5 border border-[#8B7355]/20 shadow-sm premium-shadow">
          <span className="text-neutral-500 font-bold block uppercase mb-1 text-[9px] tracking-wider font-mono">Mitigated Adversaries</span>
          <span className="text-lg font-bold text-rose-500 block mt-1">{totalThreats} accounts isolated</span>
        </div>
        <div className="bg-[#121212] rounded-xl p-5 border border-[#8B7355]/20 shadow-sm premium-shadow">
          <span className="text-neutral-500 font-bold block uppercase mb-1 text-[9px] tracking-wider font-mono">Primary Threat Channel</span>
          <span className="text-lg font-bold text-[#C9A227] block mt-1">{highestPlatform.name} ({highestPlatform.total} records)</span>
        </div>
      </div>

      {/* Main Grid: Recharts Visualization panels */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Graph 1: Detection Trends Timeline */}
        <div className="xl:col-span-8 bg-[#121212] rounded-xl p-6 border border-[#8B7355]/25 space-y-4 shadow-sm premium-shadow">
          <div className="flex items-center gap-2 border-b border-[#8B7355]/15 pb-3">
            <LineIcon className="w-4 h-4 text-[#C9A227]" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Investigation Timeline Performance
            </h4>
          </div>

          <div className="h-72 w-full text-xs font-mono">
            {trendData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-neutral-500">
                Awaiting historical records to generate trends logs.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222222" />
                  <XAxis dataKey="date" stroke="#666666" style={{ fontFamily: 'monospace', fontSize: '9px' }} />
                  <YAxis stroke="#666666" style={{ fontFamily: 'monospace', fontSize: '9px' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#121212', border: '1px solid #8B735533', borderRadius: '4px' }}
                    labelStyle={{ color: '#ffffff', fontFamily: 'monospace', fontWeight: 'bold', fontSize: '10px' }}
                    itemStyle={{ fontFamily: 'monospace', color: '#F5F5F5', fontSize: '10px' }}
                  />
                  <Legend wrapperStyle={{ fontFamily: 'monospace', fontSize: '10px' }} />
                  <Line type="monotone" dataKey="scansCount" name="Total Scans" stroke={CYAN_ACCENT} strokeWidth={2.0} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="threatsDetected" name="Scams Blocked" stroke={THREAT_RED} strokeWidth={2.0} />
                  <Line type="monotone" dataKey="suspiciousParsed" name="Suspicious" stroke={AMBER_YELLOW} strokeWidth={1.5} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Graph 2: Risk Scoring distribution slice chart */}
        <div className="xl:col-span-4 bg-[#121212] rounded-xl p-6 border border-[#8B7355]/25 space-y-4 shadow-sm premium-shadow">
          <div className="flex items-center gap-2 border-b border-[#8B7355]/15 pb-3">
            <PieIcon className="w-4 h-4 text-[#C9A227]" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Identity Risk Category Breakdown
            </h4>
          </div>

          <div className="h-72 w-full text-xs relative flex flex-col justify-between font-mono">
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="range"
                >
                  <Cell fill={EMERALD_GREEN} />
                  <Cell fill={BLUE_ACCENT} />
                  <Cell fill={AMBER_YELLOW} />
                  <Cell fill="#991B1B" />
                  <Cell fill={THREAT_RED} />
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#121212', border: '1px solid #8B735533', borderRadius: '4px' }}
                  itemStyle={{ fontFamily: 'monospace', color: '#F5F5F5', fontSize: '10px' }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="grid grid-cols-5 gap-1 text-[8px] text-center border-t border-[#8B7355]/15 pt-3 text-neutral-500 font-mono">
              <div><span className="inline-block w-1.5 h-1.5 bg-[#10B981] mr-1 rounded-full"></span>0-20%</div>
              <div><span className="inline-block w-1.5 h-1.5 bg-[#8B7355] mr-1 rounded-full"></span>21-40%</div>
              <div><span className="inline-block w-1.5 h-1.5 bg-[#F59E0B] mr-1 rounded-full"></span>41-60%</div>
              <div><span className="inline-block w-1.5 h-1.5 bg-[#991B1B] mr-1 rounded-full font-mono"></span>61-80%</div>
              <div><span className="inline-block w-1.5 h-1.5 bg-[#EF4444] mr-1 rounded-full font-mono"></span>81-100%</div>
            </div>
          </div>
        </div>

        {/* Graph 3: Platform Comparison bar charts */}
        <div className="xl:col-span-12 bg-[#121212] rounded-xl p-6 border border-[#8B7355]/25 space-y-4 shadow-sm premium-shadow">
          <div className="flex items-center gap-2 border-b border-[#8B7355]/15 pb-3">
            <BarChart3 className="w-4 h-4 text-[#C9A227]" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Multi-Channel Adversary Distribution Analysis
            </h4>
          </div>

          <div className="h-80 w-full text-xs font-mono">
            {platformData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-neutral-500">
                Awaiting logs to group threat vectors by platform.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={platformData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222222" />
                  <XAxis dataKey="name" stroke="#666666" style={{ fontFamily: 'monospace', fontSize: '9px' }} />
                  <YAxis stroke="#666666" style={{ fontFamily: 'monospace', fontSize: '9px' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#121212', border: '1px solid #8B735533', borderRadius: '4px' }}
                    labelStyle={{ color: '#ffffff', fontFamily: 'monospace', fontWeight: 'bold', fontSize: '10px' }}
                    itemStyle={{ fontFamily: 'monospace', color: '#F5F5F5', fontSize: '10px' }}
                  />
                  <Legend wrapperStyle={{ fontFamily: 'monospace', fontSize: '10px' }} />
                  <Bar dataKey="safe" name="Verified Safe" fill={EMERALD_GREEN} stackId="a" />
                  <Bar dataKey="suspicious" name="Suspicious Caution" fill={AMBER_YELLOW} stackId="a" />
                  <Bar dataKey="fraudulent" name="Threat Flags" fill={THREAT_RED} stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
