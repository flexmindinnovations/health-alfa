import { Container, useMantineTheme, Text } from "@mantine/core";
import { useDocumentTitle } from "@hooks/DocumentTitle";
import { useTranslation } from "react-i18next";
import { DataTableWrapper } from "@components/DataTableWrapper";
import { useApiConfig } from "@contexts/ApiConfigContext.jsx";
import { useListManager } from "@hooks/ListManager.jsx";
import { useMemo } from "react";
import { openNotificationWithSound } from "@config/Notifications.js";
import { utils } from "@config/utils.js";
import { useEncrypt } from "@hooks/EncryptData.jsx";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

export default function PrescriptionList() {
    const { t } = useTranslation();
    const { apiConfig } = useApiConfig();
    const theme = useMantineTheme();
    const { getEncryptedData } = useEncrypt();
    useDocumentTitle(t("prescriptionList"));
    const navigate = useNavigate();

    const columns = useMemo(
        () => {
            return [
                // {
                //     accessor: "appointmentId",
                //     title: t("id"),
                //     width: 80,
                //     style: { padding: "10px" },
                // },
                // {
                //     accessor: 'doctorProgfileImage',
                //     title: t('profileImagePath'),
                //     width: 80,
                //     style: {padding: '10px'},
                //     render: (record) => {
                //         const imageEndpoint = record.doctorProfileImagePath;
                //         const host = import.meta.env.VITE_API_URL;
                //         const imageUrl = `${host}/${imageEndpoint}`.replace('/api', '');
                //         return (
                //             <img
                //                 src={imageUrl}
                //                 alt={t('profileImage')}
                //                 style={{
                //                     width: '30px',
                //                     height: '30px',
                //                     margin: '0 auto',
                //                     borderRadius: '50%',
                //                     objectFit: 'cover',
                //                 }}
                //             />
                //         )
                //     }
                // },
                {
                    accessor: "patientName",
                    title: t("patientName"),
                    width: "auto",
                    style: { padding: "10px", flex: 1 },
                    render: (record) => (
                        <Text size="xs" p={0}>{record.patientName}</Text>
                    )
                },
                {
                    accessor: "durationInMinutes",
                    title: t("durationInMinutes"),
                    width: "auto",
                    style: { padding: "10px", flex: 1 },
                    render: (record) => (
                        <Text size="xs" p={0}>{record.durationInMinutes}</Text>
                    )
                },
                // {
                //     accessor: "mobileNo",
                //     title: t("mobileNo"),
                //     width: "auto",
                //     style: { padding: "10px", flex: 1 },
                // },
                // {
                //     accessor: "speciality",
                //     title: t("speciality"),
                //     width: "auto",
                //     style: { padding: "10px", flex: 1 },
                // },
                {
                    accessor: "appointmentDate",
                    title: t("appointmentDate"),
                    width: "auto",
                    style: { padding: "10px", flex: 1 },
                    render: (record) =>
                        record?.appointmentDate
                            ? dayjs(record.appointmentDate).format('DD/MM/YYYY')
                            : 'N/A',
                },
            ]
        },
        [t]
    );

    const { loading, dataSource, handleRefresh } = useListManager({
        apiEndpoint: apiConfig.appointment.getList,
        onError: (err) => {
            const { name, message } = err;
            openNotificationWithSound(
                {
                    title: name || t(utils.error),
                    message: message || t(utils.unexpectedError),
                    color: theme.colors.red[6],
                },
                { withSound: false }
            );
        }
    });

    const handleEventClick = (record) => {
        const { appointmentId, doctorId } = record;
        navigate(`/app/prescription/lookup/${doctorId}/${appointmentId}`);
    };

    return (
        <Container p={0} styles={{root: {display: 'flex'}}}>
            <DataTableWrapper
                loading={loading}
                showAddButton={false}
                id={"appointmentId"}
                addTitle={t("prescription")}
                columns={columns}
                dataSource={dataSource}
                showDeleteButton={false}
                showEditButton={false}
                showNavigation={true}
                onRefresh={handleRefresh}
                handleOnNavigate={(record) => handleEventClick(record)}
                noRecordsText={t('noRecordsToShow')}
            />
        </Container>
    );
}
