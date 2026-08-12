import React from 'react';
import { motion } from 'motion/react';
import { Trash2, MoveUp, MoveDown, Shield, Zap } from 'lucide-react';
import TypeBadge from '../pokemon/TypeBadge';
import { Link } from 'react-router-dom';

export default function TeamCard({ member, index, totalMembers, onRemove, onMove }) {
  if (!member) return null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="glass-card rounded-3xl p-5 border border-white/10 relative overflow-hidden flex flex-col justify-between h-[340px]"
    >
      {/* Position Slot Badge */}
      <div className="flex items-center justify-between z-10">
        <span className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 font-mono text-xs font-bold flex items-center justify-center">
          #{index + 1}
        </span>

        {/* Reorder & Remove Controls */}
        <div className="flex items-center gap-1">
          {index > 0 && (
            <button
              onClick={() => onMove(index, index - 1)}
              className="p-1.5 rounded-lg bg-slate-900/60 text-slate-400 hover:text-cyan-400 border border-white/10"
              title="Move Up"
            >
              <MoveUp className="w-3.5 h-3.5" />
            </button>
          )}
          {index < totalMembers - 1 && (
            <button
              onClick={() => onMove(index, index + 1)}
              className="p-1.5 rounded-lg bg-slate-900/60 text-slate-400 hover:text-cyan-400 border border-white/10"
              title="Move Down"
            >
              <MoveDown className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={() => onRemove(member.id)}
            className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 border border-rose-500/40"
            title="Remove Member"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Member Artwork */}
      <Link to={`/pokemon/${member.name}`} className="my-2 flex items-center justify-center">
        <img
          src={member.image}
          alt={member.displayName}
          className="w-28 h-28 object-contain drop-shadow-[0_8px_16px_rgba(6,182,212,0.3)] hover:scale-110 transition-transform"
        />
      </Link>

      {/* Member Details */}
      <div className="space-y-2 text-center z-10">
        <Link to={`/pokemon/${member.name}`} className="block">
          <h4 className="text-lg font-extrabold uppercase text-white hover:text-cyan-400 transition-colors">
            {member.displayName}
          </h4>
        </Link>

        <div className="flex justify-center gap-1">
          {member.types.map((t) => (
            <TypeBadge key={t.name} type={t.name} size="sm" />
          ))}
        </div>

        {/* BST & Speed summary */}
        <div className="pt-2 border-t border-white/10 flex justify-around text-[10px] font-mono text-slate-300">
          <div>BST: <strong className="text-cyan-400">{member.totalStats}</strong></div>
          <div>SPD: <strong className="text-yellow-400">{member.stats.find(s => s.name === 'speed')?.value || 0}</strong></div>
          <div>ATK: <strong className="text-rose-400">{member.stats.find(s => s.name === 'attack')?.value || 0}</strong></div>
        </div>
      </div>
    </motion.div>
  );
}
