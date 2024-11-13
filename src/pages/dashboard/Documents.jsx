import { Container } from "@mantine/core";
import { useDocumentTitle } from "@hooks/DocumentTitle";
import { useTranslation } from "react-i18next";
export function Documents() {
    const { t } = useTranslation();
    useDocumentTitle(t("documents"));
    return (
        <Container m={0}>
            <h1>Documents Page</h1>
        </Container>
    )
}
