// src/components/articles/ArticleList.tsx
'use client';

import { Article } from '@/lib/types';
import ArticleCard from './ArticleCard';
import Masonry from 'react-masonry-css';

interface Props {
    articles: Article[];
    columns?: number;
    gap?: number | string;
}


export default function ArticleList({ articles, columns = 3, gap = 10 }: Props) {

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

            {articles.map((article) => (
                <div key={article.slug} style={{ marginBottom: `${gapValue}`}}>
                    <ArticleCard
                        article={article}
                    />
                </div>
            ))}


        </Masonry>

    );
}