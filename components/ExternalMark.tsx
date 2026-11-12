// home_siteが別LPの項目（外部遷移）を示す控えめな↗マーク
export default function ExternalMark() {
    return (
        <span aria-hidden="true" className="ml-1 text-sm font-en">
            ↗
        </span>
    );
}
