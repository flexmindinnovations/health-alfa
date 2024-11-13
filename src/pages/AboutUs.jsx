import { Container } from "@mantine/core";
import { useDocumentTitle } from "@hooks/DocumentTitle";
import { useTranslation } from "react-i18next";
export function AboutUs() {
    const {t} = useTranslation();
    useDocumentTitle(t("aboutUs"));

    return (
        <Container m={0}>
            <h1>
                About Us Page
            </h1>
        </Container>
    )
}