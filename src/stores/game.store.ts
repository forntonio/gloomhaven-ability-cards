'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Game = 'Frosthaven' | 'Jaws of the Lion';

interface GameState {
  game: Game;
  setGame: (game: Game) => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      game: 'Frosthaven',
      setGame: (game) => set({ game }),
    }),
    { name: 'selected-game', storage: createJSONStorage(() => localStorage) }
  )
);
