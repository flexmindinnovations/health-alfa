import { utils } from "@config/utils";
import {
    Container,
    Divider,
    Group,
    Skeleton,
    Stack,
    Text,
    Title,
    useMantineTheme,
    Card,
    Badge,
    Table,
    Center,
    ScrollArea
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useApiConfig } from "@contexts/ApiConfigContext.jsx";
import { useEffect, useState, useMemo } from "react";
import { openNotificationWithSound } from "@config/Notifications.js";
import useHttp from "@hooks/AxiosInstance.jsx";
import { useLocation, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { useDocumentTitle } from "@hooks/DocumentTitle.jsx";

export default function AppointmentRowDetails() {
    const { t } = useTranslation();
    const { apiConfig } = useApiConfig();
    const [loading, setLoading] = useState(true);
    const theme = useMantineTheme();
    const http = useHttp();
    const params = useParams();
    const [dataSource, setDataSource] = useState(null);

    useDocumentTitle(dataSource ? `${t('prescription')} ${dataSource.patientName}` : t('loadingPrescription'));

    const medicationColumns = useMemo(() => [
        { accessor: 'medicineName', title: t('medicineName'), style: { padding: '10px', flex: 1 } },
        { accessor: 'dosage', title: t('dosage'), style: { padding: '10px', flex: 1 } },
        { accessor: 'frequency', title: t('frequency'), style: { padding: '10px', flex: 1 } },
    ], [t]);

    const formatDosage = (dosage) => {
        if (!dosage) return '';
        const parts = dosage.split(/(?=[A-Z])/);
        return parts.map(part => {
            const key = part.toLowerCase();
            return t(key) || part;
        }).join(' ');
    };

    const formatFrequency = (frequency) => {
        if (!frequency) return '';
        const parts = frequency.split(/(?=[A-Z])/);
        return parts.map(part => {
            const key = part.toLowerCase();
            return t(key) || part;
        }).join(' ');
    };

    useEffect(() => {
        getPrescriptionDetails();
    }, [params?.appointmentId]);

    const getPrescriptionDetails = async () => {
        if (!params?.appointmentId) {
            openNotificationWithSound(
                { title: t("error"), message: t("invalidAppointmentId"), color: "red" },
                { withSound: false }
            );
            setLoading(false);
            return;
        }
        setLoading(true);
        setDataSource(null);
        try {
            const response = await http.get(apiConfig.prescription.getPrescriptionListAppointIdWise(params.appointmentId));

            if (response?.status === 200 && response.data) {
                const data = Array.isArray(response.data) ? response.data[0] : response.data;

                if (data) {

                    const medicationsWithNames = data.medications?.map(med => ({
                        ...med,
                        dosage: formatDosage(med.dosage),
                        medicineName: med.medicineName || `${t('medicineId')}: ${med.medicineId}`
                    })) || [];
                    setDataSource({ ...data, medications: medicationsWithNames });
                } else {
                    setDataSource(null);
                    openNotificationWithSound(
                        { title: t("noDataFound"), message: t("noPrescriptionFound"), color: "orange" },
                        { withSound: false }
                    );
                }
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

    const medicationRows = dataSource?.medications?.map((med, index) => (
        <Table.Tr key={med.medicationId || index}>
            <Table.Td>{med.medicineName}</Table.Td>
            <Table.Td>{med.dosage || t('notAvailable')}</Table.Td>
            <Table.Td>{formatFrequency(med.frequency) || t('notAvailable')}</Table.Td>
        </Table.Tr>
    ));

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

    return (
        <Container fluid p={15} className="flex flex-col h-full">
            <Group py="md" justify="space-between" align="center">
                {loading ? (
                    <Skeleton height={30} width={250} radius="md" />
                ) : dataSource ? (
                    <Title order={5}>
                        {t('prescriptionFor')}: {dataSource.patientName}
                    </Title>
                ) : (
                    <Title order={3}>{t('prescriptionDetails')}</Title>
                )}
                {loading ? (
                    <Skeleton height={24} width={180} radius="md" />
                ) : dataSource ? (
                    <Badge color="blue" size="lg" variant="light">
                        {t('date')}: {dayjs(dataSource.prescriptionDate).format('DD MMM YYYY')}
                    </Badge>
                ) : null}
            </Group>
            <Divider mb="lg" />

            <Stack gap="lg" style={{ flex: 1 }}>
                {loading ? (
                    <Stack gap="lg">
                        <DetailItem label={t('prescribingDoctor')} isLoading={true} />
                        <DetailItem label={t('diagnosis')} isLoading={true} isTextArea={true} />
                        <DetailItem label={t('doctorSuggestion')} isLoading={true} isTextArea={true} />
                        <Card withBorder padding={0} radius="md">
                            <Text p="md" fw={500}>{t('medications')}</Text>
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
                        <DetailItem label={t('prescribingDoctor')} value={dataSource.doctorName} isLoading={false} />
                        <DetailItem label={t('diagnosis')} value={dataSource.diagnosis} isLoading={false} isTextArea={true} />

                        {dataSource.doctorSuggetion && (
                            <DetailItem label={t('doctorSuggestion')} value={dataSource.doctorSuggetion} isLoading={false} isTextArea={true} />
                        )}

                        <Card withBorder padding={0} radius="md">
                            <Text p="md" fw={500}>{t('medications')}</Text>
                            <Divider />
                            {dataSource.medications && dataSource.medications.length > 0 ? (
                                <ScrollArea mah={300} type="auto">
                                    <Table striped highlightOnHover withTableBorder stickyHeader>
                                        <Table.Thead>
                                            <Table.Tr>
                                                {medicationColumns.map(col => <Table.Th key={col.accessor} style={col.style}>{col.title}</Table.Th>)}
                                            </Table.Tr>
                                        </Table.Thead>
                                        <Table.Tbody>{medicationRows}</Table.Tbody>
                                    </Table>
                                </ScrollArea>
                            ) : (
                                <Text p="md" c="dimmed">
                                    {t('noMedicationsPrescribed')}
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
        </Container>
    );
}
