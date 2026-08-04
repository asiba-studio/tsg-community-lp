import Link from "next/link";
import Image from "next/image";
import HalftoneHoverImage from "components/HalftoneHoverImage";
import { News } from "lib/types";

export default function NewsCard({ news }: { news: News }) {
    const isInternal = !news.link;
    const href = isInternal ? `/news/${news.slug}` : news.link!;
    const target = isInternal ? '_self' : '_blank';

    return (
        <Link href={href} target={target} className="block no-underline hover:opacity-100">
            <div className="w-full aspect-square relative overflow-hidden">
                {news.coverImageHalftone ? (
                    <HalftoneHoverImage
                        normalSrc={news.coverImage}
                        halftoneSrc={news.coverImageHalftone}
                        alt={news.title}
                    />
                ) : (
                    <Image
                        src={news.coverImage}
                        alt={news.title}
                        fill
                        className="object-cover"
                    />
                )}
            </div>
            <div className="space-y-3 mt-3">
                {(news.lpSubtitle || news.subtitle) && (
                    <div className="font-bold text-sm leading-normal">{news.lpSubtitle || news.subtitle}</div>
                )}
                <div className="text-base leading-normal">{news.title}</div>
            </div>
        </Link>
    );
}
