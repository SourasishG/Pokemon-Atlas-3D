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

  it('imports valid team JSON correctly', () => {
    const validJSON = JSON.stringify({
      teamName: 'Champion League Squad',
      members: [
        { id: 25, name: 'pikachu', displayName: 'Pikachu', types: ['electric'], totalStats: 320 },
        { id: 6, name: 'charizard', displayName: 'Charizard', types: ['fire', 'flying'], totalStats: 534 },
      ],
    });

    const res = useTeamStore.getState().importTeamJSON(validJSON);
    expect(res.success).toBe(true);
    expect(useTeamStore.getState().teamName).toBe('Champion League Squad');
    expect(useTeamStore.getState().team.length).toBe(2);
    expect(useTeamStore.getState().isInTeam(25)).toBe(true);
    expect(useTeamStore.getState().isInTeam(6)).toBe(true);
  });

  it('sanitizes imported team: prevents duplicate IDs and enforces max 6 members', () => {
    const rawJSON = JSON.stringify({
      teamName: 'Oversized Squad',
      members: [
        { id: 1, name: 'mon-1' },
        { id: 1, name: 'mon-1-dup' },
        { id: 2, name: 'mon-2' },
        { id: 3, name: 'mon-3' },
        { id: 4, name: 'mon-4' },
        { id: 5, name: 'mon-5' },
        { id: 6, name: 'mon-6' },
        { id: 7, name: 'mon-7' },
      ],
    });

    const res = useTeamStore.getState().importTeamJSON(rawJSON);
    expect(res.success).toBe(true);
    expect(useTeamStore.getState().team.length).toBe(6);
    expect(useTeamStore.getState().isInTeam(7)).toBe(false);
  });

  it('rejects malformed or empty JSON gracefully', () => {
    const badRes1 = useTeamStore.getState().importTeamJSON('');
    expect(badRes1.success).toBe(false);

    const badRes2 = useTeamStore.getState().importTeamJSON('invalid json {{{');
    expect(badRes2.success).toBe(false);

    const badRes3 = useTeamStore.getState().importTeamJSON(JSON.stringify({ members: 'not-an-array' }));
    expect(badRes3.success).toBe(false);
  });
});
