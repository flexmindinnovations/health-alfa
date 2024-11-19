import { Container } from "@mantine/core";
import { useDocumentTitle } from "@hooks/DocumentTitle";
import { useTranslation } from "react-i18next";
export default function Users() {
    const { t } = useTranslation();
    useDocumentTitle(t("users"));
    return (
        <Container m={0}>
            <h1>Users Page</h1>
        </Container>
    )
}
