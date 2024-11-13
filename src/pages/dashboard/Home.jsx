import Button from "@components/button.jsx"
import { Container } from "@mantine/core";
import { useTranslation } from "react-i18next";
export function Home() {
    const { t } = useTranslation();
    return (
        <Container m={0}>
            <h1>Home Page, {t('welcomeToReact')}</h1>
            <Button>Test</Button>
        </Container>
    )
}
