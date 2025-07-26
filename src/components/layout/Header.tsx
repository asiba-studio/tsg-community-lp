
import Link from 'next/link';

export default function Header() {

    return (
        <div className="
            sticky top-0 z-50 w-full h-12
            flex items-center
            backdrop-blur-md backdrop-saturate-300 bg-white/25
        ">
            <header className="w-full">
                {/* PC */}
                <nav className="hidden lg:flex justify-between items-center">
                    <div>
                        <Link href="/" className="flex items-center gap-2 px-6">
                            <img src="/images/menu-b.png" alt="Logo" className="w-8 h-8" />
                        </Link>
                    </div>
                    <div className="flex justify-end items-center gap-8 font-en font-medium text-lg px-6">
                        <HeaderButton label="About" href="/news/press-release" />
                        <HeaderButton label="Articles" href="/articles" />
                        <HeaderButton label="News" href="/articles#news" />
                        <HeaderButton label="Application" href="/news/press-release#application" />
                    </div>
                </nav>

                {/* Mobile */}
                <nav className="flex lg:hidden justify-end items-center gap-4 font-en font-medium text-base px-4">
                    <div>About</div>
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
            className="group font-en text-black hover:text-black transition-colors relative no-underline"
        >
            {props.label}
            <img src="/gifs/green-mosaic.gif" className="absolute top-0 left-0 inset-y-0 my-auto scale-x-[1.4] scale-y-[0.9] h-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
    );
}

