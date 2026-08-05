import Image from "next/image";
import ProgramCard from "./ProgramCard";

// Phase内の小さなコンセプトアイコン（/gifs/icon-community/ のアニメーションGIF）。
function PhaseIcon({ icon, label }: { icon: string; label: string }) {
    return (
        <div className="w-full flex flex-col items-center gap-2">
            <div className="relative w-full aspect-square">
                <Image
                    src={`/gifs/icon-community/${icon}`}
                    alt=""
                    unoptimized
                    fill
                    className="object-contain"
                />
            </div>
            <div className="font-medium text-sm lg:text-base font-zen text-center">{label}</div>
        </div>
    );
}

// タイトル・詳細情報が未確定のため、カード内容はダミーで統一（4th.md準拠）
const DUMMY_DESCRIPTION = "LABの参加者が一堂に会し、LAB.メンバー同志の関係性構築や、2ヶ月後のゴール設定などを行います。自分のやりたいことを見つめ直す時間や、直近で参加したイベントの共有を設け、これからの2ヶ月に向けてのワークを行います。";
const DUMMY_DATETIME = "2026.09.27";
const DUMMY_VENUE = "亀戸ガレージ";
const HOMEWORK_DATETIME = "随時";
const HOMEWORK_VENUE = "オンライン";

function PhaseCard({ title, homework = false, imageUrl = "/images/test/dummy-square.png", halftoneImageUrl = "/images/test/dummy-square-halftone.png", showImageOnMobile = false }: { title: string; homework?: boolean; imageUrl?: string; halftoneImageUrl?: string; showImageOnMobile?: boolean }) {
    return (
        <ProgramCard
            imageUrl={imageUrl}
            halftoneImageUrl={halftoneImageUrl}
            title={title}
            dateTime={homework ? HOMEWORK_DATETIME : DUMMY_DATETIME}
            location={homework ? HOMEWORK_VENUE : DUMMY_VENUE}
            showImageOnMobile={showImageOnMobile}
        >
            <p>
                {DUMMY_DESCRIPTION}
            </p>
        </ProgramCard>
    );
}

export function ProgramPhase1() {

    return (

        <div className="w-full flex flex-col">
            <div className="flex flex-wrap gap-4 md:gap-8 items-baseline">
                <h2 className="font-en text-primary">
                    Phase 1
                </h2>
                <div className="font-zen font-bold text-lg md:text-xl lg:text-2xl">世界観を磨く</div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 w-full md:pr-20 gap-12 md:gap-26 md:px-0 py-10">
                <PhaseIcon icon="01_Heart.gif" label="やりたいことドリブン" />
                <PhaseIcon icon="02_Togari.gif" label="尖らせる" />
                <PhaseIcon icon="03_Toi.gif" label="問いをみつける" />
            </div>

            <div className="w-full px-0 mt-4">
                <h3 className="hidden">Phase 1 Program</h3>
                <ul className="space-y-8">
                    <li><PhaseCard title="LAB合同キックオフ" imageUrl="/images/home-community/phase-01.png" halftoneImageUrl="/images/home-community/phase-01-halftone.png" showImageOnMobile /></li>
                    <li><PhaseCard title="ゼミ #1" imageUrl="/images/home-community/phase-02.png" halftoneImageUrl="/images/home-community/phase-02-halftone.png" /></li>
                    <li><PhaseCard title="homework" homework imageUrl="/images/home-community/phase-03.png" halftoneImageUrl="/images/home-community/phase-03-halftone.png" /></li>
                </ul>
            </div>
        </div>
    );
}


export function ProgramPhase2() {

    return (

        <div className="w-full flex flex-col">
            <div className="flex flex-wrap gap-4 md:gap-8 items-baseline">
                <h2 className="font-en text-primary">
                    Phase 2
                </h2>
                <div className="font-zen font-bold text-lg md:text-xl lg:text-2xl">場を生み出す</div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 w-full md:pr-20 gap-12 md:gap-26 md:px-0 py-10">
                <PhaseIcon icon="04_.gif" label="人を集める" />
                <PhaseIcon icon="05_KIkaku.gif" label="企画をつくる" />
                <PhaseIcon icon="06_Basyo.gif" label="物理的な場" />
            </div>

            <div className="w-full px-0 mt-4">
                <h3 className="hidden">Phase 2 Program</h3>
                <ul className="space-y-8">
                    <li><PhaseCard title="ゼミ #2" showImageOnMobile /></li>
                    <li><PhaseCard title="homework" homework /></li>
                </ul>
            </div>
        </div>
    );
}

export function ProgramPhase3() {

    return (

        <div className="w-full flex flex-col">
            <div className="flex flex-wrap gap-4 md:gap-8 items-baseline">
                <h2 className="font-en text-primary">
                    Phase 3
                </h2>
                <div className="font-zen font-bold text-lg md:text-xl lg:text-2xl">場を育てる</div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 w-full md:pr-20 gap-12 md:gap-x-26 md:gap-y-10 md:px-0 py-10">
                <PhaseIcon icon="07_netsu.gif" label="熱を伝える" />
                <PhaseIcon icon="08_Kankeisei.gif" label="関係性を描く" />
                <PhaseIcon icon="09_Mokuteki.gif" label="目的を見出す" />
                <PhaseIcon icon="10_Brand.gif" label="ブランドを磨く" />
            </div>

            <div className="w-full px-0 mt-4">
                <h3 className="hidden">Phase 3 Program</h3>
                <ul className="space-y-8">
                    <li><PhaseCard title="1Day キャンプ" showImageOnMobile /></li>
                    <li><PhaseCard title="ゼミ #3" /></li>
                    <li><PhaseCard title="homework" homework /></li>
                    <li><PhaseCard title="最終成果発表会" /></li>
                </ul>
            </div>
        </div>
    );
}
