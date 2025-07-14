// src/components/ContentCard.tsx
import Image from 'next/image';
import Link from 'next/link';
import { formatDateDot } from '@/lib/date';
import { Article, News } from '@/lib/types'; // 両方をimport

// 共通のプロパティを持つ型を定義
type ContentItem = Article | News;

interface Props {
    content: ContentItem;
    featured?: boolean;
    basePath: '/articles' | '/news'; 
}

export default function ContentCard({ content, featured = false, basePath }: Props) {
    return (
        <Link
            href={`${basePath}/${content.slug}`}
            className="group block no-underline overflow-hidden hover:opacity-100"
        >
            <article>
                {/* Cover Image */}
                <div className="relative w-full">
                    <Image
                        src={content.coverImage}
                        alt={content.title}
                        width={1200}
                        height={800}
                        className="w-full h-auto object-cover"
                    />

                    {/* Tags */}
                    <div className="absolute bottom-1.5 left-2 flex flex-col gap-1">
                        {content.tags?.slice(0, 3).map((tag) => (
                            <span
                                key={tag}
                                className="text-gray-500 leading-none font-en font-medium 
                                    text-sm transition-colors duration-200 
                                    group-hover:text-gray-100"
                            >
                                # {tag}
                            </span>
                        ))}
                    </div>

                    {/* Date */}
                    <div className="
                        absolute bottom-1.5 right-2 
                        text-gray-500 font-en font-medium 
                        leading-none text-sm 
                        transition-colors duration-200 
                        group-hover:text-gray-100
                    ">
                        {formatDateDot(content.date)}
                    </div>
                </div>

                {/* Info */}
                <div>
                    {/* Subtitle */}
                    <p className="font-medium mt-0">
                        {content.subtitle}
                    </p>

                    {/* Title */}
                    <h3 className="font-medium mt-2 text-l">
                        {content.title}
                    </h3>
                </div>
            </article>
        </Link>
    );
}