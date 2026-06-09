import React from 'react';
import { 
  Cpu, 
  Workflow, 
  Layers, 
  Database, 
  ShieldCheck, 
  Share2, 
  Sliders, 
  Terminal,
  Activity,
  Award,
  BookOpen
} from 'lucide-react';

export default function ArchitectureScreen() {
  const modelInputs = [
    { name: 'Followers Count', desc: 'Raw followers quantity defining organic audience baseline.' },
    { name: 'Following Count', desc: 'Outreach metric useful for detecting automation or follow-bot campaigns.' },
    { name: 'Posts Count', desc: 'Identifies total output size compared against registration timeframes.' },
    { name: 'Account Age', desc: 'Age in months. Newly registered accounts have high baseline risk weights.' },
    { name: 'Bio Description Length', desc: 'Assesses information density and checks for repetitive spam keywords.' },
    { name: 'Profile Picture Validity', desc: 'Boolean indicator representing whether an avatar has been uploaded.' }
  ];

  const pipelineSteps = [
    {
      step: '01',
      title: 'Data Ingress & Normalization',
      desc: 'The platform ingests primary metadata profiles on-demand or via scheduled API feeds, normalizing numeric counts, bios, and platforms.',
      icon: Database,
      color: '#8B7355'
    },
    {
      step: '02',
      title: 'Linguistic & Entropy Analysis',
      desc: 'Computes character-sequence Shannon Entropy on usernames to detect algorithmically-generated accounts, and flags spam vocabulary.',
      icon: Sliders,
      color: '#C9A227'
    },
    {
      step: '03',
      title: 'Ensemble Classification',
      desc: 'Runs the features through a local Random Forest Classifier of 120 bootstrapped trees. Nodes split greedily based on Gini impurities.',
      icon: Cpu,
      color: '#C9A227'
    },
    {
      step: '04',
      title: 'AI Forensic Explanation',
      desc: 'The model outcome and active feature weights are processed by Gemini AI on the backend to produce high-fidelity human reasoning on threat findings.',
      icon: Workflow,
      color: '#8B7355'
    },
    {
      step: '05',
      title: 'Compliance Reports',
      desc: 'Compiles the results into secure database logs, plaintext downloads, and formatted printable client-ready briefing files.',
      icon: ShieldCheck,
      color: '#10B981'
    }
  ];

  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-[#0A0A0A] text-[#F5F5F5] font-sans">
      
      {/* Header */}
      <div className="border-b border-[#8B7355]/20 pb-5">
        <h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl uppercase">
          System Architecture & Methodology
        </h1>
        <p className="text-xs text-[#A0A0A0] mt-1 font-mono">
          Methodological overview, local machine learning pipelines, and cognitive explainability structures.
        </p>
      </div>

      {/* Grid: About and Model Information */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left: About Project */}
        <div className="lg:col-span-7 bg-[#121212] rounded-xl p-6 border border-[#8B7355]/20 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-[#8B7355]/15 pb-3">
              <BookOpen className="w-4 h-4 text-[#C9A227]" />
              <h4 className="text-xs font-bold text-white uppercase tracking-widest font-mono">
                About The Project
              </h4>
            </div>

            <p className="text-xs text-[#A0A0A0] leading-relaxed">
              ProfileShield AI is an enterprise-grade trust-and-safety utility designed for compliance analysts, trust teams, and commercial platforms. By verifying the authenticity of social accounts, ProfileShield protects corporate communities from coordinated botnets, automated spam networks, counterfeit executive profiles, and modern phishing schemes.
            </p>
            <p className="text-xs text-[#A0A0A0] leading-relaxed">
              Unlike traditional black-box detection filters, ProfileShield pairs a high-performance ensemble model with real-time semantic explainability. Each verification results in a structured log accompanied by a human-readable forensic breakdown, creating audits that can be validated, signed, and certified.
            </p>
          </div>

          <div className="pt-4 border-t border-[#8B7355]/10 grid grid-cols-3 gap-3 text-center">
            <div className="p-3.5 bg-[#1A1A1A] border border-[#8B7355]/15 rounded-lg">
              <span className="text-[10px] text-neutral-500 uppercase font-bold font-mono">MODEL PRECISION</span>
              <span className="text-base font-black text-[#10B981] block mt-1">Institutional</span>
            </div>
            <div className="p-3.5 bg-[#1A1A1A] border border-[#8B7355]/15 rounded-lg">
              <span className="text-[10px] text-neutral-500 uppercase font-bold font-mono">INFERENCE SPEED</span>
              <span className="text-base font-black text-[#C9A227] block mt-1">&lt; 150ms</span>
            </div>
            <div className="p-3.5 bg-[#1A1A1A] border border-[#8B7355]/15 rounded-lg">
              <span className="text-[10px] text-neutral-500 uppercase font-bold font-mono">EXPLAINABILITY</span>
              <span className="text-base font-black text-[#10B981] block mt-1">Dual-Tier</span>
            </div>
          </div>
        </div>

        {/* Right: Model Information Section */}
        <div className="lg:col-span-5 bg-[#121212] rounded-xl p-6 border border-[#8B7355]/20 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-[#8B7355]/15 pb-3">
              <Cpu className="w-4 h-4 text-[#C9A227]" />
              <h4 className="text-xs font-bold text-white uppercase tracking-widest font-mono">
                Model Specifications
              </h4>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-[#1A1A1A] border border-[#8B7355]/15 rounded-lg flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-300 font-sans">Core Learning Algorithm</span>
                <span className="px-2.5 py-1 bg-[#121212] border border-[#8B7355]/25 rounded text-[10px] font-bold text-[#C9A227] font-mono uppercase">
                  Random Forest
                </span>
              </div>

              <div>
                <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider font-bold block mb-2">Input Features Map</span>
                <div className="grid grid-cols-2 gap-2 text-[10px] font-sans">
                  <div className="px-2.5 py-1.5 bg-[#1A1A1A] border border-white/5 rounded text-neutral-300 font-mono">
                    • Followers count
                  </div>
                  <div className="px-2.5 py-1.5 bg-[#1A1A1A] border border-white/5 rounded text-neutral-300 font-mono">
                    • Following count
                  </div>
                  <div className="px-2.5 py-1.5 bg-[#1A1A1A] border border-white/5 rounded text-neutral-300 font-mono">
                    • Posts frequency
                  </div>
                  <div className="px-2.5 py-1.5 bg-[#1A1A1A] border border-white/5 rounded text-neutral-300 font-mono">
                    • Account Age (months)
                  </div>
                  <div className="px-2.5 py-1.5 bg-[#1A1A1A] border border-white/5 rounded text-neutral-300 font-mono">
                    • Bio Length / Lexicon
                  </div>
                  <div className="px-2.5 py-1.5 bg-[#1A1A1A] border border-white/5 rounded text-neutral-300 font-mono">
                    • Profile pic indicator
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider font-bold block mb-2">Classifier Output Classifications</span>
                <div className="grid grid-cols-3 gap-2 text-[10px] text-center font-mono">
                  <div className="py-1 bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/25 rounded font-bold uppercase text-[9px]">
                    Safe
                  </div>
                  <div className="py-1 bg-[#F59E0B]/10 text-amber-500 border border-[#F59E0B]/25 rounded font-bold uppercase text-[9px]">
                    Suspicious
                  </div>
                  <div className="py-1 bg-red-500/10 text-red-500 border border-red-500/25 rounded font-bold uppercase text-[9px]">
                    Fraudulent
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section: Data Flow Visualization */}
      <div className="bg-[#121212] rounded-xl p-6 border border-[#8B7355]/20 space-y-6 shadow-sm">
        <div className="flex items-center gap-2 border-b border-[#8B7355]/15 pb-3">
          <Workflow className="w-4 h-4 text-[#C9A227]" />
          <h4 className="text-xs font-bold text-white uppercase tracking-widest font-mono">
            Pipeline Architect & Data Flow
          </h4>
        </div>

        {/* CSS Flex Data Flow Diagram */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 py-3">
          {pipelineSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <React.Fragment key={idx}>
                <div className="flex-1 w-full lg:w-auto bg-[#1A1A1A] border border-[#8B7355]/20 rounded-xl p-4 space-y-2 select-none hover:border-[#8B7355]/40 transition duration-155">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono text-neutral-500 font-black">{step.step}</span>
                    <Icon className="w-3.5 h-3.5" style={{ color: step.color }} />
                  </div>
                  <h5 className="text-[11px] font-bold text-white font-sans">{step.title}</h5>
                  <p className="text-[10px] text-neutral-400 leading-normal font-sans">{step.desc}</p>
                </div>
                {idx < pipelineSteps.length - 1 && (
                  <div className="hidden lg:flex items-center justify-center shrink-0">
                    <span className="text-[#8B7355] text-xs font-mono font-bold">→</span>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Model Feature Explainer Row */}
      <div className="bg-[#121212] rounded-xl p-6 border border-[#8B7355]/20 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 border-b border-[#8B7355]/15 pb-3">
          <Layers className="w-4 h-4 text-[#C9A227]" />
          <h4 className="text-xs font-bold text-white uppercase tracking-widest font-mono">
            Statistical Input Variables Breakdown
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modelInputs.map((input, idx) => (
            <div key={idx} className="p-4 bg-[#1A1A1A] rounded-lg border border-white/5 space-y-1">
              <span className="text-[10px] font-mono text-[#C9A227] font-bold block">{input.name}</span>
              <p className="text-[10.5px] text-neutral-400 leading-relaxed font-sans">{input.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
