import { Container } from "@mantine/core";
import { useDocumentTitle } from "@hooks/DocumentTitle";
import { useTranslation } from "react-i18next";
export default function Allergies() {
    const { t } = useTranslation();
    useDocumentTitle(t("allergies"));
    return (
        <Container p={15}>
            <h1>Allergies Page</h1>
        </Container>
    )
}
