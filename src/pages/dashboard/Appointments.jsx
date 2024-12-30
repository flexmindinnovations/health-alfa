import {Container, Grid, Loader} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {useApiConfig} from "@contexts/ApiConfigContext.jsx";
import {useDocumentTitle} from "@hooks/DocumentTitle.jsx";
import {useState} from "react";
import {useListManager} from "@hooks/ListManager.jsx";
import {DoctorCard} from "@components/DoctorCard.jsx";
import {AnimatePresence, motion} from "framer-motion";
import {BookAppointments} from "@components/BookAppointment.jsx";
import {v4 as uuid} from 'uuid';
import {useModal} from "@hooks/AddEditModal.jsx";

export default function Appointments() {
    const {t} = useTranslation();
    const [selectedDoctor, setSelectedDoctor] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const {apiConfig} = useApiConfig();
    useDocumentTitle(t("doctors"));
    const [openCardId, setOpenCardId] = useState(null);
    const [layoutIds, setLayoutIds] = useState({});
    const [initialRect, setInitialRect] = useState({});
    const {openModal} = useModal();

    const {
        loading,
        dataSource,
        handleRefresh,
    } = useListManager({
        apiEndpoint: apiConfig.doctors.getList,
    });

    const handleCardRef = (doctorId) => {
        return (node) => {
            if (node && !layoutIds[doctorId]) {
                setLayoutIds((prevIds) => ({
                    ...prevIds,
                    [doctorId]: uuid(),
                }));
            }
        };
    };


    const handleCardClick = (data, rect) => {
        // setOpenCardId(data.doctorId);
        // setSelectedDoctor(data);
        // setModalVisible(true);
        // setInitialRect(rect);
        openAddEditModal(data, rect);
    };

    const openAddEditModal = (data, rect) => {
        openModal({
            Component: BookAppointments,
            data: {
                data,
                initialRect: rect,
            },
            props: `min-h-[630px]`,
            size: 'xl',
            isAddEdit: false,
            title: t("bookAppointment"),
        });
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setInitialRect(null);
        setSelectedDoctor({});
    };


    return (
        <div className="h-full w-full relative flex items-center justify-center">
            {loading ? (
                <Loader/>
            ) : (
                <Container fluid>
                    <Grid>
                        {/* Card Grid */}
                        {dataSource.map((row) => (
                            <Grid.Col key={row.doctorId} span={{base: 4, sm: 12, md: 6, lg: 4, xl: 6}}>
                                <motion.div
                                    layout
                                    whileTap={{scale: 0.95, zIndex: 1000}}
                                    transition={{type: "spring", stiffness: 50, damping: 100}}
                                    className="top-1/2 left-1/2 !bg-white cursor-pointer z-40"
                                    ref={handleCardRef(row.doctorId)}
                                >
                                    <DoctorCard
                                        onClick={(data, rect) => handleCardClick(data, rect)}
                                        data={row}
                                        layoutId={`card-${row.doctorId}`}
                                        isDetailsCard={false}
                                        loading={loading}
                                    />
                                </motion.div>
                            </Grid.Col>
                        ))}

                        <AnimatePresence>
                            {
                                modalVisible && selectedDoctor && initialRect && (
                                    <BookAppointments layoutId={`card-${selectedDoctor.doctorId}`}
                                                      initialRect={initialRect}
                                                      data={selectedDoctor}
                                                      onClose={handleCloseModal}/>
                                )
                            }
                        </AnimatePresence>
                    </Grid>
                </Container>
            )}
        </div>
    );
}
