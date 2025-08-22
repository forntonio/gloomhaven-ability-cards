import type { Card } from '@/domain/cards.type';
import { classNameToURI, frosthavenClasses } from '@/domain/frosthaven-class';
import { jotlClasses } from '@/domain/jotl-class';
import type { MetadataRoute } from 'next';

const prodUrl = 'https://frosthaven-cards.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const all = [...frosthavenClasses, ...jotlClasses];
  const fhClassIcons = all.map(({ path }) => `${prodUrl}${path}`);
  const selectClassUrl = {
    url: prodUrl,
    images: fhClassIcons,
  };

  const fhClassCardsUrls = (cards: Card[]) => cards
    .map(({ path }) => `${prodUrl}${path}`);
  const selectCardsUrls = all.map(({ name, cards }) => ({
    url: `${prodUrl}/${classNameToURI(name)}/select`,
    images: fhClassCardsUrls(cards),
  }));
  const playCardsUrls = all.map(({ name, cards }) => ({
    url: `${prodUrl}/${classNameToURI(name)}/play`,
    images: fhClassCardsUrls(cards),
  }));
  return [
    selectClassUrl,
    ...selectCardsUrls,
    ...playCardsUrls,
  ];
}
