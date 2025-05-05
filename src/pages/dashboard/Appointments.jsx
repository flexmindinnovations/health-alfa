import {
    ComboboxClearButton,
    Center,
    Button,
    Container,
    Group,
    Loader,
    SegmentedControl,
    Text,
    TextInput,
    Tooltip,
    useMantineTheme,
    Tabs, Pagination
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useApiConfig } from "@contexts/ApiConfigContext.jsx";
import { useDocumentTitle } from "@hooks/DocumentTitle.jsx";
import React, { useEffect, useMemo, useRef, useState, createElement } from "react";
import { DoctorCard } from "@components/DoctorCard.jsx";
import { BookAppointments } from "@components/BookAppointment.jsx";
import { useModal } from "@hooks/AddEditModal.jsx";
import { useEncrypt } from "@hooks/EncryptData.jsx";
import { AppointmentCard } from "@components/AppointmentCard.jsx";
import { openNotificationWithSound } from "@config/Notifications.js";
import useHttp from "@hooks/AxiosInstance.jsx";
import { AppointmentDetails } from "@components/AppointmentDetails.jsx";
import { CalendarRange, LayoutGrid, SearchIcon } from "lucide-react";
import { motion } from "framer-motion";
import { AppointmentsCalendarView } from "@components/AppointmentsCalendarView.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import { UploadPrescription } from "@components/UploadPrescription.jsx";
import { AppointmentFilter } from "@components/AppointmentFilter.jsx";
import { utils } from "@config/utils.js";
import { CheckCircle, CalendarCheck, XCircle } from 'lucide-react';

