"use client";
import type { Card } from '@/domain/cards.type';
import type { FrosthavenClass } from '@/domain/frosthaven-class.type';
import Image from 'next/image';
import { useState } from 'react';

export default function ClassIcon({
  fhClass,
}: {
  fhClass: FrosthavenClass<Card>;
}) {
  const { name, path, iconSize } = fhClass;
  const [hasError, setHasError] = useState(false);
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

  if (hasError) {
    return <div
      className='max-w-icon max-h-icon flex items-center justify-center bg-white text-xs text-black border border-solid border-gray-400'
      style={{ width: iconSize.width, height: iconSize.height }}
    >{name}</div>;
  }

  return <Image
    className='max-w-icon max-h-icon'
    src={`${basePath}${path}`}
    alt={name}
    {...iconSize}
    unoptimized
    onError={() => setHasError(true)}
  />;
}