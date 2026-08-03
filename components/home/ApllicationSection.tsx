export default function ApplicationSection() {

    return (

        <div className="w-full space-y-10 px-[2vw] text-base">


            {/* Application Section */}
            <section>
                <h2>募集要項</h2>
                <ol className="space-y-2 custom-ol py-10 pl-[1.5vw]">
                    <li>TSGの応募条件を満たしていること</li>
                    <li>コミュニティ運営のノウハウや集客テクニックを学ぶだけではなく、自身のやりたいことを企画として立ち上げ、磨いていく意欲がある方</li>
                    <li>下記の各プログラムに参加できること
                        <div className="space-y-0 leading-normal my-2">
                            <span>9/27（日）　LAB.合同ミートアップ</span><br></br>
                            <span>10/11（日）　Community Design-LAB ゼミ#1</span><br></br>
                            <span>10/25（日）　Community Design-LAB ゼミ#2</span><br></br>
                            <span>11/8（日）　Community Design-LAB 1Dayキャンプ</span><br></br>
                            <span>11/22（日）　Community Design-LAB ゼミ#3</span><br></br>
                            <span>12/13（日）　メンタリング・デイ</span><br></br>
                        </div>
                    </li>
                </ol>
            </section>

            {/* Special Notes Section*/}
            <section>
                <h2>特記事項</h2>
                <ul className="space-y-2 custom-ul py-10  pl-[1.5vw]">
                    <li>申込みをいただいた後、一部対象者には個別に面談を行います。選考により参加者を決定します。</li>
                    <li>本プログラムにご参加いただく場合、9月27日(日)の合同キックオフは【参加必須】となりますので、必ずスケジュールの確保をお願いいたします。</li>
                    <li>参加費用は無料ですが、会場までの交通費等はご自身でご負担いただきます。</li>
                    <li>参加者の状況に合わせて、プログラムの内容は多少変更することがあります。予めご了承ください。</li>
                </ul>
            </section>

            {/* Organization Section*/}
            <section>
                <h2>運営団体</h2>
                <ul className="space-y-2 custom-ul py-10 pl-[1.5vw]">
                    <li>主催：東京都</li>
                    <li>企画運営事務局：
                        <a href="https://etic.or.jp/" target="_blank" rel="noopener noreferrer">NPO法人ETIC.</a>
                    </li>
                    <li>企画パートナー：
                        <a href="https://asiba.or.jp/" target="_blank" rel="noopener noreferrer">一般社団法人ASIBA</a>（代表理事　二瓶雄太）
                    </li>
                </ul>
            </section>

            {/* CTA Section*/}
            <section id="application">
                <h2>お申し込み</h2>
                <ul className="space-y-2 custom-ul py-10 pl-[1.5vw]">
                    <li>Community Design-LAB.への参加は、以下のリンクからアクセスいただきお申込みください。
                        <div className="mt-10 text-left">
                            {/* TODO: 4期の実際の応募フォームURLに差し替える */}
                            <a
                                href="#"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-lg"
                            >
                                お申し込みはこちら
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        </div>
                    </li>
                </ul>
            </section>

        </div>
    )
}
