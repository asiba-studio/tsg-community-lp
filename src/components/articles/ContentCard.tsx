import Link from 'next/link';
import Image from 'next/image';
import { formatDateDot } from '@/lib/date';
import { ContentItem } from '@/lib/types';
import InteractiveMosaic02, { MosaicSize } from '../InteractiveMosaic02';

interface Props {
    content: ContentItem;
    featured?: boolean;
    basePath: '/articles' | '/news' | '/open-talks';
    description?: boolean;
    enableMosaic?: boolean;
    mosaicSize?: MosaicSize;
}

// Contentfulの画像URLにリサイズパラメータを付与するヘルパー関数
const getResizedImageUrl = (url: string, width: number, height?: number) => {
    // URLがない場合は空文字を返す
    if (!url) return '';

    // 【修正】URLの前後の空白を除去（稀に混入することがあるため）
    let finalUrl = url.trim();

    // プロトコル補完: // で始まる場合は https: を付与
    if (finalUrl.startsWith('//')) {
        finalUrl = `https:${finalUrl}`;
    }

    if (!finalUrl.includes('ctfassets.net')) return finalUrl;

    // 既にパラメータがあるかチェック
    const separator = finalUrl.includes('?') ? '&' : '?';

    let params = `w=${width}&q=80`; // 幅指定、画質80%
    if (height) {
        params += `&h=${height}&fit=fill`; // 高さ指定がある場合は切り抜き
    }

    return `${finalUrl}${separator}${params}`;
};

export default function ContentCard({
    content,
    featured = false,
    basePath,
    description = false,
    enableMosaic = true,
    mosaicSize = 'medium'
}: Props) {

    let href = `${basePath}/${content.slug}`;
    if (content.link) {
        href = content.link;
    }

    // 画像URLの生成
    const rawImageUrl = content.coverImage || '';
    const imageUrl = getResizedImageUrl(rawImageUrl, 800, 800);
    const hasImage = Boolean(rawImageUrl);

    return (
        <Link
            href={href}
            className="group block no-underline overflow-hidden hover:opacity-100"
            target={content.link ? '_blank' : '_self'}
        >
            <article>
                {/* Cover Image */}
                {/* aspect-squareでラッパーも1:1を強制。画像がない場合はグレー背景を表示 */}
                <div className="relative w-full aspect-square bg-gray-100">
                    {hasImage ? (
                        enableMosaic ? (
                            <InteractiveMosaic02
                                imageUrl={imageUrl}
                                width="100%"
                                mosaicSize={mosaicSize}
                                aspectRatio={1}
                            />
                        ) : (
                            <Image
                                src={imageUrl}
                                alt={content.title}
                                fill
                                className="object-cover"
                                priority={featured}
                                quality={80}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                unoptimized={true} // Next.jsの最適化をスキップし、ContentfulのURLを直接使用
                            />
                        )
                    ) : (
                        // 画像がない場合のフォールバック
                        <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                            <span className="text-sm font-bold">No Image</span>
                        </div>
                    )}

                    {/* Tags */}
                    {content.tags && content.tags.length > 0 && (
                        <div className="absolute bottom-1.5 left-2 flex flex-col gap-1 z-10 pointer-events-none">
                            {content.tags.slice(0, 3).map((tag) => (
                                <span
                                    key={tag}
                                    className="text-gray-500 leading-none font-en font-medium 
                                        text-fluid-sm transition-colors duration-200 
                                        group-hover:text-gray-100"
                                >
                                    # {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Date */}
                    {basePath !== '/open-talks' && (
                        <div className="
                            absolute bottom-1.5 right-2 
                            text-gray-500 font-en font-medium 
                            leading-none text-fluid-sm 
                            transition-colors duration-200 
                            group-hover:text-gray-100
                            z-10 pointer-events-none
                        ">
                            {formatDateDot(content.date)}
                        </div>
                    )}
                </div>

                {/* Info */}
                <div>
                    {/* Subtitle */}
                    {content.subtitle && (
                        <p className="font-medium text-fluid-base mt-1">
                            {content.subtitle}
                        </p>
                    )}

                    {/* Title */}
                    <h3 className="font-bold mt-2 text-fluid-lg">
                        {content.title}
                    </h3>

                    {/* Description */}
                    {description && content.excerpt && (
                        <p className="text-fluid-sm text-gray-600 mt-6 w-2/3 line-clamp-3">
                            {content.excerpt}
                        </p>
                    )}
                </div>
            </article>
        </Link>
    );
}