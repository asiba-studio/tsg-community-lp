import Image from "next/image";
import Link from "next/link";


export default function Footer() {

    return (
        <footer className="w-full h-auto py-18 md:py-20 px-6 md:px-16 bg-black flex flex-col items-center justify-center gap-12 md:gap-30">
            <div className="w-full flex flex-col items-center justify-center gap-8 md:grid md:grid-cols-[1fr_auto_1fr] md:gap-x-16 lg:gap-x-40">
                <div className="flex md:justify-end">
                    <Image
                        src="/images/logo-community/tsg.png"
                        alt="Tokyo Startup Gateway"
                        width={420}
                        height={160}
                        className="h-10 md:h-16 w-auto object-contain"
                    />
                </div>
                <div className="flex justify-center">
                    <Image
                        src="/images/logo-community/logo.svg"
                        alt="Community Design-LAB."
                        width={514}
                        height={160}
                        className="h-10 md:h-16 w-auto object-contain"
                    />
                </div>
                <div className="flex md:justify-start">
                    <Image
                        src="/images/logo-community/asiba.svg"
                        alt="ASIBA"
                        width={558}
                        height={160}
                        className="h-10 md:h-16 w-auto object-contain"
                    />
                </div>
            </div>
            <div className="text-xs md:text-sm font-en text-white">
                © {new Date().getFullYear()} ASIBA. All Rights Reserved.
            </div>
        </footer>
    );
}