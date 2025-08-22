'use client';

import { bannerSpear } from '@/domain/banner-spear/class';
import type { Card } from '@/domain/cards.type';
import type { FrosthavenClass } from '@/domain/frosthaven-class.type';
import { useCardsStore } from '@/stores/cards.store';
import { createContext, useEffect } from 'react';

export const ClassContext = createContext<FrosthavenClass<Card>>(bannerSpear);

export default function ClassProvider({
  children,
  fhClass,
}: {
  children: React.ReactNode;
  fhClass: FrosthavenClass<Card>;
}) {
  const reset = useCardsStore((state) => state.reset);

  useEffect(() => {
    reset();
  });

  return <ClassContext value={fhClass}>
    {children}
  </ClassContext>;
}
