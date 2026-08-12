import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useTeamStore = create(
  persist(
    (set, get) => ({
      teamName: 'Cosmic Atlas Team Alpha',
      team: [], // Max 6 normalized pokemon objects

      setTeamName: (name) => set({ teamName: name }),

      addToTeam: (pokemon) => {
        const currentTeam = get().team;
        if (currentTeam.length >= 6) {
          return { success: false, message: 'Team is full! Maximum 6 Pokémon allowed.' };
        }
        if (currentTeam.some((m) => m.id === pokemon.id)) {
          return { success: false, message: `${pokemon.displayName} is already in your team.` };
        }

        set({ team: [...currentTeam, pokemon] });
        return { success: true, message: `Added ${pokemon.displayName} to team!` };
      },

      removeFromTeam: (id) => {
        set((state) => ({
          team: state.team.filter((member) => member.id !== id),
        }));
      },

      reorderTeam: (startIndex, endIndex) => {
        const result = Array.from(get().team);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        set({ team: result });
      },

      clearTeam: () => set({ team: [] }),

      isInTeam: (id) => {
        return get().team.some((member) => member.id === id);
      },

      exportTeamJSON: () => {
        const data = {
          teamName: get().teamName,
          createdAt: new Date().toISOString(),
          members: get().team.map((m) => ({
            id: m.id,
            name: m.name,
            displayName: m.displayName,
            types: m.types.map((t) => t.name),
            totalStats: m.totalStats,
          })),
        };
        return JSON.stringify(data, null, 2);
      },

      getTeamTextSummary: () => {
        const state = get();
        const membersList = state.team
          .map((m, i) => `${i + 1}. ${m.displayName} (${m.types.map((t) => t.name).join('/')}) - BST: ${m.totalStats}`)
          .join('\n');
        return `⚡ Pokémon Atlas 3D - Team: "${state.teamName}" ⚡\n${membersList}\n\nBuild yours at Pokémon Atlas 3D!`;
      },
    }),
    {
      name: 'pokemon-atlas-team',
    }
  )
);
