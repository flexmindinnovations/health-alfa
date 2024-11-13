import { Container } from "@mantine/core";
import { useDocumentTitle } from "@hooks/DocumentTitle";
import { useTranslation } from "react-i18next";

export function ContactUs() {
    const { t } = useTranslation();
    useDocumentTitle(t("contactUs"));
    return (
        <Container m={0}>
            <h1>
                Contact Us Page
            </h1>
        </Container>
    )
}