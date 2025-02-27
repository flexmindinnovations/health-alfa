import {
    Center,
    ComboboxClearButton,
    Container,
    Group,
    Loader,
    SegmentedControl,
    TextInput,
    Tooltip,
    useMantineTheme
} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {useApiConfig} from "@contexts/ApiConfigContext.jsx";
import {useDocumentTitle} from "@hooks/DocumentTitle.jsx";
import {useEffect, useMemo, useRef, useState} from "react";
import {DoctorCard} from "@components/DoctorCard.jsx";
import {BookAppointments} from "@components/BookAppointment.jsx";
import {useModal} from "@hooks/AddEditModal.jsx";
import {useEncrypt} from "@hooks/EncryptData.jsx";
import {AppointmentCard} from "@components/AppointmentCard.jsx";
import {openNotificationWithSound} from "@config/Notifications.js";
import useHttp from "@hooks/AxiosInstance.jsx";
import {AppointmentDetails} from "@components/AppointmentDetails.jsx";
import {CalendarRange, LayoutGrid, SearchIcon} from "lucide-react";
import {motion} from "framer-motion";
import {AppointmentsCalendarView} from "@components/AppointmentsCalendarView.jsx";
import {useLocation} from "react-router-dom";
import {UploadPrescription} from "@components/UploadPrescription.jsx";
import {AppointmentFilter} from "@components/AppointmentFilter.jsx";
import {utils} from "@config/utils.js";

