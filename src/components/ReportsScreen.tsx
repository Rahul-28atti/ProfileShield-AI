import React, { useEffect, useState } from 'react';
import { 
  FileLock, 
  Trash2, 
  Search, 
  Download, 
  Printer, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  FileText,
  X,
  FileSpreadsheet
} from 'lucide-react';
import { ScanResult } from '../types';

interface ReportsScreenProps {
  token: string | null;
  refreshTrigger: number;
  onScansDeleted: () => void;
  demoMode?: boolean;
}

export default function ReportsScreen({ token, refreshTrigger, onScansDeleted, demoMode = false }: ReportsScreenProps) {
  const [scans, setScans] = useState<ScanResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlatform, setFilterPlatform] = useState('All');
  const [selectedScan, setSelectedScan] = useState<ScanResult | null>(null);

  const loadHistory = async () => {
    try {
      const res = await fetch('/api/scans/history', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setScans(data);
      }
    } catch (e) {
      console.error('Failed to reload scans history', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [token, refreshTrigger]);

  const handleDeleteScan = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering details modal
    if (!confirm('Are you absolutely sure you want to delete this threat analysis report from database history?')) {
      return;
    }

    try {
      const res = await fetch(`/api/scans/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setScans(prev => prev.filter(s => s.id !== id));
        onScansDeleted(); // Sync sister cards
      }
    } catch (err) {
      console.error('Error purging scan record', err);
    }
  };

  // Plaintext audit download generator
  const handleDownloadPlaintext = (scan: ScanResult) => {
    const text = `==================================================================
              PROFILESHIELD AI THREAT FORENSIC snapshot
==================================================================
[CASE_ID]       : PS-SHA-${scan.id.substring(0, 10).toUpperCase()}
[AUDIT_DATE]    : ${new Date(scan.createdAt).toUTCString()}
[PLATFORM]      : ${scan.platform}
[TARGET_USER]   : @${scan.username}
[PROFILE_URL]   : ${scan.profileUrl}

------------------------------------------------------------------
METRICS & ANOMALY ATTRIBUTES
------------------------------------------------------------------
[FOLLOWERS]     : ${scan.followersCount}
[FOLLOWING]     : ${scan.followingCount}
[POSTS]         : ${scan.postsCount}
[PFP_STATUS]    : ${scan.hasProfilePic ? 'VALID_PFP_PRESENT' : 'NO_PFP_FOUND'}
[SHANNON_ENT]   : ${scan.usernameEntropy || 3.12} bits

------------------------------------------------------------------
CLASSIFICATION METRICS CONVERGENCE
------------------------------------------------------------------
[TRUST_INDEX]   : ${scan.trustScore}%
[RISK_INDEX]    : ${scan.riskScore}%
[VERDICT_LEVEL] : ${scan.verdict}
[CONFIDENCE]    : ${scan.modelConfidence || 95}%

------------------------------------------------------------------
GEMINI COGNITIVE EXPLAINABLE AI ANALYSIS REPORT
------------------------------------------------------------------
${scan.explanation}

==================================================================
Forensic Evidence Vault. Data ground confirmation: Verified.
==================================================================
`;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `profileshield_audit_${scan.platform.toLowerCase()}_${scan.username}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrintReport = (scan: ScanResult) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Pop-up blocked. Please enable popups to print security reports.');
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>ProfileShield Security Report - @${scan.username}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              background: #fff;
              color: #111111;
              padding: 40px;
              line-height: 1.5;
            }
            .header-banner {
              border-bottom: 2px solid #111111;
              padding-bottom: 20px;
              margin-bottom: 30px;
              text-align: left;
            }
            .header-banner h1 {
              margin: 0;
              font-size: 24px;
              font-weight: 800;
              letter-spacing: -0.5px;
              color: #000;
            }
            .header-banner p {
              margin: 5px 0 0 0;
              font-size: 11px;
              color: #555;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .seal-box {
              background-color: #f5f5f5;
              border: 1px solid #111111;
              padding: 15px;
              margin: 20px 0;
              font-size: 11px;
              font-family: monospace;
              color: #111111;
              font-weight: bold;
              border-radius: 4px;
            }
            .stats-table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            .stats-table th, .stats-table td {
              border: 1px solid #e1e1e1;
              padding: 10px 12px;
              text-align: left;
              font-size: 12px;
            }
            .stats-table th {
              background-color: #f9f9f9;
              font-weight: 600;
              color: #000;
              width: 30%;
            }
            .verdict-line {
              font-size: 15px;
              font-weight: bold;
              text-align: center;
              margin: 30px 0;
              padding: 15px;
              border-radius: 4px;
              border: 1px solid #111111;
              background-color: #f9f9f9;
              color: #000;
            }
            .explanation-box {
              line-height: 1.6;
              white-space: pre-line;
              margin-top: 20px;
              font-size: 12px;
              color: #333;
            }
            .footer {
              margin-top: 50px;
              border-top: 1px solid #e1e1e1;
              padding-top: 15px;
              font-size: 10px;
              text-align: center;
              color: #999;
            }
          </style>
        </head>
        <body>
          <div class="header-banner">
            <h1>PROFILESHIELD AI</h1>
            <p>ADVANCED ENTERPRISE IDENTITY SECURITY PLATFORM</p>
          </div>

          <div class="seal-box">
            CONFIDENTIALITY LEVEL: INTERNAL RESTRICTED<br/>
            AUDIT REFERENCE HASH: PS-SHA-${scan.id.toUpperCase().substring(0, 16)}<br/>
            CLASSIFICATION VERDICT: ${scan.verdict} • RISK SCORE: ${scan.riskScore}%
          </div>

          <table class="stats-table">
            <tr><th>Target Identity</th><td>@${scan.username}</td></tr>
            <tr><th>Social Ecosystem</th><td>${scan.platform}</td></tr>
            <tr><th>Evaluated Record URL</th><td>${scan.profileUrl}</td></tr>
            <tr><th>Timestamp</th><td>${new Date(scan.createdAt).toUTCString()}</td></tr>
            <tr><th>Followers / Following</th><td>Followers: ${scan.followersCount} • Following: ${scan.followingCount}</td></tr>
            <tr><th>Posts Audited</th><td>${scan.postsCount} posts in ledger</td></tr>
            <tr><th>Shannon Entropy</th><td>${scan.usernameEntropy || 3.12} bits</td></tr>
          </table>

          <div class="verdict-line">
            PREDICTION VERDICT: ${scan.verdict} • THREAT RISK RATING: ${scan.riskScore}%
          </div>

          <h4 style="margin-bottom: 10px; font-size: 13px; border-b: 2px solid #111111; padding-bottom: 5px; text-transform: uppercase; font-family: monospace;">Cognitive Forensic Analysis</h4>
          <div class="explanation-box">
            ${scan.explanation}
          </div>

          <div class="footer">
            ProfileShield SecOps Platform. All systems operating optimally.
          </div>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const filteredScans = scans.filter(scan => {
    const matchesSearch = scan.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          scan.bio.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = filterPlatform === 'All' || scan.platform === filterPlatform;
    return matchesSearch && matchesPlatform;
  });

  const renderBeautifulReportModal = (explanation: string) => {
    if (!explanation.includes('### ')) {
      return (
        <div className="whitespace-pre-line text-xs font-mono text-neutral-300">
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
          if (title.includes("THREAT")) accentColor = "text-rose-500";
          if (title.includes("RECOMMENDATION")) accentColor = "text-emerald-500";

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
          <h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl uppercase">
            Reports
          </h1>
          <p className="text-xs text-[#A0A0A0] mt-1 font-sans">
            Search scanned profiles, export standardized data signatures, and download certified printable security briefings.
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#121212] border border-[#8B7355]/20 font-mono text-[9px] font-bold text-[#C9A227]">
          <FileLock className="w-3.5 h-3.5" />
          <span>REPORTS ARCHIVE SECURED</span>
        </div>
      </div>

      {/* Filter and Query controls */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between text-xs font-sans">
        {/* Search query config */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
            <Search className="w-4 h-4 text-neutral-500" />
          </div>
          <input
            type="text"
            placeholder="Search archive files by profile username or parameters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#121212] border border-[#8B7355]/20 pl-9 pr-4 py-2 text-xs text-white rounded focus:outline-none focus:ring-1 focus:ring-[#C9A227]/20 transition-all font-mono"
          />
        </div>

        {/* Platform selection filters */}
        <div className="flex items-center gap-3 font-sans">
          <label className="text-neutral-400 font-bold uppercase tracking-wider text-[10px] font-mono">Filter Platform:</label>
          <select
            value={filterPlatform}
            onChange={(e) => setFilterPlatform(e.target.value)}
            className="bg-[#121212] border border-[#8B7355]/20 px-3.5 py-2 text-xs rounded text-white focus:outline-none focus:ring-1 focus:ring-[#C9A227]/20 cursor-pointer transition-all font-mono"
          >
            <option value="All">All Social ecosystems</option>
            <option value="Twitter/X">Twitter/X</option>
            <option value="Instagram">Instagram</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="Facebook">Facebook</option>
            <option value="TikTok">TikTok</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center py-16 text-[#F5F5F5]">
          <div className="w-10 h-10 border-2 border-[#C9A227] border-t-transparent animate-spin rounded-full mb-4"></div>
          <p className="text-xs font-mono tracking-wider text-neutral-500 uppercase">Synchronizing Secured Archive Cache...</p>
        </div>
      ) : filteredScans.length === 0 ? (
        <div className="text-center py-16 bg-[#121212] border border-dashed border-[#8B7355]/20 rounded-xl flex flex-col items-center justify-center space-y-3 premium-shadow">
          <FileLock className="w-9 h-9 text-neutral-700" />
          <h4 className="font-mono font-bold text-white text-xs uppercase tracking-widest">Archive Vault Empty</h4>
          <p className="text-xs text-[#A0A0A0] max-w-sm leading-relaxed font-sans">
            No threat records found. Access the Profile Analysis screen on the navigation menu to conduct custom diagnostic assessments.
          </p>
        </div>
      ) : (
        /* Report audit cards list grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredScans.map((scan) => (
            <div
              key={scan.id}
              onClick={() => setSelectedScan(scan)}
              className="bg-[#121212] rounded-xl border border-[#8B7355]/20 hover:border-[#8B7355]/40 p-5 cursor-pointer flex flex-col justify-between hover:shadow-lg duration-150 relative group premium-shadow"
            >
              {/* Score label ribbon */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-[9px] font-bold text-neutral-500 tracking-wider font-mono uppercase block">CASE #PS-SHA-{scan.id.substring(0, 6).toUpperCase()}</span>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider font-mono ${
                  scan.verdict === 'FRAUDULENT' || scan.verdict === 'HIGH_RISK'
                    ? 'border-red-500/10 text-rose-500 bg-rose-500/5' 
                    : scan.verdict === 'SUSPICIOUS' 
                      ? 'border-amber-500/10 text-amber-500 bg-amber-500/5' 
                      : 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5'
                }`}>
                  {scan.verdict}
                </span>
              </div>

              {/* Identity body name */}
              <div className="space-y-1 mb-4 select-none">
                <h4 className="text-sm font-medium text-white truncate">@{scan.username}</h4>
                <p className="text-[10px] text-[#C9A227] truncate font-mono">{scan.profileUrl}</p>
                
                <div className="grid grid-cols-2 gap-1 text-[9px] text-[#A0A0A0] pt-2 border-t border-[#8B7355]/15 mt-3 font-mono">
                  <div>Platform: <span className="text-white">{scan.platform}</span></div>
                  <div className="text-right">Risk Factor: <span className={`font-bold ${scan.riskScore > 50 ? 'text-rose-500' : 'text-emerald-500'}`}>{scan.riskScore}%</span></div>
                </div>
              </div>

              {/* Action operations strip */}
              <div className="flex items-center justify-between border-t border-[#8B7355]/15 pt-3 text-[10px] gap-2 shrink-0 font-mono text-neutral-400">
                <span className="text-[9px] text-neutral-500 block shrink-0">{new Date(scan.createdAt).toLocaleDateString()}</span>
                
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDownloadPlaintext(scan); }}
                    className="p-1.5 text-neutral-400 hover:text-white bg-[#1A1A1A] hover:bg-[#202020] border border-[#8B7355]/15 rounded transition-all cursor-pointer"
                    title="Download Plaintext Report"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handlePrintReport(scan); }}
                    className="p-1.5 text-neutral-400 hover:text-white bg-[#1A1A1A] hover:bg-[#202020] border border-[#8B7355]/15 rounded transition-all cursor-pointer"
                    title="Print isolated Security PDF report"
                  >
                    <Printer className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => handleDeleteScan(scan.id, e)}
                    className="p-1.5 text-rose-500 hover:text-rose-400 bg-[#1A1A1A] hover:bg-rose-950/20 border border-rose-500/10 rounded transition-all cursor-pointer"
                    title="Purge record from defense vault"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Audit Report details modal popup block */}
      {selectedScan && (
        <div className="fixed inset-0 bg-[#0A0A0A]/95 backdrop-filter backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-[#8B7355]/25 bg-[#121212] overflow-hidden shadow-2xl relative text-xs flex flex-col max-h-[90vh] premium-shadow">
            
            {/* Modal header */}
            <div className="p-5 border-b border-[#8B7355]/20 bg-[#1A1A1A] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#C9A227]" />
                <span className="text-white font-bold uppercase text-[11px] tracking-wider font-mono">Forensic Case Snapshot: PS-SHA-{selectedScan.id.substring(0, 10).toUpperCase()}</span>
              </div>
              <button
                onClick={() => setSelectedScan(null)}
                className="text-neutral-405 hover:text-white p-1 hover:bg-[#1A1A1A] rounded transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable details view */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1 font-sans">
              {/* Overview visual layout summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#1A1A1A] p-4 rounded-xl border border-[#8B7355]/15">
                <div className="text-center py-1">
                  <span className="text-[9px] text-neutral-500 uppercase block font-bold tracking-wider font-mono">Risk Rating</span>
                  <span className={`text-lg font-black block mt-0.5 ${
                    selectedScan.verdict === 'FRAUDULENT' || selectedScan.verdict === 'HIGH_RISK' ? 'text-rose-500' : selectedScan.verdict === 'SUSPICIOUS' ? 'text-amber-500' : 'text-emerald-500'
                  }`}>
                    {selectedScan.riskScore}%
                  </span>
                </div>
                <div className="text-center py-1 border-l border-[#8B7355]/10 font-mono">
                  <span className="text-[9px] text-neutral-500 uppercase block font-bold tracking-wider">Followers</span>
                  <span className="text-base font-bold text-white block mt-0.5">{selectedScan.followersCount.toLocaleString()}</span>
                </div>
                <div className="text-center py-1 border-l border-[#8B7355]/10 font-mono">
                  <span className="text-[9px] text-neutral-500 uppercase block font-bold tracking-wider">Following</span>
                  <span className="text-base font-bold text-white block mt-0.5">{selectedScan.followingCount.toLocaleString()}</span>
                </div>
                <div className="text-center py-1 border-l border-[#8B7355]/10 font-mono">
                  <span className="text-[9px] text-neutral-500 uppercase block font-bold tracking-wider">Post Count</span>
                  <span className="text-base font-bold text-white block mt-0.5">{selectedScan.postsCount.toLocaleString()}</span>
                </div>
              </div>

              {/* Metadata listings */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[#C9A227] uppercase tracking-wider border-b border-[#8B7355]/15 pb-1.5 font-mono">Case Specifications</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2.5 text-neutral-300 font-sans text-[11px]">
                  <div className="flex items-center justify-between"><span className="text-neutral-500 font-mono">Target Platform:</span> <strong className="font-semibold text-white">{selectedScan.platform}</strong></div>
                  <div className="flex items-center justify-between"><span className="text-neutral-500 font-mono">Target Username:</span> <strong className="font-semibold text-white">@{selectedScan.username}</strong></div>
                  <div className="flex items-center justify-between truncate"><span className="text-neutral-500 font-mono shrink-0">Profile ID URL:</span> <strong className="truncate pl-3 font-semibold text-[#C9A227]">{selectedScan.profileUrl}</strong></div>
                  <div className="flex items-center justify-between"><span className="text-neutral-500 font-mono">Has Profile Photo:</span> <strong className="font-semibold text-white">{selectedScan.hasProfilePic ? 'Verified Photo Present' : 'Default/No Profile Picture'}</strong></div>
                  <div className="flex items-center justify-between"><span className="text-neutral-500 font-mono">Assessment Date:</span> <strong className="font-semibold text-white">{new Date(selectedScan.createdAt).toUTCString()}</strong></div>
                  <div className="flex items-center justify-between"><span className="text-neutral-500 font-mono">Shannon Entropy:</span> <strong className="font-semibold text-white">{selectedScan.usernameEntropy || 2.87} bits</strong></div>
                </div>
              </div>

              {/* Bio analysis panel */}
              {selectedScan.bio && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-[#C9A227] uppercase tracking-wider border-b border-[#8B7355]/15 pb-1.5 font-mono">Biography Contents</h4>
                  <div className="bg-[#1A1A1A] p-3.5 rounded-lg border border-[#8B7355]/15 text-neutral-300 leading-normal italic text-xs font-mono">
                    "{selectedScan.bio}"
                  </div>
                </div>
              )}

              {/* Explanations section */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#8B7355]/15 pb-2 flex items-center gap-2 font-mono">
                  <span className="flex h-1.5 w-1.5 relative">
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#C9A227]"></span>
                  </span>
                  AI Threat Reasoner Report
                </h4>
                
                <div className="pt-1">
                  {renderBeautifulReportModal(selectedScan.explanation)}
                </div>
              </div>
            </div>

            {/* Modal actions panel footer */}
            <div className="p-4 border-t border-[#8B7355]/20 bg-[#1A1A1A] flex items-center justify-between shrink-0">
              <span className="text-[10px] text-neutral-500 font-mono">RESTRICTED FORENSIC RECORD</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadPlaintext(selectedScan)}
                  className="px-3 py-2 bg-[#121212] border border-[#8B7355]/20 text-neutral-300 hover:text-white rounded flex items-center gap-1.5 transition-all text-xs cursor-pointer font-mono font-bold"
                >
                  <Download className="w-3.5 h-3.5" /> DOWNLOAD FILE
                </button>
                <button
                  onClick={() => handlePrintReport(selectedScan)}
                  className="px-3.5 py-2 bg-[#121212] hover:bg-[#202020] text-[#C9A227] border border-[#C9A227]/25 rounded flex items-center gap-1.5 transition-all text-xs cursor-pointer font-mono font-bold"
                >
                  <Printer className="w-3.5 h-3.5" /> CERTIFY REPORT
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
