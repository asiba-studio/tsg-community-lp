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

// homeworkはスケジュール未確定のため共通のプレースホルダーを使用（4th-2.md準拠）
const HOMEWORK_DATETIME = "随時";
const HOMEWORK_VENUE = "オンライン";

function PhaseCard({ title, question, description, dateTime, venue, homework = false, imageUrl = "/images/home-community/placeholder.png", halftoneImageUrl = "/images/home-community/placeholder-halftone.png", showImageOnMobile = false }: { title: string; question: string; description: string; dateTime?: string; venue?: string; homework?: boolean; imageUrl?: string; halftoneImageUrl?: string; showImageOnMobile?: boolean }) {
    return (
        <ProgramCard
            imageUrl={imageUrl}
            halftoneImageUrl={halftoneImageUrl}
            title={title}
            dateTime={homework ? HOMEWORK_DATETIME : dateTime ?? ""}
            location={homework ? HOMEWORK_VENUE : venue ?? ""}
            showImageOnMobile={showImageOnMobile}
        >
            <p className="font-bold text-base mb-3">{question}</p>
            <p>
                {description}
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
                <div className="font-zen font-bold text-lg md:text-xl lg:text-2xl flex items-center gap-3 md:gap-5">
                    <span>場を見立てる</span>
                    <Image src="/gifs/icon/pink-dots.gif" alt="" unoptimized width={40} height={40} className="w-10 h-10 shrink-0" />
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 w-full gap-12 md:gap-x-[clamp(2.5rem,4vw,6rem)] md:gap-y-10 md:px-0 py-10">
                <PhaseIcon icon="01_Heart.gif" label="やりたいことドリブン" />
                <PhaseIcon icon="02_Togari.gif" label="尖らせる" />
                <PhaseIcon icon="03_Toi.gif" label="問いをみつける" />
            </div>

            <div className="w-full px-0 mt-4">
                <h3 className="hidden">Phase 1 Program</h3>
                <ul className="space-y-8">
                    <li><PhaseCard
                        title="LAB.合同キックオフ"
                        question="「私のやりたいは、どんな場になる？」"
                        description="LAB.の参加者が一堂に会し、LAB.メンバー同志の関係性構築や、3ヶ月後のゴール設定などを行います。自分のやりたいことを見つめ直す時間や、直近で参加したイベントの共有を設け、これからの3ヶ月に向けてのワークを行います。"
                        dateTime="2026.09.27"
                        venue="Tokyo Innovation Base"
                        imageUrl="/images/home-community/photo-01.png"
                        halftoneImageUrl="/images/home-community/photo-01-halftone.png"
                        showImageOnMobile
                    /></li>
                    <li><PhaseCard
                        title="ゼミ #1"
                        question="「コミュニティはデザインできるのか？」"
                        description="コミュニティを「デザイン」するために必要な視点や考え方をインプットします。その視点をもとに施設内でフィールドワークを行い、人の動きやコミュニケーション、場で起きている現象を観察します。そこで得た気づきを、自身のコミュニティづくりへとつなげていきます。"
                        dateTime="2026.10.11"
                        venue="東京都内（場所未定）"
                        imageUrl="/images/home-community/photo-02.png"
                        halftoneImageUrl="/images/home-community/photo-02-halftone.png"
                    /></li>
                    <li><PhaseCard
                        title="homework"
                        question="「イベントを企画する」"
                        description="自分の「やりたいこと」と、フィールドワークで得た気づきをもとに、自身のコミュニティにつながるイベントを企画します。"
                        homework
                    /></li>
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
                <div className="font-zen font-bold text-lg md:text-xl lg:text-2xl flex items-center gap-3 md:gap-5">
                    <span>場をひらく</span>
                    <Image src="/gifs/icon/pink-dots.gif" alt="" unoptimized width={40} height={40} className="w-10 h-10 shrink-0" />
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 w-full gap-12 md:gap-x-[clamp(2.5rem,4vw,6rem)] md:gap-y-10 md:px-0 py-10">
                <PhaseIcon icon="04_.gif" label="人を集める" />
                <PhaseIcon icon="05_KIkaku.gif" label="企画をつくる" />
                <PhaseIcon icon="06_Basyo.gif" label="物理的な場" />
            </div>

            <div className="w-full px-0 mt-4">
                <h3 className="hidden">Phase 2 Program</h3>
                <ul className="space-y-8">
                    <li><PhaseCard
                        title="ゼミ #2"
                        question="「良いコミュニティができるイベントってどんなイベント？」"
                        description="コミュニティづくりに欠かせない企画設計やプロジェクトマネジメントについて学び、イベント企画をさらにブラッシュアップします。コミュニティを実践しているゲストによるトークやメンタリングも予定しています。"
                        dateTime="2026.10.25"
                        venue="東京都内（場所未定）"
                        imageUrl="/images/home-community/photo-04.png"
                        halftoneImageUrl="/images/home-community/photo-04-halftone.png"
                        showImageOnMobile
                    /></li>
                    <li><PhaseCard
                        title="homework"
                        question="「イベントを実行する」"
                        description="ゼミでブラッシュアップした企画をもとに、実際にイベントを開催します。最初は小さな規模でも構いません。まずは実践し、やってみることを大切にします。"
                        homework
                    /></li>
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
                <div className="font-zen font-bold text-lg md:text-xl lg:text-2xl flex items-center gap-3 md:gap-5">
                    <span>場をゆずる</span>
                    <Image src="/gifs/icon/pink-dots.gif" alt="" unoptimized width={40} height={40} className="w-10 h-10 shrink-0" />
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 w-full gap-12 md:gap-x-[clamp(2.5rem,4vw,6rem)] md:gap-y-10 md:px-0 py-10">
                <PhaseIcon icon="07_netsu.gif" label="熱を伝える" />
                <PhaseIcon icon="08_Kankeisei.gif" label="関係性を描く" />
                <PhaseIcon icon="09_Mokuteki.gif" label="目的を見出す" />
                <PhaseIcon icon="10_Brand.gif" label="ブランドを磨く" />
            </div>

            <div className="w-full px-0 mt-4">
                <h3 className="hidden">Phase 3 Program</h3>
                <ul className="space-y-8">
                    <li><PhaseCard
                        title="1Day キャンプ"
                        question="「やってみて得たことを、次に生かす」"
                        description="1日かけて中間報告会を実施します。実践を通して得られた学びや課題を振り返り、次の一歩につなげるための方法をメンタリングを通して考えます。実践者によるトークやメンタリングも予定しています。"
                        dateTime="2026.11.08"
                        venue="東京都内（場所未定）"
                        imageUrl="/images/home-community/photo-06.png"
                        halftoneImageUrl="/images/home-community/photo-06-halftone.png"
                        showImageOnMobile
                    /></li>
                    <li><PhaseCard
                        title="ゼミ #3"
                        question="「この場を、誰と、どうやって続けるのか？」"
                        description="コミュニティは成長とともに、その形やあり方も変化していきます。これから先も続いていくコミュニティにするために、運営や関わり方について深めます。実践者によるトークやメンタリングも予定しています。"
                        dateTime="2026.11.22"
                        venue="東京都内（場所未定）"
                        imageUrl="/images/home-community/photo-07.png"
                        halftoneImageUrl="/images/home-community/photo-07-halftone.png"
                    /></li>
                    <li><PhaseCard
                        title="homework"
                        question="「もう一度、イベントを実行する」"
                        description="これまでの実践や振り返り、メンタリングで得た学びをもとに、イベントをもう一度実践します。改善を重ねながら、自身のコミュニティを育てていきます。"
                        homework
                    /></li>
                    <li><PhaseCard
                        title="LAB.最終成果報告会"
                        question="「3ヶ月を振り返って」"
                        description="LAB.参加者が一堂に集まり、3ヶ月間の実践を振り返ります。これからもコミュニティを継続していくために必要なアーカイブの作成や、ネットワーキングも行う予定です。"
                        dateTime="2026.12.13"
                        venue="Tokyo Innovation Base"
                        imageUrl="/images/home-community/photo-09.png"
                        halftoneImageUrl="/images/home-community/photo-09-halftone.png"
                    /></li>
                </ul>
            </div>
            <div className="w-full font-zen text-xs mt-12">
                ※参加者の状況に合わせて、プログラムの内容は一部変更となる場合があります。あらかじめご了承ください。 
            </div>
        </div>
    );
}
