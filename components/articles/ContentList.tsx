// src/components/ContentList.tsx
'use client';

import { ContentItem, ProgramTerm } from 'lib/types';
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
  programTerms?: ProgramTerm[];
}

export default function ContentList({
  contents,
  basePath,
  columns = 3,
  gap = 10,
  description = false,
  enableMosaic = true,
  mosaicSize = 'medium',
  programTerms
}: Props) {
  const gapValue = typeof gap === 'number' ? `${gap}px` : gap;

  // フィルタリング対象の期のリストを作成
  let targetTerms: ProgramTerm[] | undefined;
  if (programTerms) {
    targetTerms = Array.isArray(programTerms) ? programTerms : [programTerms];
  }

  // フィルタリングされたコンテンツ
  const filteredContents = contents.filter(content => {
    // 1. フィルタ条件がない、または空の場合は「全て表示」
    if (!targetTerms || targetTerms.length === 0) return true;

    // 2. 記事側の期を取得（データ取得は成功しているので、ここには ['2ND'] などが入っているはず）
    const contentTerms = content.programTerms || [];

    if (contentTerms.length === 0) return false;

    // 3. 【重要】some + includes で交差判定
    // 「記事が持つタグのどれか一つでも、ターゲットに含まれているか？」
    return contentTerms.some(term => targetTerms!.includes(term));
  });

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
      {filteredContents.map((content) => (
        <ContentCard
          key={content.slug}
          content={content}
          basePath={basePath}
          description={description}
          enableMosaic={enableMosaic}
          mosaicSize={mosaicSize}
          enableProgramTerm={content.type === 'article'}
        />
      ))}
    </div>
  );
}