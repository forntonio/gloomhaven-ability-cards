'use client';
import { useGameStore, type Game } from '@/stores/game.store';

const games: Game[] = ['Frosthaven', 'Jaws of the Lion'];

export default function GameSelector() {
  const { game, setGame } = useGameStore();
  return (
    <select
      aria-label='Select game'
      value={game}
      onChange={(e) => setGame(e.target.value as Game)}
      className='text-black p-2 rounded'
    >
      {games.map((g) => (
        <option key={g} value={g}>
          {g}
        </option>
      ))}
    </select>
  );
}
