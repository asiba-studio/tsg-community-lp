// src/components/ContentList.tsx
'use client';

import { Article, News } from '@/lib/types';
import ContentCard from './ContentCard';
import Masonry from 'react-masonry-css';

type ContentItem = Article | News;

interface Props {
   contents: ContentItem[];
   basePath: '/articles' | '/news';
   columns?: number;
   gap?: number | string;
   description?: boolean; // 追加
}

export default function ContentList({ 
   contents, 
   basePath, 
   columns = 3, 
   gap = 10,
   description = false // デフォルトは非表示
}: Props) {
   const gapValue = typeof gap === 'number' ? `${gap}px` : gap;

   return (
       <Masonry
           breakpointCols={columns}
           className="masonry-grid"
           columnClassName="masonry-grid-column"
           style={{
               gap: `${gapValue}`,
           }}
       >
           {contents.map((content) => (
               <div key={content.slug} style={{ marginBottom: `${gapValue}`}}>
                   <ContentCard
                       content={content}
                       basePath={basePath}
                       description={description} // プロパティを渡す
                   />
               </div>
           ))}
       </Masonry>
   );
}