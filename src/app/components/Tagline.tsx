import Image from "next/image";

export default function Tagline() {

    const greenMosaicSize = 50;


    return (
        <div className="text-4xl leading-25">
            <p>
                同じ教室、同じ学年、同じ言葉を話しているはずなのに、
                <Image 
                    src = "/gifs/green-mosaic.gif"
                    alt = "green mosaic"
                    width = {500}
                    height = {140}
                    className="inline"
                    style={{
                        width: `${greenMosaicSize * 0.25}rem`,
                        marginRight: `-${greenMosaicSize * 0.25}rem`
                      }}
                />
                なぜか視線が合わない。
            </p>
            <p>
                心のどこかで、「自分の居場所はここではない」と感じてしまう。
            </p>
            <p>
                そんな人々にとって、学校は「生きる場所」ではなく、「生きるための場所」だった。
            </p>
            <div>
                そんな人々にとって、自分で「つくること」とは、
                <Image 
                    src = "/gifs/green-mosaic.gif"
                    alt = "green mosaic"
                    width = {500}
                    height = {140}
                    className="inline"
                    style={{
                        width: `${greenMosaicSize * 0.25}rem`,
                        marginRight: `-${greenMosaicSize * 0.25}rem`
                      }}
                />
                表現と思考の必死なあらわれであり、まさぐな「生き方」の表現だったはず。
            </div>
        </div>
    );
}