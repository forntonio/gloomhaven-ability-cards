import type { Enhancement, EnhancementSlot } from '@/domain/enhancement/enhancement.type';
import Image from 'next/image';

export default function EnhanceSticker({
  enhancement,
  position: { x, y, size = 10 },
}: {
  enhancement: Enhancement;
  position: EnhancementSlot['position'];
}) {
  const tokenPath = `/enhancement-stickers/fh-${enhancement}-sticker.webp`;

  return <Image
    src={tokenPath}
    alt='token'
    width={size}
    height={size}
    className='absolute'
    style={{ left: x - size / 2, top: y - size / 2 }}
  />;
}