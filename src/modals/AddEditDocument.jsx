import {useCallback, useEffect, useState} from "react";
import {Button, CloseIcon, Container, Group, Loader, Stack, TextInput} from "@mantine/core";
import {useForm} from "@mantine/form";
import {z} from "zod";
import {zodResolver} from "mantine-form-zod-resolver";
import {Save, SquarePen} from "lucide-react";
import {useTranslation} from "react-i18next";
import {useApiConfig} from "@contexts/ApiConfigContext";
import useHttp from "@hooks/AxiosInstance.jsx";
import _ from "underscore";

export function AddEditDocument({data, mode = "add", handleCancel, onAddEdit}) {
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
            documentNameEnglish: data?.documentTypeEnglish || '',
            documentNameArabic: data?.documentTypeArabic || '',
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
        onAddEdit();
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
        // <ModalWrapper isOpen={open} toggle={handleOnClose} title={title} size="md">
        <Stack className="flex flex-col gap-2" p={20}>
            <TextInput
                {...form.getInputProps("documentNameEnglish")}
                label={`${t("documentName")} ${t("english")}`}
                withAsterisk
                // disabled={disableFormField.documentNameEnglish}
            />
            <TextInput
                {...form.getInputProps("documentNameArabic")}
                label={`${t("documentName")} ${t("arabic")}`}
                withAsterisk
                // disabled={disableFormField.documentNameArabic}
                styles={{
                    input: {
                        textAlign: 'right',
                        direction: 'rtl'
                    }
                }}
            />

            <Group gap={20} justify={'right'}
                   className={`flex ${i18n.language === 'en' ? 'justify-end' : 'justify-start'} mt-4`}>
                <Button
                    onClick={handleCancel}
                    leftSection={<CloseIcon size={16}/>}
                    variant="outline"
                >
                    {t("cancel")}
                </Button>
                <Button
                    onClick={handleSubmit}
                    leftSection={mode === 'add' ? <Save size={16}/> : <SquarePen size={16}/>}
                    loading={loading}
                    disabled={!form.isValid()}
                >
                    {mode === 'add' ? t("submit") : t("update")}
                </Button>
            </Group>
        </Stack>
        // </ModalWrapper>
    );
}
