// src/components/ContentList.tsx
'use client';

import { ContentItem } from 'lib/types';
import ContentCard from './ContentCard';
import { MosaicSize } from '../InteractiveMosaic02';

interface ResponsiveColumns {
  default?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  '2xl'?: number;
}

interface Props {
  contents: ContentItem[]; // 統一型を利用
  basePath: '/articles' | '/news' | '/open-talks';
  columns?: number | ResponsiveColumns;
  gap?: number | string;
  description?: boolean;
  enableMosaic?: boolean;
  mosaicSize?: MosaicSize;
}

export default function ContentList({
  contents,
  basePath,
  columns = 3,
  gap = 10,
  description = false,
  enableMosaic = true,
  mosaicSize = 'medium'
}: Props) {
  const gapValue = typeof gap === 'number' ? `${gap}px` : gap;

  const getGridClasses = () => {
    if (typeof columns === 'number') {
      return `grid-cols-${columns}`;
    }

    let classes = '';
    if (columns.default) classes += `grid-cols-${columns.default} `;
    if (columns.sm) classes += `sm:grid-cols-${columns.sm} `;
    if (columns.md) classes += `md:grid-cols-${columns.md} `;
    if (columns.lg) classes += `lg:grid-cols-${columns.lg} `;
    if (columns.xl) classes += `xl:grid-cols-${columns.xl} `;
    if (columns['2xl']) classes += `2xl:grid-cols-${columns['2xl']} `;

    return classes.trim();
  };

  return (
    <div
      className={`grid ${getGridClasses()}`}
      style={{ gap: gapValue }}
    >
      {contents.map((content) => (
        <ContentCard
          key={content.slug}
          content={content}
          basePath={basePath}
          description={description}
          enableMosaic={enableMosaic}
          mosaicSize={mosaicSize}
        />
      ))}
    </div>
  );
}