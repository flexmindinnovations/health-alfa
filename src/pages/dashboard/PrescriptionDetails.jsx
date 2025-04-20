import {
    Container,
    Skeleton,
    Text,
    useMantineTheme,
    Stack,
    Title,
    Group,
    Center,
    Card,
    Divider,
    ScrollArea,
    Grid,
    Image,
    Tooltip,
    CloseButton,
    Badge
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useApiConfig } from "@contexts/ApiConfigContext.jsx";
import { useEffect, useState } from "react";
import { openNotificationWithSound } from "@config/Notifications.js";
import useHttp from "@hooks/AxiosInstance.jsx";
import dayjs from "dayjs";
import { useDocumentTitle } from "@hooks/DocumentTitle.jsx";
import { useParams } from "react-router-dom";
import { utils } from "@config/utils.js";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { Document, Page, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = '/public/pdf.worker.min.mjs';

const MAX_PREVIEW_HEIGHT = 150;

export default function PrescriptionDetails() {
    const { t } = useTranslation();
    const { apiConfig } = useApiConfig();
    const [loading, setLoading] = useState(true);
    const theme = useMantineTheme();
    const http = useHttp();
    const params = useParams();
    const [dataSource, setDataSource] = useState(null);
    const [numPages, setNumPages] = useState(null);
    const [isDocumentPreviewOpen, setIsDocumentPreviewOpen] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null);

    useDocumentTitle(dataSource ? `${t('prescriptionFor')} ${dataSource.patientName} - ${dayjs(dataSource.visitDate).format('DD MMM YYYY')}` : t('loadingPrescription'));

    useEffect(() => {
        getPatientVisitInfoByVisitId();
    }, [params?.visitId]);

    const getPatientVisitInfoByVisitId = async () => {
        if (!params?.visitId) {
            openNotificationWithSound(
                { title: t("error"), message: t("invalidPatientVisitId"), color: "red" },
                { withSound: false }
            );
            setLoading(false);
            return;
        }
        setLoading(true);
        setDataSource(null);
        try {
            const response = await http.get(apiConfig.patientVisits.getPatientVisitInfoByVisitId(params.visitId));
            if (response?.status === 200 && response.data) {
                setDataSource(response.data);
            } else {
                setDataSource(null);
                openNotificationWithSound(
                    { title: t("noDataFound"), message: t("noPrescriptionFound"), color: "orange" },
                    { withSound: false }
                );
            }
        } catch (err) {
            setDataSource(null);
            const { name, message } = err;
            openNotificationWithSound(
                {
                    title: name || t(utils.error),
                    message: message || t(utils.unexpectedError),
                    color: theme.colors.red[6],
                },
                { withSound: false }
            );
        } finally {
            setLoading(false);
        }
    }

    const DetailItem = ({ label, value, isLoading, isTextArea = false }) => (
        <Card withBorder padding="md" radius="md">
            <Text size="sm" c="dimmed" mb={isLoading ? 8 : 2}>{label}</Text>
            {isLoading ? (
                <Skeleton height={isTextArea ? 40 : 16} width={isTextArea ? "100%" : "60%"} radius="sm" />
            ) : (
                <Text fw={500} style={isTextArea ? { whiteSpace: 'pre-wrap' } : {}}>
                    {value || t('notAvailable')}
                </Text>
            )}
        </Card>
    );

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    const handleDocumentClick = (document) => {
        setSelectedDocument(document);
        setIsDocumentPreviewOpen(true);
    };

    const handleClosePreview = () => {
        setIsDocumentPreviewOpen(false);
        setSelectedDocument(null);
    };

    return (
        <Container fluid className="flex flex-col h-full">
            {/* --- Header Section --- */}
            <Group py="md" justify="space-between" align="center">
                {/* Title */}
                {loading ? (
                    <Skeleton height={30} width={250} radius="md" />
                ) : dataSource ? (
                    <Title order={5}>
                        {t('prescriptionFor')}: {dataSource.patientName}
                    </Title>
                ) : (
                    <Title order={3}>{t('prescriptionDetails')}</Title>
                )}

                {/* Date Badge (Added Here) */}
                {loading ? (
                    <Skeleton height={24} width={180} radius="md" />
                ) : dataSource && dataSource.visitDate ? (
                    <Badge color="blue" size="lg" variant="light">
                        {t('date')}: {dayjs(dataSource.visitDate).format('DD MMM YYYY')}
                    </Badge>
                ) : null}
            </Group>
            <Divider mb="lg" />

            {/* --- Main Content --- */}
            <Stack gap="lg" style={{ flex: 1 }}>
                {loading ? (
                    <Stack gap="lg">
                        <DetailItem label={t('prescribingDoctor')} isLoading={true} />
                        <DetailItem label={t('doctorSuggestion')} isLoading={true} isTextArea={true} />
                        <Card withBorder padding={0} radius="md">
                            <Text p="md" fw={500}>{t('documents')}</Text>
                            <Divider />
                            <Stack p="md" gap="xs">
                                <Skeleton height={10} width="90%" radius="sm" />
                                <Skeleton height={10} width="70%" radius="sm" />
                                <Skeleton height={10} width="80%" radius="sm" />
                            </Stack>
                        </Card>
                    </Stack>
                ) : dataSource ? (
                    <>
                        <DetailItem
                            label={t('prescribingDoctor')}
                            value={dataSource.doctorName}
                            isLoading={false}
                        />
                        {dataSource.doctorSuggetion && (
                            <DetailItem
                                label={t('doctorSuggestion')}
                                value={dataSource.doctorSuggetion}
                                isLoading={false} isTextArea={true} />
                        )}
                        <Card withBorder padding={0} radius="md" >
                            <Text p="md" fw={500}>{t('documents')}</Text>
                            <Divider />
                            {dataSource.patientVisitDocumentList && dataSource.patientVisitDocumentList.length > 0 ? (
                                <ScrollArea mah={300} type="auto">
                                    <Grid p="md" gutter="md" >
                                        {dataSource.patientVisitDocumentList.map((document, index) => {
                                            const host = import.meta.env.VITE_API_URL;
                                            const imageUrl = `${host}/${document.documentFilePath}`?.replace('/api', '');
                                            const isPdf = document.documentFilePath.toLowerCase().endsWith('.pdf');
                                            return (
                                                <Grid.Col span={4} key={index} >
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                                    >
                                                        <Card withBorder radius="md" p="sm" onClick={() => handleDocumentClick(document)} className="cursor-pointer">
                                                            <div style={{ height: MAX_PREVIEW_HEIGHT, overflow: 'hidden' }}>
                                                                {isPdf ? (
                                                                    <Document file={imageUrl} onLoadSuccess={onDocumentLoadSuccess}>
                                                                        {Array.from(new Array(numPages), (el, index) => (<Page key={`page_${index + 1}`} pageNumber={index + 1} renderAnnotationLayer={false} renderTextLayer={false} scale={0.5} />))}
                                                                    </Document>
                                                                ) : (
                                                                    <Image src={imageUrl} alt={`Document ${index + 1}`} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                                                                )}
                                                            </div>
                                                            <Tooltip label={t('viewFull')}>
                                                                <Group justify="center" mt="sm">
                                                                    <ExternalLink size={16} />
                                                                </Group>
                                                            </Tooltip>
                                                        </Card>
                                                    </motion.div>
                                                </Grid.Col>
                                            );
                                        })}
                                    </Grid>
                                </ScrollArea>

                            ) : (
                                <Text p="md" c="dimmed" >
                                    {t('noDocumentsFound')}
                                </Text>
                            )}
                        </Card>

                    </>
                ) : (
                    <Center style={{ flex: 1 }}>
                        <Text c="dimmed">{t('couldNotLoadPrescription')}</Text>
                    </Center>
                )}
            </Stack>

            {/* --- Document Preview Modal --- */}
            <AnimatePresence>
                {isDocumentPreviewOpen && selectedDocument && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}
                    >
                        <CloseButton onClick={handleClosePreview} size="xl" style={{ position: 'absolute', top: 20, right: 20, zIndex: 1001 }} />
                        <motion.div
                            initial={{ scale: 0.5 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.5 }}
                            style={{ maxWidth: '90%', maxHeight: '90%', overflow: 'auto' }}
                        >
                            {selectedDocument.documentFilePath.toLowerCase().endsWith('.pdf') ? (
                                <Document file={`${import.meta.env.VITE_API_URL}/${selectedDocument.documentFilePath}`?.replace('/api', '')} onLoadSuccess={onDocumentLoadSuccess} >
                                    {Array.from(new Array(numPages), (el, index) => (
                                        <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                                    ))}
                                </Document>
                            ) : (
                                <Image src={`${import.meta.env.VITE_API_URL}/${selectedDocument.documentFilePath}`?.replace('/api', '')} alt="Full Document" style={{ width: '100%', height: 'auto' }} />
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </Container>
    );
}
