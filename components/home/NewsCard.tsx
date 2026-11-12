import Link from "next/link";
import Image from "next/image";
import HalftoneHoverImage from "components/HalftoneHoverImage";
import ExternalMark from "components/ExternalMark";
import { News } from "lib/types";
import { listedLinkProps } from "lib/external-link";

export default function NewsCard({ news, showImageOnMobile = true }: { news: News; showImageOnMobile?: boolean }) {
    // home_siteが自サイトでない場合はhome_siteのLP上のニュースへ（最優先・新しいタブ）
    const isHomeExternal = Boolean(news.externalUrl);
    const isInternal = !news.link;
    const href = isHomeExternal ? news.externalUrl! : isInternal ? `/news/${news.slug}` : news.link!;
    const target = isInternal ? '_self' : '_blank';

    const hasCover = Boolean(news.coverImage);
    const normalSrc = hasCover ? news.coverImage : '/images/home-community/placeholder.png';
    const halftoneSrc = hasCover ? news.coverImageHalftone : '/images/home-community/placeholder-halftone.png';

    return (
        <Link href={href} target={target} {...(isHomeExternal ? listedLinkProps(news.title, true, "別サイトへ移動") : {})} className="block no-underline hover:opacity-100">
            <div className={`w-full aspect-square relative overflow-hidden ${showImageOnMobile ? '' : 'hidden md:block'}`}>
                {halftoneSrc ? (
                    <HalftoneHoverImage
                        normalSrc={normalSrc}
                        halftoneSrc={halftoneSrc}
                        alt={news.title}
                    />
                ) : (
                    <Image
                        src={normalSrc}
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
                <div className="text-base leading-normal">{news.title}{isHomeExternal && <ExternalMark />}</div>
            </div>
        </Link>
    );
}
