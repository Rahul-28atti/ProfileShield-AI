/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Shield, Sparkles } from 'lucide-react';
import AuthScreen from './components/AuthScreen';
import Sidebar from './components/Sidebar';
import DashboardScreen from './components/DashboardScreen';
import ScanScreen from './components/ScanScreen';
import AnalyticsScreen from './components/AnalyticsScreen';
import ReportsScreen from './components/ReportsScreen';
import AdminScreen from './components/AdminScreen';
import ArchitectureScreen from './components/ArchitectureScreen';
import PitchDeckModal from './components/PitchDeckModal';
import { User } from './types';

export default function App() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [activeScreen, setActiveScreen] = useState<string>('dashboard');
  const [loading, setLoading] = useState<boolean>(true);
  const [demoMode, setDemoMode] = useState<boolean>(false);
  const [isPitchOpen, setIsPitchOpen] = useState<boolean>(false);
  
  // High-performance trigger to signal sibling widgets to reload telemetry (such as stats or charts) immediately
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  useEffect(() => {
    // Audit active cache for login sessions
    const savedToken = localStorage.getItem('profileshield_token');
    const savedUser = localStorage.getItem('profileshield_user');
    
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        
        // Ping security node to verify token is still secure and legal
        fetch('/api/auth/me', {
          headers: { 'Authorization': `Bearer ${savedToken}` }
        }).then(res => {
          if (!res.ok) {
            handleLogout();
          }
        }).catch(() => {
          // Keep offline if server is temporarily warming up
        });
      } catch (e) {
        handleLogout();
      }
    }
    setLoading(false);
  }, []);

  const handleLoginSuccess = (newUser: User, newToken: string) => {
    localStorage.setItem('profileshield_token', newToken);
    localStorage.setItem('profileshield_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    setActiveScreen('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('profileshield_token');
    localStorage.removeItem('profileshield_user');
    setToken(null);
    setUser(null);
    setActiveScreen('dashboard');
  };

  const triggerGlobalSync = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] flex flex-col items-center justify-center font-sans">
        <div className="w-12 h-12 bg-[#121212] border border-[#8B7355]/30 rounded-xl flex items-center justify-center mb-4 shadow-sm">
          <Shield className="w-6 h-6 text-[#C9A227]" />
        </div>
        <p className="text-xs font-mono tracking-wider text-neutral-500 uppercase">Synchronizing Security Environment...</p>
      </div>
    );
  }

  // A. Guest users view
  if (!token) {
    return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
  }

  // B. Enrolled security analyst shell layout
  return (
    <div className="flex h-screen bg-[#0A0A0A] text-[#F5F5F5] font-sans overflow-hidden flex-col">
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Sidebar navigation */}
        <Sidebar 
          activeScreen={activeScreen} 
          setActiveScreen={setActiveScreen} 
          user={user} 
          onLogout={handleLogout} 
          demoMode={demoMode}
          setDemoMode={setDemoMode}
        />

        {/* Primary viewport content context */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#0A0A0A]">
          {activeScreen === 'dashboard' && (
            <DashboardScreen 
              token={token} 
              onNavigateToScan={() => setActiveScreen('scan')} 
              demoMode={demoMode}
            />
          )}
          
          {activeScreen === 'scan' && (
            <ScanScreen 
              token={token} 
              onAnalysisSuccess={triggerGlobalSync} 
              demoMode={demoMode}
            />
          )}
          
          {activeScreen === 'analytics' && (
            <AnalyticsScreen 
              token={token} 
              refreshTrigger={refreshTrigger} 
              demoMode={demoMode}
            />
          )}
          
          {activeScreen === 'reports' && (
            <ReportsScreen 
              token={token} 
              refreshTrigger={refreshTrigger} 
              onScansDeleted={triggerGlobalSync} 
              demoMode={demoMode}
            />
          )}
          
          {activeScreen === 'architecture' && (
            <ArchitectureScreen />
          )}
          
          {activeScreen === 'admin' && user?.role === 'admin' && (
            <AdminScreen 
              token={token} 
              demoMode={demoMode}
            />
          )}
        </main>
      </div>
    </div>
  );
}
