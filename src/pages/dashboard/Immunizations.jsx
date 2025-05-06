import { Container } from "@mantine/core";
import { useDocumentTitle } from "@hooks/DocumentTitle";
import { useTranslation } from "react-i18next";
export default function Immunizations() {
    const { t } = useTranslation();
    useDocumentTitle(t("immunizations"));
    return (
        <Container p={15}>
            <h1>Immunizations Page</h1>
        </Container>
    )
}
