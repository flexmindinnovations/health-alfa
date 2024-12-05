import { useEffect } from "react";
import { useTranslation } from "react-i18next";
export function useDocumentTitle(title) {
    const { t } = useTranslation();
    useEffect(() => {
        const pageTitle = `${t("brandName")} | ${title}`;
        document.title = pageTitle;
    }, [title])
}