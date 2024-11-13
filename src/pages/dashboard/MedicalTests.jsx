import { Container } from "@mantine/core";
import { useDocumentTitle } from "@hooks/DocumentTitle";
import { useTranslation } from "react-i18next";
export function MedicalTests() {
    const { t } = useTranslation();
    useDocumentTitle(t("medicalTests"));
    return (
        <Container m={0}>
            <h1>Medical Tests Page</h1>
        </Container>
    )
}
