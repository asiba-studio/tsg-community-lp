import MosaicIcon from "@/components/MosaicIcon";

export function ProgramPhase1() {

    return (

        <div className="w-full">
            <div className="flex flex-wrap justify-end gap-10 items-end">
                <h2>
                    <img src="/gifs/phase1.gif" className="h-[1.8em] mb-0" alt="" />
                    <span className="sr-only mb-0">Phase1</span>
                </h2>
                <div className="flex-1 flex gap-10 mb-0.5 pr-3 font-bold text-lg">
                    <div>世界を　広げ　る</div>
                    <div className="font-en">Expan　dTheW　orld</div>
                </div>
                <div className="grid grid-cols-3 gap-15 px-20 py-10">
                    <div className=""><MosaicIcon number={1}/></div>
                    <div className=""><MosaicIcon number={2}/></div>
                    <div className=""><MosaicIcon number={3}/></div>
                </div>
            </div>
            
        </div>


    );

}