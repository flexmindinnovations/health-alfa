import {Container, Loader, useMantineTheme} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {useApiConfig} from "@contexts/ApiConfigContext.jsx";
import {useDocumentTitle} from "@hooks/DocumentTitle.jsx";
import {useEffect, useState} from "react";
import {DoctorCard} from "@components/DoctorCard.jsx";
import {BookAppointments} from "@components/BookAppointment.jsx";
import {v4 as uuid} from 'uuid';
import {useModal} from "@hooks/AddEditModal.jsx";
import {useEncrypt} from "@hooks/EncryptData.jsx";
import {AppointmentCard} from "@components/AppointmentCard.jsx";
import {openNotificationWithSound} from "@config/Notifications.js";
import useHttp from "@hooks/AxiosInstance.jsx";
import {AppointmentDetails} from "@components/AppointmentDetails.jsx";

export default function Appointments() {
    const {t} = useTranslation();
    useDocumentTitle(t("appointment"));
    const [dataSource, setDataSource] = useState([]);
    const {apiConfig} = useApiConfig();
    const [loading, setLoading] = useState(true);
    const [layoutIds, setLayoutIds] = useState({});
    const {openModal} = useModal();
    const {getEncryptedData} = useEncrypt();
    const theme = useMantineTheme();
    const http = useHttp();

    const getEndpoint = () => {
        const user = getEncryptedData('user');
        const role = getEncryptedData('roles')?.toLocaleLowerCase();
        let endpoint = apiConfig.doctors.getList;
        switch (role) {
            case 'doctor':
                endpoint = apiConfig.appointment.getAppointmentListByDoctorId(user);
                break;
            case 'patient':
            case 'client':
                endpoint = apiConfig.appointment.getAppointmentListByPatientIdId(user);
                break;
            case 'admin':
                endpoint = apiConfig.doctors.getList;
                break;
        }
        return endpoint;
    }

    useEffect(() => {
        getAppointmentList();
    }, []);

    const getAppointmentList = async () => {
        setLoading(true);
        try {
            const response = await http.get(getEndpoint());
            if (response?.status === 200) {
                setDataSource(response.data);
            }
        } catch (err) {
            setDataSource([]);
            const {name, message} = err;
            openNotificationWithSound(
                {
                    title: name || "Error",
                    message: message || "An unexpected error occurred.",
                    color: theme.colors.red[6],
                },
                {withSound: false}
            );
        } finally {
            setLoading(false);
        }
    }
    const getUserCard = (row) => {
        const role = getEncryptedData('roles')?.toLocaleLowerCase();
        let cardComponent = apiConfig.doctors.getList;
        switch (role) {
            case 'doctor':
                cardComponent = appointmentCard(row);
                break;
            case 'patient':
            case 'client':
                cardComponent = doctorCard(row);
                break;
            case 'admin':
                cardComponent = doctorCard(row);
                break;
        }
        return cardComponent;
    }
    const doctorCard = (row) => (
        <DoctorCard onClick={(data, rect) => handleCardClick(data, rect)}
                    data={row}
                    layoutId={`card-${row.doctorId}`}
                    isDetailsCard={false}
                    loading={loading}/>
    )
    const appointmentCard = (row) => (
        <AppointmentCard onClick={(data, rect) => handleCardClick(data, rect)}
                         data={row}
                         layoutId={`card-${row.doctorId}`}
                         isDetailsCard={false}
                         loading={loading}/>
    )
    const getGridLayout = () => {
        const role = getEncryptedData('roles')?.toLocaleLowerCase();
        let gridLayout = 'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2';
        switch (role) {
            case 'doctor':
                gridLayout = 'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4';
                break;
            case 'patient':
            case 'client':
                gridLayout = 'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2';
                break;
            case 'admin':
                gridLayout = 'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2';
                break;
        }
        return gridLayout;
    }
    const getModalComponent = () => {
        const role = getEncryptedData('roles')?.toLocaleLowerCase();
        let modalComponent = DoctorCard;
        switch (role) {
            case 'doctor':
                modalComponent = AppointmentDetails;
                break;
            case 'patient':
            case 'client':
                modalComponent = BookAppointments;
                break;
            case 'admin':
                modalComponent = BookAppointments;
                break;
        }
        return modalComponent
    }

    const handleCardClick = (data, rect) => {
        openAddEditModal(data, rect);
    };

    const openAddEditModal = (data, rect) => {
        openModal({
            Component: getModalComponent(),
            data: {
                ...data,
                initialRect: rect,
            },
            props: `min-h-[630px]`,
            size: 'xl',
            isAddEdit: false,
            title: `${t("bookAppointment")} - ${data.doctorName}`,
        });
    };

    const getRandomKey = () => {
        return uuid();
    }


    return (
        <div className="h-full w-full relative flex items-center justify-center">
            {loading ? (
                <Loader/>
            ) : (
                <Container fluid styles={{
                    root: {
                        overflow: 'auto',
                    }
                }}>
                    <div className={getGridLayout()}>
                        {dataSource.map((row, index) => (
                            <div key={getRandomKey()}>
                                {getUserCard(row)}
                            </div>
                        ))}
                    </div>
                </Container>
            )}
        </div>
    );
}
