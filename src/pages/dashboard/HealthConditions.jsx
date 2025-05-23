import { Container } from "@mantine/core";
import { useDocumentTitle } from "@hooks/DocumentTitle";
import { useTranslation } from "react-i18next";
export default function HealthConditions() {
    const { t } = useTranslation();
    useDocumentTitle(t("healthConditions"));
    return (
        <Container p={15}>
            <h1>Health Conditions Page</h1>
        </Container>
    )
}
