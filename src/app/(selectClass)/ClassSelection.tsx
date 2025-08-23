'use client';
import Image from 'next/image';
import SelectClass from './SelectClass';
import GameSelector from '@/app/_components/GameSelector';
import type { Card } from '@/domain/cards.type';
import type { FrosthavenClass } from '@/domain/frosthaven-class.type';
import { useGameStore } from '@/stores/game.store';

export default function ClassSelection({
  frosthavenClasses,
  jotlClasses,
}: {
  frosthavenClasses: FrosthavenClass<Card>[];
  jotlClasses: FrosthavenClass<Card>[];
}) {
  const game = useGameStore((s) => s.game);
  const classes = game === 'Jaws of the Lion' ? jotlClasses : frosthavenClasses;
  const logo = game === 'Jaws of the Lion' ? '/jotl/jotl-logo.webp' : '/fh-frosthaven-logo.webp';
  return (
    <div className='flex flex-col gap-16 p-16 place-items-center'>
      <header className='flex flex-col items-center gap-4'>
        <Image
          priority
          loading='eager'
          src={logo}
          alt={`${game} logo`}
          width={600}
          height={161}
          unoptimized
        />
        <GameSelector />
      </header>
      <h1 className='text-2xl font-bold text-center text-black hidden'>Select your class</h1>
      {classes.length === 0 ? (
        <p>No classes available for {game}.</p>
      ) : (
        <div className='grid grid-cols-3 lg:grid-cols-6 gap-8 p-6 place-items-center bg-linear-to-b from-black to-blue-500 rounded-lg'>
          {classes.map((fhClass) => (
            <SelectClass key={fhClass.name} fhClass={fhClass} />
          ))}
        </div>
      )}
    </div>
  );
}
