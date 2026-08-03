import { SimpleButton } from "components/button"
import InteractiveMosaic02 from "components/InteractiveMosaic02"
import Image from "next/image"

export default function ProgramDetailSection() {
    return (
        <div>
            <h2 className="font-en font-bold text-5xl leading-none relative px-[1.5vw] inline-block">
                <Image
                    src="/gifs/green-mosaic.gif"
                    unoptimized
                    alt="green mosaic"
                    width={500}
                    height={140}
                    className="absolute inset-0 w-full h-full scale-x-[1.1] object-cover -z-10"
                />
                Program
            </h2>

            <div className="w-full gap-6 px-[2vw] mt-8">
                <ul className="custom-ul space-y-6 pl-[1.5vw]">
                    <li className="space-y-1">
                        <p className="font-bold">クリエイティブ領域での活躍を志す若者向けの新たなコミュニティ</p>
                        <p className="text-sm">Creative-LAB.は、建築・デザイン・アートなどのクリエイティブ領域に関心を持つ若者／学生（15〜25歳前後を対象）に向けた、
                            実験的な学びの機会と対話の場を提供しています。
                            「自分の中にある”つくるため”の問いに向き合いながら、
                            自らの”生き方”を重ねていく」ことを目標にし、若手クリエイターによるメンタリング機会や、
                            思考の幅を広げ、問いを磨くためのワークショップ、
                            自ら問いを持ち実践をする若手クリエイターによる連続レクチャーを2ヶ月間限定で提供するコミュニティです。
                        </p>
                    </li>
                    <li className="space-y-1">
                        <p className="font-bold">若手クリエイターによる連続レクチャーの開催</p>
                        <p className="text-sm">Creative-LAB.のパートナーであるASIBAは、
                            日本デザイン振興会のご後援をいただき、
                            GOOD DESIGN NEW HOPE AWARD の受賞者やその他アワード受賞者による連続レクチャーを開催しています。
                            若手クリエイターの持つ”つくること”への問いやその背景、
                            実践の手法などを深掘りすることで、
                            クリエイションを志す若手クリエイターの新たな視座の獲得や交流機会を生み出すことを目的としています。
                        </p>
                    </li>
                    <li className="space-y-1">
                        <p className="font-bold"> 自らの問いと視座を磨くための「クリエイティブワークショップ」</p>
                        <p className="text-sm">自らのアイデアやクリエイションの視点を磨くため、
                            2度のワークショップを開催します。
                            思考法を身につけるレクチャー、スキルセットをつくるワークショップ、
                            新たなツールを用いたクリエイションの拡張など、実践型のワークショップです。
                        </p>
                    </li>
                    <li className="space-y-1">
                        <p className="font-bold">自ら問いと実践を往復する若手クリエイターによる「メンタリング機会」の提供</p>
                        <p className="text-sm">「つくることと生きること」を自ら実践する、
                            若手のクリエイター/建築家/アーティスト/デザイナー/研究者をメンターとした、
                            Creative-LAB.参加者限定のメンタリング機会を提供します。
                        </p>
                    </li>
                    <li className="space-y-1">
                        <p className="font-bold">「何をつくるか」だけでなく、「どう生きたいか」を見つめるコミュニティ</p>
                        <p className="text-sm">Creative-Lab.は「何を、どのようにつくるか」だけでなく、
                            「これから、どう生きていきたいか？」という問いを起点に、
                            自分のクリエイションと生き方を結び直す場です。
                            社会の中で自分だけのモノづくりをしながら生きている人々や、
                            同世代の仲間との対話と挑戦を通じて、単に起業やビジネスのスキルを学ぶ場ではなく、
                            本当に選びたい生き方やまなざし、作りたい物事の哲学を見つけるプロセスを後押しします。
                        </p>
                    </li>
                </ul>
            </div>

            <div className="w-full gap-6 px-[2vw] pt-20">
                <h3 className="font-bold pb-10">実施内容</h3>
                <p className=" pl-[1.5vw] text-base">
                    プログラム内容は、上記のPhase1~3をご確認ください。
                </p>

            </div>

        </div>
    )
}