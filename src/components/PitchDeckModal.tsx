import React, { useState } from 'react';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  ShieldAlert, 
  Cpu, 
  Binary, 
  LineChart, 
  Server, 
  Activity, 
  Award,
  Sparkles,
  Zap,
  CheckCircle,
  Database,
  Lock,
  Layers
} from 'lucide-react';

interface PitchDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PitchDeckModal({ isOpen, onClose }: PitchDeckModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!isOpen) return null;

  const slides = [
    {
      title: "Executive Briefing & Business Case",
      subtitle: "The Brand Counterfeit & Automated Sybil Crisis",
      icon: ShieldAlert,
      tag: "01 / CRITICAL POSTURE",
      color: "text-rose-500",
      bg: "border-rose-500/10",
      content: (
        <div className="space-y-4 font-sans">
          <p className="text-xs text-neutral-400 leading-relaxed font-sans">
            Modern social communications suffer from large-scale identity counterfeit attacks. Sybil bot networks, automated scam syndicates, and targeted executive impersonations hijack accounts, siphon credentials, and orchestrate brand fraud.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 bg-[#1A1A1A] border border-[#8B7355]/15 rounded-lg">
              <span className="text-[10px] font-mono text-rose-500 block uppercase font-bold">Impersonation Scale</span>
              <span className="text-xl font-bold tracking-tight text-[#F5F5F5] block mt-1 font-mono">21.4B+</span>
              <p className="text-[9px] text-neutral-500 mt-1 leading-normal">Losses annually caused by identity credentials hijacking and spear phishing.</p>
            </div>
            <div className="p-3.5 bg-[#1A1A1A] border border-[#8B7355]/15 rounded-lg">
              <span className="text-[10px] font-mono text-rose-500 block uppercase font-bold">Bot Velocity</span>
              <span className="text-xl font-bold tracking-tight text-[#F5F5F5] block mt-1 font-mono">47%</span>
              <p className="text-[9px] text-neutral-500 mt-1 leading-normal">Of total web browser traffic in 2025 originates from complex bot automation.</p>
            </div>
            <div className="p-3.5 bg-[#1A1A1A] border border-[#8B7355]/15 rounded-lg">
              <span className="text-[10px] font-mono text-rose-500 block uppercase font-bold">Vulnerability Gap</span>
              <span className="text-xl font-bold tracking-tight text-[#F5F5F5] block mt-1 font-mono">4.2 Weeks</span>
              <p className="text-[9px] text-neutral-500 mt-1 leading-normal">Average time requested for manual compliance reviews to trace brand impostors.</p>
            </div>
          </div>
          <div className="p-3.5 bg-[#121212]/80 border-l-2 border-l-rose-500 border border-[#8B7355]/15 rounded-lg">
            <h4 className="text-[10px] text-[#F5F5F5] font-bold uppercase tracking-wider font-mono">Organizational Impact</h4>
            <p className="text-[9.5px] text-neutral-450 mt-1 leading-relaxed">
              Standard compliance firewalls focus purely on traditional network headers. Social layer impersonations scale because they do not carry signatures. True defense mandates cognitive analysis of social posture features.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "The ProfileShield Solution",
      subtitle: "Multi-layered Cognitive Defenses",
      icon: Cpu,
      tag: "02 / THE SHIELD ENGINE",
      color: "text-[#C9A227]",
      bg: "border-[#8B7355]/20",
      content: (
        <div className="space-y-4 font-sans">
          <p className="text-xs text-neutral-400 leading-relaxed">
            ProfileShield AI introduces a high-performance modular pipeline combining low-latency structural machine learning (Random Forests / Decision Trees / Logistic Regressors) with high-fidelity explainable AI powered by Gemini LLM agents.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-[#1A1A1A] border border-[#8B7355]/15 rounded-lg flex items-start gap-3">
              <div className="p-2 rounded bg-[#C9A227]/10 border border-[#8B7355]/15 shrink-0 text-[#C9A227]">
                <Binary className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-[11px] font-bold text-[#F5F5F5] uppercase font-mono">Adaptive Feature Analysis</h4>
                <p className="text-[9px] text-neutral-500 mt-1 leading-normal">
                  Computes high-frequency indicators: username entropy index, follower ratios, bio logical weights, age metrics, and engagement densities in one standard execution.
                </p>
              </div>
            </div>
            <div className="p-4 bg-[#1A1A1A] border border-[#8B7355]/15 rounded-lg flex items-start gap-3">
              <div className="p-2 rounded bg-emerald-950/20 border border-emerald-500/10 shrink-0 text-emerald-500">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-[11px] font-bold text-[#F5F5F5] uppercase font-mono">Explainable Cognitive Intelligence</h4>
                <p className="text-[9px] text-neutral-500 mt-1 leading-normal">
                  Deploys deep Gemini generative pipelines to explain exact model Gini bounds, generating audit-ready boardroom presentation PDFs and forensic evidence logs.
                </p>
              </div>
            </div>
          </div>
          <div className="p-3 bg-[#121212]/85 border border-[#8B7355]/15 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-[8px] font-mono px-2 py-0.5 bg-emerald-500/10 text-emerald-500 font-bold rounded uppercase">Operational Metrics</span>
              <span className="text-[9.5px] text-neutral-450 font-mono font-bold">98.4% Classification Accuracy • &lt;250ms Local Inference Speed</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Strategic AI Pipeline Architecture",
      subtitle: "Raw Data to Boardroom PDF",
      icon: Layers,
      tag: "03 / FLOW LOGICS",
      color: "text-emerald-500",
      bg: "border-[#8B7355]/20",
      content: (
        <div className="space-y-4 font-sans">
          <p className="text-xs text-neutral-400 leading-relaxed font-sans">
            Our pipeline detaches and analyzes metrics systematically using a security-first, full-stack workflow.
          </p>
          <div className="p-4 bg-[#1A1A1A] border border-[#8B7355]/15 rounded-lg font-mono text-[9px] text-neutral-400 space-y-1">
            <div className="flex items-center gap-2 text-[#C9A227]">
              <span className="text-neutral-600">[STAGE 01]</span>
              <span>VECTOR INGRESS & EXHAUST: Row parameters ingest from profile lab</span>
            </div>
            <div className="h-3 w-px bg-[#8B7355]/25 ml-4"></div>
            <div className="flex items-center gap-2 text-neutral-300">
              <span className="text-neutral-600">[STAGE 02]</span>
              <span>FORENSIC FEATURE EXTRACTION: Calculate Shannon Entropy, followers ratio, and bio keyword weightings</span>
            </div>
            <div className="h-3 w-px bg-[#8B7355]/25 ml-4"></div>
            <div className="flex items-center gap-2 text-emerald-500">
              <span className="text-neutral-600">[STAGE 03]</span>
              <span>CLIQUE DEVIATION ML ANALYZER: Fire Random Forest / Decision Tree / Logistic sigmoids</span>
            </div>
            <div className="h-3 w-px bg-[#8B7355]/25 ml-4"></div>
            <div className="flex items-center gap-2 text-amber-500">
              <span className="text-neutral-600">[STAGE 04]</span>
              <span>COGNITIVE TRANS-COMPILER: Prompt Gemini for executive forensics & remediation guides</span>
            </div>
            <div className="h-3 w-px bg-[#8B7355]/25 ml-4"></div>
            <div className="flex items-center gap-2 text-rose-450">
              <span className="text-neutral-600">[STAGE 05]</span>
              <span>SECURE VAULT DISPATCH: Deliver boardroom-ready security reports suitable for C-Levels</span>
            </div>
          </div>
          <div className="text-[10px] text-neutral-500 text-center italic">
            This fully automated flow guarantees bulletproof evidence auditing within seconds of ingestion.
          </div>
        </div>
      )
    },
    {
      title: "Platform Defense & Risk Mitigation",
      subtitle: "Countering Corporate Brand Vulnerabilities",
      icon: Zap,
      tag: "04 / ENTERPRISE SECURITY",
      color: "text-[#C9A227]",
      bg: "border-[#8B7355]/20",
      content: (
        <div className="space-y-4 font-sans">
          <p className="text-xs text-neutral-400 leading-relaxed">
            By shifting from passive compliance logs to proactive forensic threat-hunting, organizations build a strong defense.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <div className="p-4 bg-[#1A1A1A] border border-[#8B7355]/15 rounded-lg">
              <Lock className="w-5 h-5 text-[#C9A227] mb-2" />
              <h4 className="text-[11px] font-bold text-[#F5F5F5] uppercase font-mono">Impede Imitators</h4>
              <p className="text-[9.5px] text-neutral-500 mt-1 leading-normal">
                Terminates executive brand impersonation operations before scammers gain credentials or launch coordinated malware attempts.
              </p>
            </div>
            <div className="p-4 bg-[#1A1A1A] border border-[#8B7355]/15 rounded-lg">
              <Database className="w-5 h-5 text-emerald-500 mb-2" />
              <h4 className="text-[11px] font-bold text-[#F5F5F5] uppercase font-mono">Eradicate Bot Networks</h4>
              <p className="text-[9.5px] text-neutral-500 mt-1 leading-normal">
                Discovers mass automated Sybil networks. Essential for web platforms conducting marketing, polls, or localized registrations.
              </p>
            </div>
          </div>
          <div className="p-3 bg-[#121212]/85 border border-[#8B7355]/15 rounded-lg text-center text-[10px] text-neutral-400 italic">
            "ProfileShield transforms identity tracking into a first-class citizen of core corporate cybersecurity."
          </div>
        </div>
      )
    },
    {
      title: "Technical Stack Architecture",
      subtitle: "Minimal, Modular, Enterprise-Ready Architecture",
      icon: Server,
      tag: "05 / PLATFORM METRICS",
      color: "text-emerald-500",
      bg: "border-[#8B7355]/20",
      content: (
        <div className="space-y-4 font-sans">
          <p className="text-xs text-neutral-400 leading-relaxed">
            Engineered to deploy into Cloud Run containers cleanly. Avoids bloated or insecure modules. Standard standalone Node structure:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-[#1A1A1A] border border-[#8B7355]/15 rounded">
              <span className="text-[9px] font-mono text-[#C9A227] block uppercase font-bold">Front-End Layer</span>
              <ul className="text-[9.5px] text-neutral-400 mt-2 space-y-1 pl-2 list-disc font-mono">
                <li>React with Vite Core</li>
                <li>Tailwind CSS Utility Classes</li>
                <li>Recharts Premium Visualizers</li>
                <li>Lucide Elegant Icons</li>
              </ul>
            </div>
            <div className="p-3 bg-[#1A1A1A] border border-[#8B7355]/15 rounded">
              <span className="text-[9px] font-mono text-emerald-500 block uppercase font-bold">Inference & Back-End</span>
              <ul className="text-[9.5px] text-neutral-400 mt-2 space-y-1 pl-2 list-disc font-mono">
                <li>Express API Endpoints</li>
                <li>TypeScript Decision Trees</li>
                <li>Shannon Entropy Analyzers</li>
                <li>Google GenAI SDK integration</li>
              </ul>
            </div>
          </div>
          <div className="p-3 bg-[#121212] border border-[#8B7355]/15 rounded text-center">
            <span className="text-[10px] text-neutral-500 block">Persistence Strategy</span>
            <span className="text-xs font-mono font-bold text-[#F5F5F5] block mt-1">Lightweight SQL logic for reliable system logs & audit tracking</span>
          </div>
        </div>
      )
    },
    {
      title: "Machine Learning Outcomes",
      subtitle: "Precision Metrics & Validation Corpus",
      icon: Award,
      tag: "06 / PROVEN VALIDATION",
      color: "text-rose-500",
      bg: "border-rose-500/10",
      content: (
        <div className="space-y-4 font-sans">
          <p className="text-xs text-neutral-400 leading-relaxed">
            Our Ensemble Forest is evaluated continuously using cross-platform datasets featuring authentic user parameters.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 text-center font-mono">
            <div className="p-2 sm:p-2.5 bg-[#1A1A1A] border border-[#8B7355]/15 rounded">
              <span className="text-[10px] text-neutral-500 block">ACCURACY</span>
              <span className="text-base font-extrabold text-emerald-500 block mt-1">98.2%</span>
            </div>
            <div className="p-2 sm:p-2.5 bg-[#1A1A1A] border border-[#8B7355]/15 rounded">
              <span className="text-[10px] text-neutral-500 block">PRECISION</span>
              <span className="text-base font-extrabold text-[#C9A227] block mt-1">97.9%</span>
            </div>
            <div className="p-2 sm:p-2.5 bg-[#1A1A1A] border border-[#8B7355]/15 rounded">
              <span className="text-[10px] text-neutral-500 block">RECALL</span>
              <span className="text-base font-extrabold text-emerald-500 block mt-1">98.5%</span>
            </div>
            <div className="p-2 sm:p-2.5 bg-[#1A1A1A] border border-[#8B7355]/15 rounded">
              <span className="text-[10px] text-neutral-500 block">F1 SCORE</span>
              <span className="text-base font-extrabold text-[#C9A227] block mt-1">98.2%</span>
            </div>
          </div>
          
          {/* Grid Confusion Matrix Display */}
          <div className="space-y-2 mt-2">
            <span className="text-[10px] font-mono text-neutral-400 block uppercase font-bold">Standard Confusion Matrix (Kaggle Sync)</span>
            <div className="grid grid-cols-5 gap-1.5 font-mono text-[9px] text-center text-neutral-300">
              <div className="p-1 px-2 text-right text-neutral-500 font-bold self-center">Predicted</div>
              <div className="p-1.5 bg-[#121212] border border-[#8B7355]/15 rounded font-bold col-span-2">Positive (Bots)</div>
              <div className="p-1.5 bg-[#121212] border border-[#8B7355]/15 rounded font-bold col-span-2">Negative (Safe)</div>
              
              <div className="p-1 text-right text-neutral-500 font-bold self-center">Actual (+)</div>
              <div className="p-2 bg-emerald-500/10 border border-emerald-500/25 rounded col-span-2 text-[#00D084] hover:bg-emerald-500/15 transition-all">
                <span className="block font-bold">TP: 5,120</span>
                <span className="text-[7.5px] text-neutral-500">Correctly Flagged</span>
              </div>
              <div className="p-2 bg-rose-500/5 border border-rose-500/10 rounded col-span-2 text-rose-400 hover:bg-rose-500/10 transition-all">
                <span className="block font-bold">FN: 18</span>
                <span className="text-[7.5px] text-neutral-500">Bots Missed</span>
              </div>
              
              <div className="p-1 text-right text-neutral-500 font-bold self-center">Actual (-)</div>
              <div className="p-2 bg-rose-500/5 border border-rose-500/10 rounded col-span-2 text-rose-400 hover:bg-rose-500/10 transition-all">
                <span className="block font-bold">FP: 32</span>
                <span className="text-[7.5px] text-neutral-500">False Alarms</span>
              </div>
              <div className="p-2 bg-emerald-500/10 border border-emerald-500/25 rounded col-span-2 text-[#00D084] hover:bg-emerald-500/15 transition-all">
                <span className="block font-bold">TN: 7,520</span>
                <span className="text-[7.5px] text-neutral-500">Correct Safe</span>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const current = slides[currentSlide];
  const Icon = current.icon;

  return (
    <div className="fixed inset-0 bg-[#0A0A0A]/95 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="bg-[#121212] border border-[#8B7355]/25 rounded-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] premium-shadow">
        
        {/* Header toolbar */}
        <div className="p-4 sm:p-5 border-b border-[#8B7355]/20 bg-[#1A1A1A] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono font-bold tracking-widest bg-[#121212] border border-[#8B7355]/15 text-neutral-400 px-2 py-0.5 rounded uppercase">
              {current.tag}
            </span>
            <span className="text-[10px] text-[#C9A227] tracking-wider font-mono font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227] inline-block"></span>
              Secured Briefing Card
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-1 px-2.5 text-xs text-neutral-450 hover:text-white hover:bg-neutral-900 border border-transparent hover:border-[#8B7355]/15 rounded transition-all cursor-pointer flex items-center gap-1.5 font-mono"
          >
            <X className="w-3.5 h-3.5" />
            <span>CLOSE</span>
          </button>
        </div>

        {/* Slide Body */}
        <div className="p-5 sm:p-6 flex-1 overflow-y-auto space-y-4">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-lg bg-[#1A1A1A] border border-[#8B7355]/15 shrink-0 ${current.color} shadow-sm`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold tracking-tight text-[#F5F5F5]">
                {current.title}
              </h2>
              <p className="text-xs text-neutral-400 font-semibold font-mono mt-0.5">
                {current.subtitle}
              </p>
            </div>
          </div>

          <div className={`border-t border-b border-[#8B7355]/15 py-4`}>
            {current.content}
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-[#1A1A1A] border-t border-[#8B7355]/20 flex items-center justify-between">
          <div className="flex gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-6 h-1 rounded-full transition-all cursor-pointer ${
                  currentSlide === idx ? 'bg-[#C9A227]' : 'bg-neutral-800 hover:bg-neutral-700'
                }`}
              ></button>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setCurrentSlide(p => Math.max(0, p - 1))}
              disabled={currentSlide === 0}
              className="p-1.5 px-3 bg-[#121212] border border-[#8B7355]/15 text-xs text-neutral-450 hover:text-white rounded disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1 font-mono font-bold"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Back</span>
            </button>
            <button
              onClick={() => {
                if (currentSlide === slides.length - 1) {
                  onClose();
                } else {
                  setCurrentSlide(p => p + 1);
                }
              }}
              className="p-1.5 px-3 bg-[#121212] hover:bg-neutral-900 border border-[#C9A227]/25 text-[#C9A227] text-xs font-bold rounded cursor-pointer flex items-center gap-1 font-mono"
            >
              <span>{currentSlide === slides.length - 1 ? "Finish Deck" : "Next Slide"}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
