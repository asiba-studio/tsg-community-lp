import Image from "next/image";

export default function Tagline() {

    return (
        <div className="text-2xl font-bold md:text-3xl lg:text-5xl lg:leading-[7rem]">
            <p>
                建築・デザイン・アートなどの
            </p>
            <p>
                クリエイティブを志す若者を対象に、
            </p>
            <p>
                自ら
                <Image
                    src="/gifs/green-mosaic.gif"
                    alt="green mosaic"
                    width={500}
                    height={140}
                    className="inline w-24 -mr-24 lg:w-60 lg:-mr-60"
                />
                「つくること」を通して、
            </p>
            <p>
                <span className="-ml-[0.8rem] lg:-ml-[1.5rem]">
                    <Image
                        src="/gifs/green-mosaic.gif"
                        alt="green mosaic"
                        width={500}
                        height={140}
                        className="inline w-24 -mr-24 lg:w-45 lg:-mr-45"
                    />
                    「生き方」を探していくための3ヶ月のオープンなラボプログラム
                </span>
            </p>

        </div>
    );
}