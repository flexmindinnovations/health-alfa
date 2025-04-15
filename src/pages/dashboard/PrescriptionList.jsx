import { Container, useMantineTheme } from "@mantine/core";
import { useDocumentTitle } from "@hooks/DocumentTitle";
import { useTranslation } from "react-i18next";
import { DataTableWrapper } from "@components/DataTableWrapper";
import { useApiConfig } from "@contexts/ApiConfigContext.jsx";
import { useListManager } from "@hooks/ListManager.jsx";
import { useMemo } from "react";
import { openNotificationWithSound } from "@config/Notifications.js";
import { utils } from "@config/utils.js";
import { useEncrypt } from "@hooks/EncryptData.jsx";
import dayjs from "dayjs";

export default function PrescriptionList() {
    const { t } = useTranslation();
    const { apiConfig } = useApiConfig();
    const theme = useMantineTheme();
    const { getEncryptedData } = useEncrypt();
    useDocumentTitle(t("prescriptionList"));


    const doctorApiResponse = [
        {
            "doctorId": 1,
            "doctorName": "Sharma",
            "doctorAddress": "Pune",
            "mobileNo": "+918983502886",
            "dateOfBirth": "1989-12-14T00:00:00",
            "gender": "Female",
            "qualification": "MD,MBBS,MCh",
            "speciality": "Heart,Pediatrics,Obstetrics and Gynecology,Cardiothoracic Surgery",
            "medicalRegistrationNumber": "",
            "medicalCouncil": "",
            "registerDate": "2024-11-24T20:13:08.743",
            "emailId": "",
            "doctorProfileImagePath": "Resources/Images/Doctor_1.webp",
            "doctorProgfileImage": "Resources/Images/Doctor_1.webp"
        },
        {
            "doctorId": 2,
            "doctorName": "TEst Doctor Test",
            "doctorAddress": "Pune",
            "mobileNo": "+919090909098",
            "dateOfBirth": "2024-12-07T00:00:00",
            "gender": "Male",
            "qualification": "MD,MCh,DM",
            "speciality": "Internal Medicine,Dermatology,Clinical Hematology,Nephrology",
            "medicalRegistrationNumber": "123",
            "medicalCouncil": "",
            "registerDate": "2024-12-15T17:21:20.183",
            "emailId": "",
            "doctorProfileImagePath": "Resources/Images/Doctor_2.webp",
            "doctorProgfileImage": "Resources/Images/Doctor_2.webp"
        },
        {
            "doctorId": 3,
            "doctorName": "",
            "doctorAddress": "",
            "mobileNo": "+919988776655",
            "dateOfBirth": "0001-01-01T00:00:00",
            "gender": "",
            "qualification": "",
            "speciality": "",
            "medicalRegistrationNumber": "",
            "medicalCouncil": "",
            "registerDate": "2025-01-25T06:06:17.113",
            "emailId": "",
            "doctorProfileImagePath": "",
            "doctorProgfileImage": ""
        },
        {
            "doctorId": 4,
            "doctorName": "Patil",
            "doctorAddress": "Pune",
            "mobileNo": "+919876543210",
            "dateOfBirth": "1989-12-28T00:00:00",
            "gender": "Male",
            "qualification": ",MBBS",
            "speciality": ",General Medicine",
            "medicalRegistrationNumber": "",
            "medicalCouncil": "",
            "registerDate": "2025-03-12T14:42:49.04",
            "emailId": "",
            "doctorProfileImagePath": "",
            "doctorProgfileImage": ""
        }
    ]

    const columns = useMemo(
        () => {
            return [
                {
                    accessor: "doctorId",
                    title: t("id"),
                    width: 80,
                    style: { padding: "10px" },
                },
                {
                    accessor: 'doctorProgfileImage',
                    title: t('profileImagePath'),
                    width: 80,
                    style: {padding: '10px'},
                    render: (record) => {
                        const imageEndpoint = record.doctorProfileImagePath;
                        const host = import.meta.env.VITE_API_URL;
                        const imageUrl = `${host}/${imageEndpoint}`.replace('/api', '');
                        return (
                            <img
                                src={imageUrl}
                                alt={t('profileImage')}
                                style={{
                                    width: '30px',
                                    height: '30px',
                                    margin: '0 auto',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                }}
                            />
                        )
                    }
                },
                {
                    accessor: "doctorName",
                    title: t("doctorName"),
                    width: "auto",
                    style: { padding: "10px", flex: 1 },
                },
                {
                    accessor: "mobileNo",
                    title: t("mobileNo"),
                    width: "auto",
                    style: { padding: "10px", flex: 1 },
                },
                {
                    accessor: "speciality",
                    title: t("speciality"),
                    width: "auto",
                    style: { padding: "10px", flex: 1 },
                },
                {
                    accessor: "registerDate",
                    title: t("registerDate"),
                    width: "auto",
                    style: { padding: "10px", flex: 1 },
                    render: (record) =>
                        record?.registerDate
                            ? dayjs(record.registerDate).format('DD/MM/YYYY')
                            : 'N/A',
                },
            ]
        },
        [t]
    );

    const { loading, dataSource, handleRefresh } = useListManager({
        apiEndpoint: apiConfig.doctors.getList,
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
        console.log('record: ', record);

    };

    return (
        <Container>
            <DataTableWrapper
                loading={loading}
                showAddButton={false}
                id={"doctorId"}
                addTitle={t("prescription")}
                columns={columns}
                dataSource={doctorApiResponse}
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
