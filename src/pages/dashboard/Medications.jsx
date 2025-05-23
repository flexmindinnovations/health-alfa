import { Container } from "@mantine/core";
import { useDocumentTitle } from "@hooks/DocumentTitle";
import { useTranslation } from "react-i18next";
export default function Medications() {
    const { t } = useTranslation();
    useDocumentTitle(t("medications"));
    return (
        <Container p={15}>
            <h1>Medications Page</h1>
        </Container>
    )
}
