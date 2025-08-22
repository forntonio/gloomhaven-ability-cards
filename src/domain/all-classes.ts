import type { Card } from './cards.type';
import type { FrosthavenClass } from './frosthaven-class.type';
import { frosthavenClasses } from './frosthaven-class';
import { jotlClasses } from './jotl-class';

export const allClasses: FrosthavenClass<Card>[] = [
  ...frosthavenClasses,
  ...jotlClasses,
];

export function getClassByName(name: string): FrosthavenClass<Card> | undefined {
  return allClasses.find((c) => c.name === name);
}
