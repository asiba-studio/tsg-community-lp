// components/ProgramCard.tsx
import InteractiveMosaic02 from "@/components/InteractiveMosaic02";
import Image from "next/image";

interface ProgramCardProps {
    imageUrl: string;
    title: string;
    children: React.ReactNode; // 内容は自由に
    dateTime: string;
    location: string;
}

export default function ProgramCard({
    imageUrl,
    title,
    children,
    dateTime,
    location,
}: ProgramCardProps) {
    return (
        <div className="flex flex-wrap gap-2 gap-y-4 md:gap-4">
            <div className="w-full md:w-44">
                <div className="hidden lg:block w-full">
                    <InteractiveMosaic02
                        imageUrl={imageUrl}
                        width="100%"
                    />
                </div>
                <div className="block lg:hidden">
                    <Image
                        src={imageUrl}
                        alt="program image"
                        width={1000} height={1000}
                        className="w-full object-cover"
                        quality={80}
                        sizes="100vw"
                    />
                </div>
            </div>
            <div className="text-fluid-lg">|||</div>
            <div className="flex-1">
                <div className="font-bold text-fluid-lg">{title}</div>
                <div className="pt-3 md:pt-6">
                    {children}
                </div>
                <div className="w-full text-fluid-sm font-bold text-right mt-6">
                    {dateTime} @{location}
                </div>
            </div>
        </div>
    );
}