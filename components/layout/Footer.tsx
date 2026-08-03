import Image from "next/image";
import Link from "next/link";


export default function Footer() {

    return (
        <footer className="w-full h-auto py-14 md:py-30 px-4 bg-[#1B1B24] flex flex-col items-center justify-center gap-12 md:gap-20">
            <div className="flex flex-col md:flex-row gap-4 md:gap-14 h-auto lg:h-20">
                <div className="flex-1 bg-white">
                    <Image
                        src="/images/logo/logo-tsg-community.png"
                        alt="TSG Community Logo"
                        width={200}
                        height={50}
                        className="h-full object-contain"
                    />
                </div>
                <div className="flex-1 bg-white flex items-center justify-center">
                    <span className="font-en font-bold text-text-primary">COMMUNITY DESIGN-LAB.</span>
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
            <div className="text-fluid-sm font-en text-white">
                © {new Date().getFullYear()} 2025 ASIBA Stuido. All rights reserved.
            </div>
        </footer>
    );
}