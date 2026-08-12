import { describe, it, expect } from 'vitest';
import { getTypeColor, TYPE_COLORS } from '@/src/utils/typeColors';

describe('typeColors utility', () => {
  it('returns valid color objects for standard types', () => {
    const fireColor = getTypeColor('fire');
    expect(fireColor.hex).toBe('#f97316');
    expect(fireColor.badge).toBeDefined();

    const waterColor = getTypeColor('water');
    expect(waterColor.hex).toBe('#0284c7');

    const electricColor = getTypeColor('electric');
    expect(electricColor.hex).toBe('#eab308');
  });

  it('handles uppercase or mixed-case type input', () => {
    const fireColor = getTypeColor('FIRE');
    expect(fireColor.hex).toBe('#f97316');

    const grassColor = getTypeColor('GrAsS');
    expect(grassColor.hex).toBe('#16a34a');
  });

  it('falls back to normal type color for missing, null, or unknown types', () => {
    const nullType = getTypeColor(null);
    expect(nullType).toEqual(TYPE_COLORS.normal);

    const undefinedType = getTypeColor(undefined);
    expect(undefinedType).toEqual(TYPE_COLORS.normal);

    const unknownType = getTypeColor('cyberpunk');
    expect(unknownType).toEqual(TYPE_COLORS.normal);
  });
});
