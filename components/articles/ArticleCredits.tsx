import Image from 'next/image';
import {
    BookText,
    Facebook,
    Globe,
    Instagram,
    Link as LinkIcon,
    Smartphone,
    Ticket,
    Twitter,
    User,
    Youtube,
    type LucideIcon,
} from 'lucide-react';
import { CreditItem } from 'lib/types';

interface Props {
    credits?: CreditItem[];
}

// MicroCMSのlink_type（X/Instagram/Youtube/Facebook/Links/Website/note/App/Peatix/Link）に対応するアイコン
const SOCIAL_ICONS: Record<string, LucideIcon> = {
    X: Twitter,
    Instagram,
    Youtube,
    Facebook,
    Website: Globe,
    Links: LinkIcon,
    note: BookText,
    App: Smartphone,
    Peatix: Ticket,
    Link: LinkIcon,
};

export default function ArticleCredits({ credits }: Props) {
    if (!credits || credits.length === 0) return null;

    return (
        <section className="mt-20 md:mt-28 pt-10 border-t border-border w-full md:w-3/4">
            <div className="font-en font-bold text-primary text-xs md:text-sm tracking-wide mb-8">
                CREDIT
            </div>

            <div className="grid grid-cols-1 gap-x-10 gap-y-10">
                {credits.map((credit, i) => (
                    <div key={i} className="flex gap-4">
                        <div className="shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden bg-border-light flex items-center justify-center">
                            {credit.profileImage ? (
                                <Image
                                    src={credit.profileImage}
                                    alt={credit.name}
                                    width={128}
                                    height={128}
                                    className="w-full h-full object-cover"
                                    unoptimized // microCMS images
                                />
                            ) : (
                                <User className="w-6 h-6 text-text-primary/30" />
                            )}
                        </div>

                        <div className="min-w-0 pt-1">
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                <div className="font-bold text-sm md:text-base text-text-primary">
                                    {credit.name}
                                </div>
                                {credit.creditType && (
                                    <span className="font-en text-xs font-bold text-primary border border-primary rounded-full px-2 py-0.5 leading-none">
                                        {credit.creditType}
                                    </span>
                                )}
                            </div>

                            {credit.affiliation && (
                                <div className="text-xs md:text-sm text-text-primary/70 mt-1">
                                    {credit.affiliation}
                                </div>
                            )}

                            {credit.bio && (
                                <p className="text-xs md:text-sm text-text-primary leading-relaxed mt-2">
                                    {credit.bio}
                                </p>
                            )}

                            {credit.socialLinks.filter((l) => l.url).length > 0 && (
                                <div className="flex flex-wrap gap-3 mt-3">
                                    {credit.socialLinks
                                        .filter((l) => l.url)
                                        .map((link, j) => {
                                            const Icon = (link.type && SOCIAL_ICONS[link.type]) || LinkIcon;
                                            return (
                                                <a
                                                    key={j}
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    aria-label={link.label || link.type || link.url}
                                                    className="text-text-primary hover:text-primary transition-colors"
                                                >
                                                    <Icon className="w-4 h-4" />
                                                </a>
                                            );
                                        })}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
