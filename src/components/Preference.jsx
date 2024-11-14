import { Container, Group, Text, Select, useDirection } from "@mantine/core";
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from "react";

const providedLanguages = [
    { id: 1, label: "English", value: "en" },
    { id: 2, label: "Arabic", value: "ar" }
]

const rtlLanguages = ["ar"];

export function PreferenceComponent() {
    const [preference, setPreference] = useState(localStorage.getItem("lng"));
    const [languages, setLanguages] = useState(providedLanguages);
    const { dir, setDirection } = useDirection();
    const { i18n } = useTranslation();

    useEffect(() => {
        const lng = localStorage.getItem("lng") || "en";
        setPreference(lng);
    }, [])

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        const direction = rtlLanguages.includes(lng) ? "rtl" : "ltr";
        setDirection(direction);
        localStorage.setItem("dir", direction);
        localStorage.setItem("lng", lng);
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