export default function Appointments() {
    const {t} = useTranslation();
    useDocumentTitle(t("appointment"));
    const [dataSource, setDataSource] = useState([]);
    const [filteredDataSource, setFilteredDataSource] = useState(dataSource);
    const {apiConfig} = useApiConfig();
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('card');
    const {openModal} = useModal();
    const {getEncryptedData} = useEncrypt();
    const theme = useMantineTheme();
    const http = useHttp();
    const [userType, setUserType] = useState('admin');
    const searchInputRef = useRef(null);
    const [searchText, setSearchText] = useState('');
    const location = useLocation();
    const segmentedItems = [
        {
            value: 'card',
            label: (
                <Center style={{gap: 10}}>
                    <Tooltip label={t('card')}>
                        <LayoutGrid size={16}/>
                    </Tooltip>
                </Center>
            ),
        },
        {
            value: 'timeline',
            disabled: userType !== 'doctor',
            label: (
                <Center style={{gap: 10}}>
                    <Tooltip label={t('timeline')}>
                        <CalendarRange size={16}/>
                    </Tooltip>
                </Center>
            ),
        }
    ];

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
            case 'user':
                // endpoint = apiConfig.appointment.getAppointmentListByPatientIdId(user);
                endpoint = apiConfig.doctors.getList;
                break;
            case 'admin':
                endpoint = apiConfig.doctors.getList;
                break;
        }
        return endpoint;
    }

    useEffect(() => {
        getAppointmentList();
        const role = getEncryptedData('roles')?.toLocaleLowerCase();
        setUserType(role);
    }, []);

    const getAppointmentList = async () => {
        setLoading(true);
        try {
            const response = await http.get(getEndpoint());
            if (response?.status === 200) {
                setDataSource(response.data);
                setFilteredDataSource(response.data);
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
        // setUserType(role);
        let cardComponent = apiConfig.doctors.getList;
        switch (role) {
            case 'doctor':
                cardComponent = appointmentCard(row);
                break;
            case 'patient':
            case 'client':
            case 'user':
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
        const path = location?.pathname && location.pathname?.split('/')[2] || '';
        const role = getEncryptedData('roles')?.toLocaleLowerCase();
        let modalComponent = DoctorCard;
        switch (role) {
            case 'doctor':
                modalComponent = AppointmentDetails;
                break;
            case 'patient':
            case 'client':
            case 'user':
                modalComponent = path && path === 'prescription' ? UploadPrescription : BookAppointments;
                break;
            case 'admin':
                modalComponent = path && path === 'prescription' ? UploadPrescription : BookAppointments;
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
            title: getModalTitle(data),
        });
    };

    const getModalTitle = (data) => {
        const path = location?.pathname && location.pathname?.split('/')[2] || '';
        let title = '';
        switch (path) {
            case 'prescription':
                title = `${t("prescription")} - ${data.doctorName}`;
                break;
            default:
                title = `${t("bookAppointment")} - ${data.doctorName}`;
        }
        return title;
    }

    const filterData = useMemo(() => {
        return (query) => {
            if (!query.trim()) {
                setFilteredDataSource(dataSource);
                return;
            }
            const filteredData = dataSource.filter((item) =>
                Object.values(item).some((value) =>
                    String(value).toLowerCase().includes(query.toLowerCase())
                )
            );
            setFilteredDataSource(filteredData);
        };
    }, [dataSource]);

    const dropdownDataFilter = useMemo(() => {
        return (filters) => {
            const {qualification, speciality, gender} = filters;
            const filteredData = dataSource.filter((item) => {
                const matchesQualification = qualification
                    ? item.qualification.includes(qualification)
                    : true;
                const matchesSpeciality = speciality
                    ? item.speciality.includes(speciality)
                    : true;
                const matchesGender = gender
                    ? item.gender === gender
                    : true;
                return matchesQualification && matchesSpeciality && matchesGender;
            });
            setFilteredDataSource(filteredData);
        };
    }, [dataSource]);

    const handleClearInput = () => {
        setSearchText('');
        filterData('');
    };

    const handleFilterTextChange = (event) => {
        const {value} = event.target;
        setSearchText(value);
        filterData(value);
    }

    const handleDateClick = (arg) => {
        // alert(arg.dateStr)
    }


    const handleEventClick = (info) => {
        // alert(`Event clicked: ${info.event.title}`);
    };

    const handleFilterChange = (filters) => {
        dropdownDataFilter(filters);
    }

    return (
        <div className="h-full w-full relative !overflow-hidden flex items-center justify-center">
            {loading ? (
                <Loader/>
            ) : (
                <Container fluid styles={{
                    root: {
                        overflow: 'auto',
                    }
                }}>
                    <Group py={20} items={'center'} justify={'space-between'}>
                        <Group>
                            {
                                view === 'card' && (
                                    <TextInput
                                        placeholder={t('search')}
                                        ref={searchInputRef}
                                        value={searchText}
                                        leftSection={<SearchIcon size={16}/>}
                                        onInput={handleFilterTextChange}
                                        rightSection={
                                            searchText &&
                                            <ComboboxClearButton onClear={() => handleClearInput()}/>
                                        }
                                        className={'w-full md:w-96 lg:w-96 xl:w-96'}
                                    />
                                )
                            }
                        </Group>
                        <Group>
                            {
                                <SegmentedControl
                                    onChange={setView}
                                    data={segmentedItems}
                                    transitionDuration={200}
                                    transitionTimingFunction="linear"
                                />
                            }
                        </Group>
                    </Group>
                    {
                        view === 'timeline' ? (
                                <motion.div className={`w-full`}>
                                    <AppointmentsCalendarView
                                        events={dataSource}
                                        loading={loading}
                                        handleEventClick={handleEventClick}
                                        handleDateClick={handleDateClick}
                                    />
                                </motion.div>
                            )
                            :
                            (
                                <div>
                                    <AppointmentFilter onFilterChange={handleFilterChange}/>
                                    <motion.div
                                        variants={utils.parentVariants}
                                        initial={'hidden'}
                                        animate={'visible'}
                                        className={`mt-4 ${getGridLayout()}`}>
                                        {filteredDataSource.map((row, index) => (
                                            <motion.div whileTap={{y: 10}} variants={utils.childVariants}
                                                        key={row.doctorId + index}>
                                                {getUserCard(row)}
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                </div>
                            )
                    }
                </Container>
            )}
        </div>
    );
}
