import {useCallback, useEffect, useState} from "react";
import {Button, CloseIcon, Container, Group, Loader, Stack, TextInput, useMantineTheme} from "@mantine/core";
import {useForm} from "@mantine/form";
import {z} from "zod";
import {zodResolver} from "mantine-form-zod-resolver";
import {Save, SquarePen} from "lucide-react";
import {useTranslation} from "react-i18next";
import {useApiConfig} from "@contexts/ApiConfigContext";
import useHttp from "@hooks/AxiosInstance.jsx";
import _ from "underscore";
import {openNotificationWithSound} from "@config/Notifications.js";

export function AddEditDocument({data, mode = "add", handleCancel, onAddEdit}) {
    const {i18n, t} = useTranslation();
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState("");
    const {apiConfig} = useApiConfig();
    const http = useHttp();
    const theme = useMantineTheme();
    const [disableFormField, setDisableFormField] = useState({
        DocumentTypeEnglish: false,
        DocumentTypeArabic: false
    })

    const addEditDocumentSchema = z.object({
        DocumentTypeEnglish: z.string().min(1, {message: t('englishNameIsRequired')}),
        DocumentTypeArabic: z.string().min(1, {message: t('arabicNameIsRequired')}),
    });
    const form = useForm({
        initialValues: {
            DocumentTypeEnglish: data?.documentTypeEnglish || '',
            DocumentTypeArabic: data?.documentTypeArabic || '',
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
        // debouncedTranslateText(disabledKey, value, targetLanguage);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const payload = form.values;
            const response = mode === 'add' ? await http.post(apiConfig.document.saveDocument, payload) : await http.put(apiConfig.document.updateDocument(data?.documentTypeId), payload);
            if (response.status === 200) {
                const data = response.data;
                openNotificationWithSound({
                    title: t('success'), message: data.message, color: theme.colors.brand[6]
                }, {withSound: false})
            }
        } catch (error) {
            const {data} = error.response;
            openNotificationWithSound({
                title: t('error'), message: data.message, color: theme.colors.red[6]
            }, {withSound: false})
        } finally {
            setLoading(false);
            handleCancel({refresh: true});
        }
    };

    useEffect(() => {
        setTitle(mode === "edit" ? `${t("edit")} ${t("document")}` : `${t("add")} ${t("document")}`);

        const {DocumentTypeEnglish, DocumentTypeArabic} = form.values;
        const lng = i18n.language;
        const sourceText = lng === 'en' ? DocumentTypeEnglish : DocumentTypeArabic;
        const targetLanguage = lng === 'en' ? 'ar' : 'en';
        const disabledKey = lng === 'en' ? 'DocumentTypeArabic' : 'DocumentTypeEnglish';
        setDisableFormField((val) => ({
            ...val,
            [disabledKey]: true,
        }));
        if (sourceText)
            handleTextChange(disabledKey, sourceText, targetLanguage)

        setLoading(false);
    }, [mode, data, t, i18n.language, form.values]);

    // if (loading) {
    //     return (
    //         <Container
    //             style={{
    //                 display: "flex",
    //                 justifyContent: "center",
    //                 alignItems: "center",
    //                 height: "100vh",
    //             }}
    //         >
    //             <Loader/>
    //         </Container>
    //     );
    // }

    return (
        // <ModalWrapper isOpen={open} toggle={handleOnClose} title={title} size="md">
        <Stack className="flex flex-col gap-2" p={20}>
            <TextInput
                {...form.getInputProps("DocumentTypeEnglish")}
                label={`${t("documentName")} ${t("english")}`}
                withAsterisk
                // disabled={disableFormField.DocumentTypeEnglish}
            />
            <TextInput
                {...form.getInputProps("DocumentTypeArabic")}
                label={`${t("documentName")} ${t("arabic")}`}
                withAsterisk
                // disabled={disableFormField.DocumentTypeArabic}
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
