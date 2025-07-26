import Image from "next/image";
import Link from "next/link";


export default function Footer() {

    return (
        <footer className="w-full h-auto pt-30 pb-30 px-4 bg-[#1B1B24] flex flex-col items-center justify-center gap-20">
            <div className="flex gap-14 h-20">
                <div className="flex-1 bg-white">
                    <Image
                        src="/images/logo/logo-tsg-community.png"
                        alt="TSG Community Logo"
                        width={200}
                        height={50}
                        className="h-full object-contain"
                    />
                </div>
                <div className="flex-1 bg-white">
                    <Image
                        src="/images/logo/logo-creative-lab.png"
                        alt="Creative Lab Lozg"
                        width={200}
                        height={50}
                        className="h-full object-contain"
                    />
                </div>
                <div className="flex-1 bg-white">
                    <Image
                        src="/images/logo/logo-asiba.png"
                        alt="ASIBA Logo"
                        width={200}
                        height={50}
                        className="h-full object-contain"
                    />
                </div>
                
            </div>
            <div className="flex flex-wrap text-fluid-base font-en text-white gap-x-10 gap-y-2">
                <Link href="/news/news-01" className=" no-underline">About</Link>
                <Link href="/articles" className="no-underline">Article</Link>
                <Link href="/articles#news" className="no-underline">News</Link>
                <Link href="/news/news-01#application" className="no-underline">Application</Link>
            </div>
            <div className="text-fluid-sm font-en text-white">
                © {new Date().getFullYear()} aaaaaa. All rights reserved.
            </div>
        </footer>
    );
}