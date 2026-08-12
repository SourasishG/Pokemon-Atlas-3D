import React from 'react';
import { Shield, Zap, AlertTriangle, Download, Copy, BarChart3, Award } from 'lucide-react';
import { analyzeTeam } from '../../utils/teamAnalytics';
import { useTeamStore } from '../../store/useTeamStore';
import { usePokemonStore } from '../../store/usePokemonStore';
import TypeBadge from '../pokemon/TypeBadge';

export default function TeamAnalysis() {
  const team = useTeamStore((state) => state.team);
  const teamName = useTeamStore((state) => state.teamName);
  const exportTeamJSON = useTeamStore((state) => state.exportTeamJSON);
  const getTeamTextSummary = useTeamStore((state) => state.getTeamTextSummary);
  const showToast = usePokemonStore((state) => state.showToast);

  const analytics = analyzeTeam(team);

  if (team.length === 0) return null;

  const handleCopySummary = () => {
    const text = getTeamTextSummary();
    navigator.clipboard.writeText(text);
    showToast('Team summary copied to clipboard!', 'success');
  };

  const handleExportJSON = () => {
    const jsonStr = exportTeamJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${teamName.toLowerCase().replace(/\s+/g, '_')}_team.json`;
    a.click();
    showToast('Team JSON downloaded!', 'success');
  };

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-8">
      {/* Analysis Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase">
            <BarChart3 className="w-4 h-4" />
            <span>Holographic Coverage & Stat Analytics</span>
          </div>
          <h3 className="text-2xl font-black uppercase text-white tracking-tight mt-1">
            {teamName} Report
          </h3>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopySummary}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono font-bold uppercase text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 flex items-center gap-2 transition-all"
          >
            <Copy className="w-4 h-4 text-cyan-400" />
            <span>Copy Text</span>
          </button>
          <button
            onClick={handleExportJSON}
            className="px-4 py-2.5 rounded-xl bg-cyan-500 text-slate-950 text-xs font-mono font-extrabold uppercase border border-cyan-400 hover:bg-cyan-400 flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
          >
            <Download className="w-4 h-4" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Key Stats Benchmarks Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Total Team BST</span>
          <div className="text-2xl font-mono font-black text-cyan-400">{analytics.totalStats}</div>
          <span className="text-[10px] text-slate-500 font-mono">Avg: {analytics.avgStats} per member</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Fastest Member</span>
          <div className="text-sm font-bold text-yellow-400 uppercase truncate">
            {analytics.fastest?.displayName || 'N/A'}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            SPD: {analytics.fastest?.stats?.find(s => s.name === 'speed')?.value || 0}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Highest Attack</span>
          <div className="text-sm font-bold text-rose-400 uppercase truncate">
            {analytics.strongestAtk?.displayName || 'N/A'}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            ATK: {analytics.strongestAtk?.stats?.find(s => s.name === 'attack')?.value || 0}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Primary Type</span>
          <div className="mt-1">
            {analytics.mostCommonType ? (
              <TypeBadge type={analytics.mostCommonType} size="sm" />
            ) : (
              <span className="text-xs text-slate-500">None</span>
            )}
          </div>
        </div>
      </div>

      {/* Shared Weaknesses Section */}
      <div className="space-y-3">
        <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>Shared Team Vulnerabilities</span>
        </h4>

        {analytics.sharedWeaknesses.length > 0 ? (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-3">
            <p className="text-xs text-amber-200 leading-relaxed font-mono">
              ⚠️ Attention: Multiple Pokémon in your current squad share defensive weaknesses to these types:
            </p>
            <div className="flex flex-wrap gap-2">
              {analytics.sharedWeaknesses.map(({ type, count }) => (
                <div key={type} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-amber-500/40 text-xs font-mono">
                  <TypeBadge type={type} size="sm" />
                  <span className="text-amber-400 font-bold">x{count} vulnerable</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 font-mono">
            ✅ Outstanding balance! No two team members share a common type vulnerability.
          </div>
        )}
      </div>

      {/* Type Composition Distribution */}
      <div className="space-y-3">
        <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
          Squad Type Distribution
        </h4>
        <div className="flex flex-wrap gap-2">
          {Object.entries(analytics.typeCounts).map(([type, count]) => (
            <div key={type} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs font-mono">
              <TypeBadge type={type} size="sm" />
              <span className="text-cyan-400 font-bold">x{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