export default function Appointments() {
    const { t } = useTranslation();
    useDocumentTitle(t("appointment"));
    const [dataSource, setDataSource] = useState([]);
    const [filteredDataSource, setFilteredDataSource] = useState(dataSource);
    const { apiConfig } = useApiConfig();
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('card');
    const { openModal } = useModal();
    const { setEncryptedData, getEncryptedData } = useEncrypt();
    const theme = useMantineTheme();
    const http = useHttp();
    const [userType, setUserType] = useState('admin');
    const searchInputRef = useRef(null);
    const [searchText, setSearchText] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const [activePage, setActivePage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(12);
    const segmentedItems = [
        {
            value: 'card',
            label: (
                <Center style={{ gap: 10 }}>
                    <Tooltip label={t('card')}>
                        <LayoutGrid size={16} />
                    </Tooltip>
                </Center>
            ),
        },
        {
            value: 'timeline',
            disabled: userType !== 'doctor',
            label: (
                <Center style={{ gap: 10 }}>
                    <Tooltip label={t('timeline')}>
                        <CalendarRange size={16} />
                    </Tooltip>
                </Center>
            ),
        }
    ];

    const appointmentItems = [
        { id: 1, key: 'completed', title: t('completed'), icon: CheckCircle },
        { id: 2, key: 'booked', title: t('booked'), icon: CalendarCheck },
        { id: 3, key: 'cancelled', title: t('cancelled'), icon: XCircle },
    ];

    const [activeTab, setActiveTab] = useState('completed');

    const getEndpoint = (status = utils.appointmentStatus.COMPLETED) => {
        const user = getEncryptedData('user');
        const _itemsPerPage = user === 'doctor' ? 12 : 6;
        setItemsPerPage(_itemsPerPage);
        const role = getEncryptedData('roles')?.toLocaleLowerCase();
        let endpoint = apiConfig.doctors.getList;
        switch (role) {
            case 'doctor':
                endpoint = apiConfig.appointment.getAppointmentByStatusAndDoctorId(user, status);
                break;
            case 'patient':
            case 'client':
            case 'user':
                endpoint = apiConfig.appointment.getAppointmentByStatusAndPatientId(user, status);
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

    const getAppointmentList = async (status = utils.appointmentStatus.COMPLETED) => {
        setLoading(true);
        try {
            const response = await http.get(getEndpoint(status));
            if (response?.status === 200) {
                setDataSource(response.data);
                setFilteredDataSource(response.data);
            }
        } catch (err) {
            setDataSource([]);
            const { name, message } = err;
            openNotificationWithSound(
                {
                    title: name || "Error",
                    message: message || "An unexpected error occurred.",
                    color: theme.colors.red[6],
                },
                { withSound: false }
            );
        } finally {
            setLoading(false);
        }
    }
    const getUserCard = (row, index) => {
        const role = getEncryptedData('roles')?.toLocaleLowerCase();
        let cardComponent = apiConfig.doctors.getList;
        switch (role) {
            case 'doctor':
                cardComponent = appointmentCard(row);
                break;
            case 'patient':
            case 'client':
            case 'user':
                cardComponent = doctorCard(row, index);
                break;
            case 'admin':
                cardComponent = doctorCard(row);
                break;
        }
        return cardComponent;
    }
    const doctorCard = (row, index) => (
        <DoctorCard onClick={(data, rect) => handleCardClick(data, rect)}
            data={row}
            key={row.appointmentId}
            layoutId={`card-${row.doctorId}`}
            isDetailsCard={false}
            loading={loading} />
    )
    const appointmentCard = (row) => (
        <AppointmentCard onClick={(data, rect) => handleCardClick(data, rect)}
            data={row}
            layoutId={`card-${row.doctorId}`}
            isDetailsCard={false}
            loading={loading} />
    )

    const getGridLayout = () => {
        const role = getEncryptedData('roles')?.toLocaleLowerCase();
        let gridLayout = 'grid grid-cols-1 p-4 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3';
        switch (role) {
            case 'doctor':
                gridLayout = 'grid grid-cols-1 p-4 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 auto-rows-[150px]';
                break;
            case 'patient':
            case 'client':
            case 'user':
                gridLayout = 'grid grid-cols-1 p-4 gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 auto-rows-[230px]';
                break;
            case 'admin':
                gridLayout = 'grid grid-cols-1 p-4 gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-3 2xl:grid-cols-4';
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
                modalComponent = path && path === 'prescription' ? UploadPrescription : activeTab !== 'completed' ? AppointmentDetails : BookAppointments;
                break;
            case 'admin':
                modalComponent = path && path === 'prescription' ? UploadPrescription : BookAppointments;
                break;
        }
        return modalComponent
    }

    const handleCardClick = (data, rect) => {
        const role = getEncryptedData('roles')?.toLocaleLowerCase();
        const path = location?.pathname && location.pathname?.split('/')[2] || '';
        const { appointmentId } = data;
        setEncryptedData('appointmentId', appointmentId);
        if (role !== 'doctor') {
            if (activeTab !== 'completed') {
                openAddEditModal(data, rect);
            } else {
                navigate(path === 'prescription' ? `/app/appointments/details/${data.appointmentId}` : `/app/appointments/lookup/${data.doctorId}/${data.patientId}`, { state: { data } })
            }
        } else {
            if (activeTab === 'completed') {
                navigate(`/app/appointments/lookup/${data.doctorId}/${data.patientId}`, { state: { data } })
            } else {
                openAddEditModal(data, rect);

                // navigate(`/app/appointments/details/${data.appointmentId}`, { state: { data } })
            }
        }
    };

    const openAddEditModal = (data, rect) => {
        openModal({
            Component: getModalComponent(),
            data: {
                ...data,
                initialRect: rect,
            },
            props: `min-h-[480px]`,
            size: 'xl',
            closable: true,
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
                title = activeTab !== 'completed' ? `${t('appointmentDetails')} - ${data.patientName}` : `${t("bookAppointment")} - ${data.doctorName}`;
        }
        return title;
    }

    const filterData = useMemo(() => {
        return (query) => {
            let filteredData;
            if (!query.trim()) {
                filteredData = dataSource;
            } else {
                filteredData = dataSource.filter((item) =>
                    Object.values(item).some((value) =>
                        String(value).toLowerCase().includes(query.toLowerCase())
                    )
                );
            }
            setFilteredDataSource(filteredData);
            setActivePage(1);
        };
    }, [dataSource]);


    const dropdownDataFilter = useMemo(() => {
        return (filters) => {
            const { qualification, speciality, gender } = filters;
            const hasFilters = qualification || speciality || gender;

            const filteredData = !hasFilters ? dataSource : dataSource.filter((item) => {
                const matchesQualification = qualification
                    ? item.qualification?.includes(qualification)
                    : true;
                const matchesSpeciality = speciality
                    ? item.speciality?.includes(speciality)
                    : true;
                const matchesGender = gender
                    ? item.gender === gender
                    : true;
                return matchesQualification && matchesSpeciality && matchesGender;
            });
            setFilteredDataSource(filteredData);
            setActivePage(1);
        };
    }, [dataSource]);


    const handleClearInput = () => {
        setSearchText('');
        filterData('');
    };

    const handleFilterTextChange = (event) => {
        const { value } = event.target;
        setSearchText(value);
        filterData(value);
    }

    const onTabChange = (tab) => {
        setActiveTab(tab);
        getAppointmentList(tab);
    }

    const handlePageChange = (page) => {
        setActivePage(page);
    };

    const handleDateClick = (arg) => {
        // alert(arg.dateStr)
    }

    const handleNewAppointment = () => {
        navigate('/app/book-appointment');
    }


    const handleEventClick = (info) => {
        // alert(`Event clicked: ${info.event.title}`);
    };

    const handleFilterChange = (filters) => {
        dropdownDataFilter(filters);
    }

    return (
        <Container fluid styles={{
            root: {
                display: 'flex',
                flexDirection: 'column'
            }
        }}>
            {/* Top Controls */}
            <Group py={20} justify="space-between">
                <Group>
                    {view === 'card' && (
                        <TextInput
                            placeholder={t('search')}
                            ref={searchInputRef}
                            value={searchText}
                            leftSection={<SearchIcon size={16} />}
                            onInput={handleFilterTextChange}
                            rightSection={
                                searchText && (
                                    <ComboboxClearButton onClear={handleClearInput} />
                                )
                            }
                            className="w-full md:w-96"
                        />
                    )}
                </Group>

                <Group>
                    {/* <SegmentedControl
                        onChange={setView}
                        data={segmentedItems}
                        transitionDuration={200}
                        transitionTimingFunction="linear"
                    /> */}
                    {
                        (userType === utils.userTypes.CLIENT || userType === utils.userTypes.USER) && (
                            <Button onClick={handleNewAppointment}>
                                {t('bookAppointment')}
                            </Button>
                        )
                    }
                </Group>
            </Group>

            {/* Conditional Views */}
            {view === 'timeline' ? (
                <motion.div className="w-full">
                    <AppointmentsCalendarView
                        events={dataSource}
                        loading={loading}
                        handleEventClick={handleEventClick}
                        handleDateClick={handleDateClick}
                    />
                </motion.div>
            ) : (
                <Tabs value={activeTab} onChange={onTabChange} styles={{
                    root: { flex: '1', display: 'flex', flexDirection: 'column', overflow: 'auto' },
                    panel: { height: '100%', flex: '1' }
                }}>
                    <Tabs.List>
                        {appointmentItems.map((item) => (
                            <Tabs.Tab
                                key={item.id}
                                value={item.key}
                                leftSection={createElement(item.icon, { size: 16 })}
                            >
                                {t(item.key)}
                            </Tabs.Tab>
                        ))}
                    </Tabs.List>
                    {appointmentItems.map((item) => (
                        <Tabs.Panel key={item.id} value={item.key} py={20}>
                            {
                                loading ? (
                                    <motion.div className="h-full w-full flex items-center justify-center">
                                        <Loader />
                                    </motion.div>
                                ) :
                                    (
                                        <motion.div className="h-full w-full flex flex-col">
                                            {
                                                filteredDataSource?.length ? (
                                                    <motion.div className={`mt-4 flex-1 ${getGridLayout()}`}>
                                                        {
                                                            filteredDataSource
                                                                .slice(
                                                                    (activePage - 1) * itemsPerPage,
                                                                    activePage * itemsPerPage
                                                                )
                                                                .map((row, index) => (
                                                                    <React.Fragment key={row.appointmentId || row.doctorId || `appointment-${index}`}>
                                                                        {getUserCard(row)}
                                                                    </React.Fragment>
                                                                ))
                                                        }
                                                    </motion.div>
                                                )
                                                    : (
                                                        <motion.div className="flex items-center justify-center h-full">
                                                            <Text size="xl" opacity={0.5}>
                                                                {t('noDataFound')}
                                                            </Text>
                                                        </motion.div>
                                                    )
                                            }
                                            {
                                                filteredDataSource?.length > itemsPerPage && (
                                                    <Pagination mt={20} total={Math.ceil(filteredDataSource.length / itemsPerPage)} value={activePage}
                                                        onChange={handlePageChange}
                                                        styles={{
                                                            root: {
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center'
                                                            }
                                                        }}
                                                        withEdges />
                                                )
                                            }
                                        </motion.div>
                                    )
                            }
                        </Tabs.Panel>
                    ))}
                </Tabs>
            )}
        </Container>
    );
}
