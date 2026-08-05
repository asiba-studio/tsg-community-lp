
'use client';

import Link from 'next/link';

export default function Header() {
    return (
        <div className="sticky top-0 z-50 w-full">
            <header className="w-full">
                <nav className="flex justify-between items-start lg:items-center py-3">
                    <div>
                        <Link href="/" className="flex items-center gap-2 px-3 lg:px-6 no-underline">
                            <span className="font-en font-bold text-base lg:text-lg leading-none tracking-tight text-text-primary">COMMUNITY<br />DESIGN-LAB.</span>
                        </Link>
                    </div>
                    <div className="flex flex-col items-end gap-1 md:gap-2 lg:flex-row lg:items-center lg:gap-6 font-en font-medium text-base lg:text-lg px-4 lg:px-6">
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
