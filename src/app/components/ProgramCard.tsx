// components/ProgramCard.tsx
import InteractiveMosaic from "@/components/InteractiveMosaic";
import InteractiveMosaic02 from "@/components/InteractiveMosaic02";

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
        <div className="flex gap-4">
            <div className="w-[25%]">
                <InteractiveMosaic02
                    imageUrl={imageUrl}
                    width="100%"
                />
            </div>
            <div>|||</div>
            <div className="flex-1">
                <div className="font-bold">{title}</div>
                <div className="pt-6">
                    {children}
                </div>
                <div className="w-full text-sm text-right mt-6">
                    {dateTime} @{location}
                </div>
            </div>
        </div>
    );
}