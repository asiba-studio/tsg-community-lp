
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
    const pathname = usePathname();

    return (
        <div className="
            hidden lg:block sticky top-0 z-50 w-full h-12
            flex items-center
            backdrop-blur-md backdrop-saturate-300 bg-white/25
        ">
            <header className="w-full">
                {/* PC */}
                <nav className="hidden lg:flex justify-between items-center">
                    <div>
                        <Link href="/" className="group flex items-center gap-2 px-6 relative">
                            <img src="/images/logo/logo-creative-lab.png" alt="Logo" className="h-12" />
                            <img src="/gifs/green-mosaic.gif" alt="Green Mosaic" className="absolute top-0 left-0 inset-y-0 my-auto scale-x-[1.2] scale-y-[0.9] h-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                    </div>
                    <div className="flex justify-end items-center gap-6 font-en font-medium text-lg px-6">
                        <HeaderButton label="About" href="/about" pathname={pathname} />
                        <HeaderButton label="Articles" href="/articles" pathname={pathname} />
                        <HeaderButton label="News" href="/articles#news" pathname={pathname} />
                        <HeaderButton label="Open TALKs" href="/open-talks" pathname={pathname} />
                        <HeaderButton label="Application" href="/#application" pathname={pathname} />
                        <HeaderButton label="Projects Fair" href="/projects-fair" pathname={pathname} />
                        <HeaderButton label="Archive" href="/archive/2nd" pathname={pathname} />
                    </div>
                </nav>

                {/* Mobile */}
                {/*}
                <nav className="flex lg:hidden justify-between items-center gap-4 font-en font-medium text-base px-4">
                    <Link href="/" className="flex items-center gap-2 px-6">
                        <img src="/images/logo/logo-creative-lab.png" alt="Logo" className="h-6" />
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
    pathname: string;
}) {
    // アクティブ判定: hrefのパス部分（ハッシュを除く）で現在のパスと照合
    const hrefPath = props.href.split('#')[0];
    const isActive = props.pathname.startsWith(hrefPath) && hrefPath !== '/';

    return (
        <Link
            href={props.href}
            className="group font-en text-black hover:text-black transition-colors relative no-underline"
        >
            {props.label}
            <img
                src="/gifs/green-mosaic.gif"
                className={`absolute top-0 left-0 inset-y-0 my-auto scale-x-[1.4] scale-y-[0.9] h-full -z-10 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
            />
        </Link>
    );
}

