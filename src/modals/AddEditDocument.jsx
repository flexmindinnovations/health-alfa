import {useCallback, useEffect, useState} from "react";
import ModalWrapper from "@components/Modal";
import {Button, Container, Loader, Stack} from "@mantine/core";
import {useForm} from "@mantine/form";
import Input from "@components/Input";
import {z} from "zod";
import {zodResolver} from "mantine-form-zod-resolver";
import {Save} from "lucide-react";
import {useTranslation} from "react-i18next";
import {useApiConfig} from "@contexts/ApiConfigContext";
import useHttp from "@hooks/axios-instance";
import _ from "underscore";

export function AddEditDocument({data, mode = "add", handleOnClose, open}) {
    const {i18n, t} = useTranslation();
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState("");
    const {apiConfig} = useApiConfig();
    const http = useHttp();
    const [disableFormField, setDisableFormField] = useState({
        documentNameEnglish: false,
        documentNameArabic: false
    })

    const addEditDocumentSchema = z.object({
        documentNameEnglish: z.string().min(1, {message: t('englishNameIsRequired')}),
        documentNameArabic: z.string().min(1, {message: t('arabicNameIsRequired')}),
    });


    const form = useForm({
        initialValues: {
            documentNameEnglish: "",
            documentNameArabic: "",
        },
        validate: zodResolver(addEditDocumentSchema),
        validateInputOnBlur: true,
        validateInputOnChange: true,
    });

    const translateText = async (disabledKey, text, targetLanguage) => {
        if (text) {
            try {
                const response = await http.post(
                    apiConfig.translate,
                    JSON.stringify({
                        q: text,
                        source: i18n.language,
                        target: targetLanguage,
                        format: "text",
                        alternatives: 3,
                    }),
                    {headers: {"Content-Type": "application/json"}}
                );

                if (response?.data?.translatedText) {
                    form.setFieldValue(disabledKey, response.data.translatedText);
                }
            } catch (error) {
                console.error("Translation error", error);
            }
        }
    };

    const debouncedTranslateText = useCallback(
        _.debounce((disabledKey, nextValue, targetLanguage) => {
            translateText(disabledKey, nextValue, targetLanguage)
        }, 500)
        , []);

    const handleTextChange = (disabledKey, value, targetLanguage) => {
        debouncedTranslateText(disabledKey, value, targetLanguage);
    };

    const handleSubmit = async () => {
        // setLoading(true);
        console.log("Form submitted:", form.values);
    };

    useEffect(() => {
        setTitle(mode === "edit" ? `${t("edit")} ${t("document")}` : `${t("add")} ${t("document")}`);

        const {documentNameEnglish, documentNameArabic} = form.values;
        const lng = i18n.language;
        const sourceText = lng === 'en' ? documentNameEnglish : documentNameArabic;
        const targetLanguage = lng === 'en' ? 'ar' : 'en';
        const disabledKey = lng === 'en' ? 'documentNameArabic' : 'documentNameEnglish';
        setDisableFormField((val) => ({
            ...val,
            [disabledKey]: true,
        }));
        if (sourceText)
            handleTextChange(disabledKey, sourceText, targetLanguage)

        setLoading(false);
    }, [mode, data, t, i18n.language, form.values]);

    if (loading) {
        return (
            <Container
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                <Loader/>
            </Container>
        );
    }

    return (
        <ModalWrapper isOpen={open} toggle={handleOnClose} title={title} size="md">
            <Stack className="flex flex-col gap-2">
                <Input
                    {...form.getInputProps("documentNameEnglish")}
                    title={`${t("documentName")} ${t("english")}`}
                    withAsterisk
                    // disabled={disableFormField.documentNameEnglish}
                />
                <Input
                    {...form.getInputProps("documentNameArabic")}
                    title={`${t("documentName")} ${t("arabic")}`}
                    withAsterisk
                    // disabled={disableFormField.documentNameArabic}
                    styles={{
                        input: {
                            textAlign: 'right',
                            direction: 'rtl'
                        }
                    }}
                />

                <div className={`flex ${i18n.language === 'en' ? 'justify-end' : 'justify-start'} mt-4`}>
                    <Button
                        onClick={handleSubmit}
                        leftSection={<Save size={16}/>}
                        loading={loading}
                        disabled={!form.isValid()}
                    >
                        {t("submit")}
                    </Button>
                </div>
            </Stack>
        </ModalWrapper>
    );
}
