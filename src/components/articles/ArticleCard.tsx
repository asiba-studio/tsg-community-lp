// src/components/ArticleCard.tsx
import Image from 'next/image';
import Link from 'next/link';
import { formatDateDot } from '@/lib/date';
import { Article } from '@/lib/types';

interface Props {
    article: Article;
    featured?: boolean;
}

export default function ArticleCard({ article, featured = false }: Props) {
    return (
        <Link
            href={`/articles/${article.slug}`}
            className="group block no-underline overflow-hidden hover:opacity-100"
        >
            <article>
                {/* Cover Image */}
                <div className="relative w-full">
                    <Image
                        src={article.coverImage}
                        alt={article.title}
                        width={1200}
                        height={800}
                        className="w-full h-auto object-cover"
                    />

                    {/* Tags */}
                    <div className="absolute bottom-1 left-2 flex flex-col gap-1">
                        {article.tags.slice(0, 3).map((tag) => (
                            <span
                                key={tag}
                                className="text-white leading-none font-en font-normal text-sm"
                            >
                                # {tag}
                            </span>
                        ))}
                    </div>

                    {/* Date */}
                    <div className="absolute bottom-1 right-2 text-white font-en font-normal leading-none text-sm">
                        {formatDateDot(article.date)}
                    </div>


                </div>


                {/* Info */}
                <div>
                    {/* Subtitle */}
                    <p className="font-medium mt-1">
                        {article.subtitle}
                    </p>

                    {/* Title */}
                    <h3 className="font-medium mt-3 text-l">
                        {article.title}
                    </h3>

                </div>

            </article>

        </Link>
    );
}