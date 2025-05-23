import { Container } from "@mantine/core";
import { useDocumentTitle } from "@hooks/DocumentTitle";
import { useTranslation } from "react-i18next";
export default function MedicalTests() {
    const { t } = useTranslation();
    useDocumentTitle(t("medicalTests"));
    return (
        <Container p={15}>
            <h1>Medical Tests Page</h1>
        </Container>
    )
}
