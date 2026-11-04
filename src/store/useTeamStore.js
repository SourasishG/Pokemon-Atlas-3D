import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useTeamStore = create(
  persist(
    (set, get) => ({
      teamName: "Cosmic Atlas Team Alpha",
      team: [], // Max 6 normalized pokemon objects

      setTeamName: (name) => set({ teamName: name }),

      addToTeam: (pokemon) => {
        const currentTeam = get().team;
        if (currentTeam.length >= 6) {
          return {
            success: false,
            message: "Team is full! Maximum 6 Pokémon allowed.",
          };
        }
        if (currentTeam.some((m) => m.id === pokemon.id)) {
          return {
            success: false,
            message: `${pokemon.displayName} is already in your team.`,
          };
        }

        set({ team: [...currentTeam, pokemon] });
        return {
          success: true,
          message: `Added ${pokemon.displayName} to team!`,
        };
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

      importTeamJSON: (jsonString) => {
        try {
          if (typeof jsonString !== "string" || !jsonString.trim()) {
            return { success: false, message: "Invalid or empty JSON input." };
          }

          const parsed = JSON.parse(jsonString);
          if (!parsed || typeof parsed !== "object") {
            return {
              success: false,
              message: "Invalid JSON format: root must be an object.",
            };
          }

          const newName =
            typeof parsed.teamName === "string" && parsed.teamName.trim()
              ? parsed.teamName.trim().slice(0, 50)
              : get().teamName;

          if (!Array.isArray(parsed.members)) {
            return {
              success: false,
              message: "Invalid team format: members must be an array.",
            };
          }

          const validMembers = [];
          const seenIds = new Set();

          for (const m of parsed.members) {
            if (!m || typeof m !== "object") continue;
            const id = Number(m.id);
            if (!id || isNaN(id) || id < 1 || seenIds.has(id)) continue;
            seenIds.add(id);

            const name =
              typeof m.name === "string" ? m.name.toLowerCase().trim() : "";
            const displayName =
              typeof m.displayName === "string" && m.displayName.trim()
                ? m.displayName.trim()
                : name
                  ? name.charAt(0).toUpperCase() + name.slice(1)
                  : `Pokémon #${id}`;

            const types = Array.isArray(m.types)
              ? m.types.map((t) => {
                  const typeName =
                    typeof t === "string"
                      ? t.toLowerCase().trim()
                      : t?.name || "normal";
                  return { name: typeName };
                })
              : [{ name: "normal" }];

            const totalStats = Number(m.totalStats) || 300;
            const image =
              m.image ||
              `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
            const stats = Array.isArray(m.stats)
              ? m.stats
              : [{ name: "speed", value: 70 }];

            validMembers.push({
              id,
              name: name || `pokemon-${id}`,
              displayName,
              image,
              types,
              stats,
              totalStats,
            });

            if (validMembers.length === 6) break;
          }

          if (validMembers.length === 0) {
            return {
              success: false,
              message: "No valid Pokémon members found in JSON file.",
            };
          }

          set({ teamName: newName, team: validMembers });
          return {
            success: true,
            message: `Successfully loaded ${validMembers.length} Pokémon into "${newName}"!`,
          };
        } catch (err) {
          return {
            success: false,
            message: `JSON parsing error: ${err.message}`,
          };
        }
      },

      getTeamTextSummary: () => {
        const state = get();
        const membersList = state.team
          .map(
            (m, i) =>
              `${i + 1}. ${m.displayName} (${m.types.map((t) => t.name).join("/")}) - BST: ${m.totalStats}`,
          )
          .join("\n");
        return `⚡ Pokémon Atlas 3D - Team: "${state.teamName}" ⚡\n${membersList}\n\nBuild yours at Pokémon Atlas 3D!`;
      },
    }),
    {
      name: "pokemon-atlas-team",
    },
  ),
);
