import React from 'react';
import { 
  Shield, 
  Search, 
  LineChart, 
  LayoutDashboard, 
  FileText, 
  LogOut, 
  UserCheck,
  Settings,
  Sparkles,
  Layers,
  Terminal,
  Activity
} from 'lucide-react';
import { User } from '../types';

interface SidebarProps {
  activeScreen: string;
  setActiveScreen: (screen: string) => void;
  user: User | null;
  onLogout: () => void;
  demoMode: boolean;
  setDemoMode: (val: boolean) => void;
}

export default function Sidebar({ 
  activeScreen, 
  setActiveScreen, 
  user, 
  onLogout,
  demoMode,
  setDemoMode
}: SidebarProps) {
  
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'scan', name: 'Profile Analysis', icon: Search },
    { id: 'analytics', name: 'Analytics', icon: LineChart },
    { id: 'reports', name: 'Reports', icon: FileText },
    { id: 'architecture', name: 'System Architecture', icon: Layers },
  ];

  // If user is Admin, insert Admin menu item mapped to Administration
  if (user?.role === 'admin') {
    menuItems.push({ id: 'admin', name: 'Administration', icon: Settings });
  }

  return (
    <aside className="w-64 bg-[#121212] border-r border-[#8B7355]/20 flex flex-col h-screen shrink-0 font-sans select-none justify-between premium-shadow">
      <div>
        {/* Sidebar Brand header - Apple style spacing */}
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
          <div className="w-8 h-8 bg-[#1A1A1A] border border-[#8B7355]/30 rounded-lg flex items-center justify-center">
            <Shield className="w-4.5 h-4.5 text-[#C9A227]" fill="none" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#F5F5F5] tracking-widest block uppercase">
              ProfileShield<span className="text-[#C9A227] font-semibold font-mono text-[9px] ml-1 px-1.5 py-0.5 bg-[#1A1A1A] border border-[#8B7355]/20 rounded font-normal">PRO</span>
            </span>
            <span className="text-[9px] text-neutral-400 font-mono tracking-wider block font-semibold mt-0.5 uppercase flex items-center gap-1">
              Verification Active
            </span>
          </div>
        </div>

        {/* User clearance badge */}
        {user && (
          <div className="px-6 py-4 border-b border-white/5 bg-[#1A1A1A]/40 flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-[#1A1A1A] border border-[#8B7355]/20 flex items-center justify-center shrink-0">
              <UserCheck className="w-3.5 h-3.5 text-neutral-400" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-semibold text-neutral-300 block truncate">
                {user.username}
              </span>
              <span className={`text-[8.5px] font-mono font-bold px-1.5 py-0.5 rounded uppercase tracking-wider inline-block mt-0.5 border ${
                user.role === 'admin' 
                  ? 'bg-amber-500/5 text-[#C9A227] border-[#8B7355]/30' 
                  : 'bg-neutral-800 text-neutral-300 border-neutral-700'
              }`}>
                {user.role} role
              </span>
            </div>
          </div>
        )}

        {/* Navigation list */}
        <div className="p-4 space-y-1 mt-4">
          <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest px-3 block mb-2 font-bold">
            Navigation
          </span>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveScreen(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-md text-[11px] font-medium transition-all duration-150 cursor-pointer text-left ${
                    isActive 
                      ? 'bg-[#1A1A1A] text-[#F5F5F5] border border-[#8B7355]/30 shadow-sm font-semibold' 
                      : 'text-neutral-400 hover:bg-[#1A1A1A]/40 hover:text-[#F5F5F5] border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#C9A227]' : 'text-neutral-500'}`} />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Special Demo Mode & Sign out sections at the bottom */}
      <div className="p-4 border-t border-white/5 bg-[#121212] space-y-3">
        {/* Logout action */}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-[11px] font-medium text-neutral-400 hover:text-[#FF4D4D] hover:bg-[#1A1A1A] transition-all duration-150 cursor-pointer text-left"
        >
          <LogOut className="w-3.5 h-3.5 shrink-0 text-neutral-550" />
          <span>Exit Session</span>
        </button>

        <div className="text-center text-[7.5px] font-mono text-neutral-500 tracking-wider pt-1 uppercase">
          ProfileShield Enterprise System
        </div>
      </div>
    </aside>
  );
}
