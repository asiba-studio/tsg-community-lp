// src/components/ContentList.tsx
'use client';

import { Article, News } from '@/lib/types';
import ContentCard from './ContentCard';

type ContentItem = Article | News;

interface ResponsiveColumns {
  default?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  '2xl'?: number;
}

interface Props {
   contents: ContentItem[];
   basePath: '/articles' | '/news';
   columns?: number | ResponsiveColumns;
   gap?: number | string;
   description?: boolean;
}

export default function ContentList({ 
   contents, 
   basePath, 
   columns = 3, 
   gap = 10,
   description = false
}: Props) {
   const gapValue = typeof gap === 'number' ? `${gap}px` : gap;

   // CSS Grid用のクラス生成
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
               />
           ))}
       </div>
   );
}