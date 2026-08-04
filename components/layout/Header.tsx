
'use client';

import Link from 'next/link';

export default function Header() {
    return (
        <div className="hidden lg:block sticky top-0 z-50 w-full">
            <header className="w-full">
                {/* PC */}
                <nav className="hidden lg:flex justify-between items-center py-3">
                    <div>
                        <Link href="/" className="flex items-center gap-2 px-6 no-underline">
                            <span className="font-en font-bold text-lg leading-none tracking-tight text-text-primary">COMMUNITY<br />DESIGN-LAB.</span>
                        </Link>
                    </div>
                    <div className="flex justify-end items-center gap-6 font-en font-medium text-lg px-6">
                        <HeaderButton label="Program" href="/#program" />
                        <HeaderButton label="Articles" href="/articles" />
                        <HeaderButton label="News" href="/news" />
                    </div>
                </nav>

                {/* Mobile */}
                {/*}
                <nav className="flex lg:hidden justify-between items-center gap-4 font-en font-medium text-base px-4">
                    <Link href="/" className="flex items-center gap-2 px-6">
                        <span className="font-en font-bold text-sm leading-none">COMMUNITY DESIGN-LAB.</span>
                    </Link>
                    <div>About</div>
                </nav>*/}


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
