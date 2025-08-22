import type { Card } from './cards.type';
import type { FrosthavenClass } from './frosthaven-class.type';

interface StoredCard extends Omit<Card, 'status' | 'path'> {
  file: string;
}

function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function loadCards(fs: typeof import('fs'), path: typeof import('path'), dir: string, classSlug: string): Card[] {
  const dataPath = path.join(dir, 'cards.json');
  if (!fs.existsSync(dataPath)) {
    return [];
  }
  const raw = JSON.parse(fs.readFileSync(dataPath, 'utf-8')) as StoredCard[];
  return raw.map((card) => ({
    ...card,
    status: 'inHand',
    path: `/jotl/${classSlug}/abilities/${card.file}`,
  }));
}

export const jotlClasses: FrosthavenClass<Card>[] = (() => {
  if (typeof window !== 'undefined') {
    return [];
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require('fs') as typeof import('fs');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const path = require('path') as typeof import('path');
    const base = path.join(process.cwd(), 'public', 'jotl');
    if (!fs.existsSync(base)) {
      return [];
    }
    return fs.readdirSync(base)
      .filter((name: string) => fs.lstatSync(path.join(base, name)).isDirectory())
      .map((classSlug: string) => {
        const classDir = path.join(base, classSlug);
        const name = classSlug.split('-').map(capitalize).join(' ');
        return {
          name,
          handSize: 10,
          path: `/jotl/${classSlug}/icon.webp`,
          iconSize: { width: 200, height: 200 },
          cards: loadCards(fs, path, classDir, classSlug),
        } as FrosthavenClass<Card>;
      });
  } catch {
    return [];
  }
})();
