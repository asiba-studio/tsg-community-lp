import Link from 'next/link';
import Image from 'next/image';
import { formatDateDot } from 'lib/date';
import { ContentItem } from 'lib/types';
import InteractiveMosaic02, { MosaicSize } from '../InteractiveMosaic02';

interface Props {
    content: ContentItem;
    featured?: boolean;
    basePath: '/articles' | '/news' | '/open-talks';
    description?: boolean;
    enableMosaic?: boolean;
    mosaicSize?: MosaicSize;
    enableProgramTerm?: boolean;
}

// Contentfulの画像URLにリサイズパラメータを付与するヘルパー関数
const getResizedImageUrl = (url: string, width: number, height?: number) => {
    if (!url) return '';
    let finalUrl = url.trim();

    if (finalUrl.startsWith('//')) {
        finalUrl = `https:${finalUrl}`;
    }

    if (!finalUrl.includes('ctfassets.net')) return finalUrl;

    const separator = finalUrl.includes('?') ? '&' : '?';

    // fm=autoは削除 (Contentfulのエラー回避)
    let params = `w=${width}&q=80`;
    if (height) {
        params += `&h=${height}&fit=fill`;
    }

    return `${finalUrl}${separator}${params}`;
};

export default function ContentCard({
    content,
    featured = false,
    basePath,
    description = false,
    enableMosaic = true,
    mosaicSize = 'medium',
    enableProgramTerm = false,
}: Props) {

    // リンク生成ロジック
    // Article: noteUrl(link)があっても強制的に内部詳細ページへ遷移
    // News / OpenTalks: link(外部URL)があれば外部へ、なければ内部詳細ページへ遷移
    let isInternal = true;

    if (content.type === 'article') {
        isInternal = true;
    } else {
        // News, OpenTalksなどは link があれば外部とみなす
        isInternal = !content.link;
    }

    if(enableProgramTerm && content.programTerms && content.programTerms.length > 0) {  
        isInternal = true;
    }

    const href = isInternal ? `${basePath}/${content.slug}` : content.link!;
    const target = isInternal ? '_self' : '_blank';

    // 画像URLの生成
    const rawImageUrl = content.coverImage || '';
    const imageUrl = getResizedImageUrl(rawImageUrl, 800, 800);
    const hasImage = Boolean(rawImageUrl);

    return (
        <Link
            href={href}
            className="group block no-underline overflow-hidden hover:opacity-100"
            target={target}
        >
            <article>
                {/* Cover Image */}
                <div className="relative w-full h-auto bg-gray-100">
                    {hasImage ? (
                        enableMosaic ? (
                            <InteractiveMosaic02
                                imageUrl={imageUrl}
                                width="100%"
                                mosaicSize={mosaicSize}
                                aspectRatio={1}
                            />
                        ) : (
                            <div
                                className={`relative ${basePath === '/open-talks' ? 'aspect-[1200/580]' : 'aspect-[500/500]'
                                    } inset-0 flex items-center justify-center text-gray-300`}
                            >

                                <Image
                                    src={imageUrl}
                                    alt={content.title}
                                    fill
                                    className="object-cover"
                                    priority={featured}
                                    quality={80}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    unoptimized={true}
                                />
                            </div>
                        )
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                            <span className="text-sm font-bold">No Image</span>
                        </div>
                    )}

                    {/* Program Terms */}
                    {enableProgramTerm && content.programTerms && content.programTerms.length > 0 && (
                        <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10 pointer-events-none">
                            {content.programTerms.slice(0, 3).map((term) => (
                                <span
                                    key={term}
                                    className="text-black leading-snug font-en font-medium 
                                        text-fluid-sm transition-colors duration-200 
                                        bg-white/90 px-2"
                                >
                                    {term} Program
                                </span>
                            ))}
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
                                        group-hover:text-gray-100 bg-white/10 backdrop-blur-[2px] px-1 rounded-sm"
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