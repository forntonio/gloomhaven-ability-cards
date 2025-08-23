import type { Card } from './cards.type';
import type { FrosthavenClass, FrosthavenClassNames } from './frosthaven-class.type';

import demolitionistData from '../../public/jotl/demolitionist/cards.json' assert { type: 'json' };
import hatchetData from '../../public/jotl/hatchet/cards.json' assert { type: 'json' };
import redGuardData from '../../public/jotl/red-guard/cards.json' assert { type: 'json' };
import voidwardenData from '../../public/jotl/voidwarden/cards.json' assert { type: 'json' };

interface StoredCard extends Omit<Card, 'status' | 'path'> {
  file: string;
}

function toCards(data: StoredCard[], classSlug: string): Card[] {
  return data.map((card) => ({
    ...card,
    status: 'inHand',
    path: `/jotl/${classSlug}/abilities/${card.file}`,
  }));
}

function createClass(name: FrosthavenClassNames, slug: string, data: StoredCard[]): FrosthavenClass<Card> {
  return {
    name,
    handSize: 10,
    path: `/jotl/${slug}/icon.webp`,
    iconSize: { width: 200, height: 200 },
    cards: toCards(data, slug),
  };
}

export const jotlClasses: FrosthavenClass<Card>[] = [
  createClass('Demolitionist', 'demolitionist', demolitionistData as StoredCard[]),
  createClass('Hatchet', 'hatchet', hatchetData as StoredCard[]),
  createClass('Red Guard', 'red-guard', redGuardData as StoredCard[]),
  createClass('Voidwarden', 'voidwarden', voidwardenData as StoredCard[]),
];

