import React, { useMemo, useCallback } from 'react';
import {
    useMantineTheme,
    ActionIcon,
    Container,
    Center,
    Text
} from '@mantine/core';
import { useTranslation } from "react-i18next";
import { useApiConfig } from "@contexts/ApiConfigContext.jsx";
import { useDocumentTitle } from "@hooks/DocumentTitle.jsx";
import { DataTableWrapper } from "@components/DataTableWrapper.jsx";
import { utils } from "@config/utils.js";
import { openNotificationWithSound } from "@config/Notifications.js";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { ExternalLink } from 'lucide-react';
import { useListManager } from "@hooks/ListManager.jsx";

export default function PatientDoctorHistory() {
    const { t } = useTranslation();
    const { apiConfig } = useApiConfig();
    const theme = useMantineTheme();
    const params = useParams();
    const navigate = useNavigate();

    const apiEndpoint = useMemo(() => {
        const { doctorId, patientId } = params;
        if (doctorId && patientId) {
            return apiConfig.patientVisits.getPatientVisitListDoctorAndPatientWise(doctorId, patientId);
        }
        return null;
    }, [params, apiConfig.patientVisits]);

    useDocumentTitle(apiEndpoint ? t("appointmentHistory") : t("loading"));

    const handleApiError = useCallback((err) => {
        const { name, message } = err;
        openNotificationWithSound(
            {
                title: name || t(utils.error),
                message: message || t(utils.unexpectedError),
                color: theme.colors.red[6],
            },
            { withSound: false }
        );
    }, [t, theme.colors.red]);

    const { loading, dataSource: rawDataSource, handleRefresh } = useListManager({
        apiEndpoint: apiEndpoint,
        onError: handleApiError,
        skip: !apiEndpoint
    });

    const processedDataSource = useMemo(() => {
        if (rawDataSource && Array.isArray(rawDataSource) && rawDataSource.length > 0) {
            return rawDataSource.map((item, index) => ({
                ...item,
                serialNumber: index + 1,
            }));
        }
        return [];
    }, [rawDataSource]);

    const columns = useMemo(() => {
        return [
            {
                accessor: 'serialNumber',
                title: t('serialNumber'),
                width: 100,
                style: { padding: '10px' },
                textAlign: 'center',
            },
            {
                accessor: 'visitDate',
                title: t('visitDate'),
                width: 'auto',
                style: { padding: '10px', flex: 1 },
                render: (record) =>
                    record?.visitDate
                        ? dayjs(record.visitDate).format('DD/MM/YYYY')
                        : 'N/A',
            },
            {
                accessor: 'doctorName',
                title: t('doctorName'),
                width: 'auto',
                style: { padding: '10px', flex: 1 },
            },
            {
                accessor: 'doctorSuggetion',
                title: t('doctorSuggestion'),
                width: 'auto',
                style: { padding: '10px', flex: 1 },
                ellipsis: true,
            }
        ];
    }, [t, navigate]);

    if (!params.doctorId || !params.patientId) {
        return (
            <Container>
                <Center style={{ height: '200px' }}>
                    <Text c="red">{t('missingDoctorOrPatientId')}</Text>
                </Center>
            </Container>
        );
    }

    return (
        <Container>
            <DataTableWrapper
                loading={loading}
                showAddButton={false}
                id={'visitId'}
                columns={columns}
                dataSource={processedDataSource}
                showDeleteButton={false}
                showEditButton={false}
                showNavigation={true}
                onRefresh={handleRefresh}
                handleOnNavigate={(record) => {
                    const { patientVisitId } = record;
                    navigate(`/app/prescription/details/${patientVisitId}`);
                }}
                noRecordsText={t('noRecordsToShow')}
                recordsPerPage={10}
                minHeight={processedDataSource.length === 0 ? 150 : 0}
            />
        </Container>
    );
}
