import React from 'react';
import { getTypeColor } from '../../utils/typeColors';

export default function TypeBadge({ type, size = 'md' }) {
  const typeName = (typeof type === 'string' ? type : type?.name || 'normal').toLowerCase();
  const colorInfo = getTypeColor(typeName);

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-4 py-1.5 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center justify-center font-mono font-bold uppercase tracking-wider rounded-lg border ${colorInfo.badge} ${sizes[size] || sizes.md} transition-all`}
      style={{
        boxShadow: `0 0 10px ${colorInfo.glow}`,
      }}
    >
      {typeName}
    </span>
  );
}
