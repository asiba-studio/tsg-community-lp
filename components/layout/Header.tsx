
'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
    return (
        <div className="sticky top-0 z-50 w-full">
            <header className="w-full">
                <nav className="flex justify-between items-start lg:items-center py-1.5 md:py-2">
                    <div>
                        <Link href="/" className="flex items-center px-1.5 lg:px-3 no-underline">
                            <Image
                                src="/images/logo-community/logo-black.svg"
                                alt="Community Design-LAB."
                                width={514}
                                height={160}
                                className="h-8 lg:h-10 w-auto object-contain"
                            />
                        </Link>
                    </div>
                    <div className="flex flex-col items-end gap-1 md:gap-2 lg:flex-row lg:items-center lg:gap-6 font-en font-medium text-base lg:text-lg px-2 lg:px-6">
                        <HeaderButton label="Program" href="/#program" />
                        <HeaderButton label="Articles" href="/articles" />
                        <HeaderButton label="News" href="/news" />
                    </div>
                </nav>
            </header>
        </div>
    )
}

function HeaderButton(props: {
    label: string;
    href: string;
}) {
    return (
        <Link
            href={props.href}
            className="font-en text-text-primary transition-colors no-underline hover:text-primary"
        >
            {props.label}
        </Link>
    );
}
