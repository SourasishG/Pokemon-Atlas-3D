import React, { useState } from 'react';
import { Shield, Plus, Trash2, Shuffle, Edit3, Sparkles } from 'lucide-react';
import TeamCard from '../components/team/TeamCard';
import TeamAnalysis from '../components/team/TeamAnalysis';
import PokemonSelectModal from '../components/pokemon/PokemonSelectModal';
import EmptyState from '../components/common/EmptyState';
import { useTeamStore } from '../store/useTeamStore';
import { usePokemonStore } from '../store/usePokemonStore';
import { getPokemon } from '../services/pokeapi';

const STARTER_PRESETS = ['charizard', 'greninja', 'lucario', 'gengar', 'garchomp', 'sylveon'];

export default function TeamBuilder() {
  const { teamName, team, setTeamName, addToTeam, removeFromTeam, reorderTeam, clearTeam } =
    useTeamStore();
  const { showToast } = usePokemonStore();

  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(teamName);
  const [loadingRandom, setLoadingRandom] = useState(false);

  const handleNameSave = (e) => {
    e.preventDefault();
    if (tempName.trim()) {
      setTeamName(tempName.trim());
      setIsEditingName(false);
      showToast('Team name updated!', 'success');
    }
  };

  const handleRandomizeStarters = async () => {
    setLoadingRandom(true);
    clearTeam();

    try {
      const results = await Promise.all(STARTER_PRESETS.map((p) => getPokemon(p)));
      results.filter(Boolean).forEach((p) => addToTeam(p));
      showToast('Loaded Iconic Starter Squad!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to load starter preset', 'error');
    } finally {
      setLoadingRandom(false);
    }
  };

  const emptySlotsCount = Math.max(0, 6 - team.length);

  return (
    <div className="space-y-10 pb-16">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase">
            <Shield className="w-4 h-4" />
            <span>Competitive Squad Builder</span>
          </div>

          {/* Editable Team Name */}
          {isEditingName ? (
            <form onSubmit={handleNameSave} className="flex items-center gap-2 mt-1">
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-cyan-500 text-2xl font-black uppercase text-white focus:outline-none"
                autoFocus
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs uppercase"
              >
                Save
              </button>
            </form>
          ) : (
            <div className="flex items-center gap-3 mt-1">
              <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
                {teamName}
              </h1>
              <button
                onClick={() => {
                  setTempName(teamName);
                  setIsEditingName(true);
                }}
                className="p-1.5 text-slate-400 hover:text-cyan-400 transition-colors"
                title="Edit Team Name"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRandomizeStarters}
            disabled={loadingRandom}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono font-bold uppercase text-slate-300 hover:text-cyan-400 flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <Shuffle className="w-4 h-4 text-cyan-400" />
            <span>Preset Squad</span>
          </button>

          {team.length > 0 && (
            <button
              onClick={() => {
                clearTeam();
                showToast('Team cleared', 'info');
              }}
              className="px-4 py-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs font-mono font-bold uppercase hover:bg-rose-500/20 transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear Team</span>
            </button>
          )}
        </div>
      </div>

      {/* 6 Team Slots Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* Filled Slots */}
        {team.map((member, idx) => (
          <TeamCard
            key={member.id}
            member={member}
            index={idx}
            totalMembers={team.length}
            onRemove={removeFromTeam}
            onMove={reorderTeam}
          />
        ))}

        {/* Empty Slot Placeholders */}
        {Array.from({ length: emptySlotsCount }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setIsSelectModalOpen(true)}
            className="glass-card rounded-3xl p-8 border border-dashed border-white/20 hover:border-cyan-500/50 flex flex-col items-center justify-center gap-3 text-center h-[340px] group transition-all"
          >
            <div className="w-14 h-14 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(6,182,212,0.2)]">
              <Plus className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
                Slot #{team.length + idx + 1}
              </span>
              <h4 className="text-base font-bold text-white mt-0.5">Add Pokémon to Squad</h4>
            </div>
          </button>
        ))}
      </div>

      {/* Team Analytics Report */}
      <TeamAnalysis />

      {/* Pokémon Selector Modal */}
      <PokemonSelectModal
        isOpen={isSelectModalOpen}
        onClose={() => setIsSelectModalOpen(false)}
        onSelectPokemon={(p) => {
          const res = addToTeam(p);
          showToast(res.message, res.success ? 'success' : 'error');
        }}
        title="Recruit Squad Member"
      />
    </div>
  );
}
