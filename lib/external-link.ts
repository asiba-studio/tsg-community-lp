// home_siteが他LPのlisted項目への外部リンク共通props（新しいタブで開く）
export function listedLinkProps(title: string, isExternal: boolean, label: string) {
    if (!isExternal) return {};
    return {
        target: "_blank" as const,
        rel: "noopener noreferrer",
        "aria-label": `${title}（${label}・新しいタブで開く）`,
    };
}
