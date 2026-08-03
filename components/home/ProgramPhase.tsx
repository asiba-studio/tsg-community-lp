import ProgramCard from "./ProgramCard";

// Phase内の小さなコンセプトアイコン。実アイコン素材（/gifs/icon-community/ 等）が
// 用意でき次第差し替える前提の、正方形グレーのプレースホルダー。
function PhaseIcon({ label }: { label: string }) {
    return (
        <div className="w-full flex flex-col items-center gap-2">
            <div className="w-full aspect-square bg-neutral-200" />
            <div className="font-bold text-sm lg:text-base font-zen text-center">{label}</div>
        </div>
    );
}

// タイトル・詳細情報が未確定のため、カード内容はダミーで統一（4th.md準拠）
const DUMMY_DESCRIPTION = "LABの参加者が一堂に会し、LAB.メンバー同志の関係性構築や、2ヶ月後のゴール設定などを行います。自分のやりたいことを見つめ直す時間や、直近で参加したイベントの共有を設け、これからの2ヶ月に向けてのワークを行います。";
const DUMMY_DATETIME = "2026.09.27";
const DUMMY_VENUE = "亀戸ガレージ";
const HOMEWORK_DATETIME = "随時";
const HOMEWORK_VENUE = "オンライン";

function PhaseCard({ title, homework = false }: { title: string; homework?: boolean }) {
    return (
        <ProgramCard
            imageUrl="/images/test/dummy-square.png"
            halftoneImageUrl="/images/test/dummy-square-halftone.png"
            title={title}
            dateTime={homework ? HOMEWORK_DATETIME : DUMMY_DATETIME}
            location={homework ? HOMEWORK_VENUE : DUMMY_VENUE}
        >
            <div className="text-sm leading-snug">
                {DUMMY_DESCRIPTION}
            </div>
        </ProgramCard>
    );
}

export function ProgramPhase1() {

    return (

        <div className="w-full flex flex-col">
            <div className="flex flex-wrap gap-4 items-baseline">
                <h3 className="font-en font-bold text-4xl leading-none">
                    <span className="text-primary">Phase 1</span>
                </h3>
                <div className="font-zen font-bold text-xl lg:text-2xl">世界観を磨く</div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 w-full md:w-3/4 gap-4 md:gap-6 md:px-0 py-10">
                <PhaseIcon label="やりたいことドリブン" />
                <PhaseIcon label="尖らせる" />
                <PhaseIcon label="問いをみつける" />
            </div>

            <div className="w-full px-0 py-10">
                <h4 className="hidden">Phase 1 Program</h4>
                <ul className="px-[3%] space-y-8">
                    <li><PhaseCard title="LAB合同キックオフ" /></li>
                    <li><PhaseCard title="ゼミ #1" /></li>
                    <li><PhaseCard title="homework" homework /></li>
                </ul>
            </div>
        </div>
    );
}


export function ProgramPhase2() {

    return (

        <div className="w-full flex flex-col">
            <div className="flex flex-wrap gap-4 items-baseline">
                <h3 className="font-en font-bold text-4xl leading-none">
                    <span className="text-primary">Phase 2</span>
                </h3>
                <div className="font-zen font-bold text-xl lg:text-2xl">場を生み出す</div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 w-full md:w-3/4 gap-4 md:gap-6 md:px-0 py-10">
                <PhaseIcon label="ダミー概念4" />
                <PhaseIcon label="ダミー概念5" />
                <PhaseIcon label="ダミー概念6" />
            </div>

            <div className="w-full px-0 py-10">
                <h4 className="hidden">Phase 2 Program</h4>
                <ul className="px-[3%] space-y-8">
                    <li><PhaseCard title="ゼミ #2" /></li>
                    <li><PhaseCard title="homework" homework /></li>
                </ul>
            </div>
        </div>
    );
}

export function ProgramPhase3() {

    return (

        <div className="w-full flex flex-col">
            <div className="flex flex-wrap gap-4 items-baseline">
                <h3 className="font-en font-bold text-4xl leading-none">
                    <span className="text-primary">Phase 3</span>
                </h3>
                <div className="font-zen font-bold text-xl lg:text-2xl">場を育てる</div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 w-full gap-4 md:gap-6 md:px-0 py-10">
                <PhaseIcon label="ダミー概念7" />
                <PhaseIcon label="ダミー概念8" />
                <PhaseIcon label="ダミー概念9" />
                <PhaseIcon label="ダミー概念10" />
            </div>

            <div className="w-full px-0 py-10">
                <h4 className="hidden">Phase 3 Program</h4>
                <ul className="px-[3%] space-y-8">
                    <li><PhaseCard title="1Day キャンプ" /></li>
                    <li><PhaseCard title="ゼミ #3" /></li>
                    <li><PhaseCard title="homework" homework /></li>
                    <li><PhaseCard title="最終成果発表会" /></li>
                </ul>
            </div>
        </div>
    );
}
