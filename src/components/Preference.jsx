import { Container, Group, Text, Select, useDirection } from "@mantine/core";
import { useTranslation } from 'react-i18next';
import { useState } from "react";

const providedLanguages = [
    { id: 1, label: "English", value: "en" },
    { id: 2, label: "Arabic", value: "ar" }
]

const rtlLanguages = ["ar"];

export function PreferenceComponent() {
    const [preference, setPreference] = useState("en");
    const [languages, setLanguages] = useState(providedLanguages);
    const { dir, setDirection } = useDirection();
    const { i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        if (rtlLanguages.includes(lng)) setDirection("rtl");
        else setDirection("ltr");
    }

    const handleLanguageChange = (option) => {
        changeLanguage(option.value);
    }

    return (
        <Container m={0} p={0} px={20}>
            <Group m={0} p={0} justify="space-between">
                <Text size="sm">Language</Text>
                <Select
                    size="sm"
                    placeholder="Select System Language"
                    data={languages}
                    defaultValue={preference}
                    allowDeselect={false}
                    onChange={(_value, option) => handleLanguageChange(option)}
                />
            </Group>
        </Container>
    )
}