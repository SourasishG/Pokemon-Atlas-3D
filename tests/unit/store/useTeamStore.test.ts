import { describe, it, expect, beforeEach } from 'vitest';
import { useTeamStore } from '@/src/store/useTeamStore';

describe('useTeamStore', () => {
  const createMockMon = (id: number, name: string) => ({
    id,
    name,
    displayName: name.charAt(0).toUpperCase() + name.slice(1),
    types: [{ name: 'normal' }],
    totalStats: 400,
  });

  beforeEach(() => {
    useTeamStore.getState().clearTeam();
  });

  it('adds a Pokémon to the team', () => {
    const mon1 = createMockMon(1, 'bulbasaur');
    const res = useTeamStore.getState().addToTeam(mon1);
    expect(res.success).toBe(true);
    expect(useTeamStore.getState().team.length).toBe(1);
    expect(useTeamStore.getState().isInTeam(1)).toBe(true);
  });

  it('prevents adding a duplicate Pokémon to the team', () => {
    const mon1 = createMockMon(1, 'bulbasaur');
    useTeamStore.getState().addToTeam(mon1);
    const res = useTeamStore.getState().addToTeam(mon1);

    expect(res.success).toBe(false);
    expect(res.message).toContain('already in your team');
    expect(useTeamStore.getState().team.length).toBe(1);
  });

  it('enforces maximum team size limit of 6 Pokémon', () => {
    for (let i = 1; i <= 6; i++) {
      const res = useTeamStore.getState().addToTeam(createMockMon(i, `mon-${i}`));
      expect(res.success).toBe(true);
    }

    expect(useTeamStore.getState().team.length).toBe(6);

    // Try adding a 7th member
    const SeventhMon = createMockMon(7, 'mon-7');
    const res7 = useTeamStore.getState().addToTeam(SeventhMon);
    expect(res7.success).toBe(false);
    expect(res7.message).toContain('Team is full');
    expect(useTeamStore.getState().team.length).toBe(6);
  });

  it('removes a member from the team', () => {
    const mon1 = createMockMon(1, 'bulbasaur');
    const mon2 = createMockMon(2, 'ivysaur');
    useTeamStore.getState().addToTeam(mon1);
    useTeamStore.getState().addToTeam(mon2);

    useTeamStore.getState().removeFromTeam(1);
    expect(useTeamStore.getState().team.length).toBe(1);
    expect(useTeamStore.getState().isInTeam(1)).toBe(false);
    expect(useTeamStore.getState().isInTeam(2)).toBe(true);
  });

  it('exports team data as valid JSON string', () => {
    const mon1 = createMockMon(1, 'bulbasaur');
    useTeamStore.getState().addToTeam(mon1);

    const jsonString = useTeamStore.getState().exportTeamJSON();
    expect(typeof jsonString).toBe('string');

    const parsed = JSON.parse(jsonString);
    expect(parsed.teamName).toBeDefined();
    expect(parsed.members.length).toBe(1);
    expect(parsed.members[0].id).toBe(1);
  });
});
