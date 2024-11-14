import { Container } from "@mantine/core";
import { useDocumentTitle } from "@hooks/DocumentTitle";
import { useTranslation } from "react-i18next";
export function Allergies() {
    const { t } = useTranslation();
    useDocumentTitle(t("allergies"));
    return (
        <Container m={0}>
            <h1>Allergies Page</h1>
        </Container>
    )
}
