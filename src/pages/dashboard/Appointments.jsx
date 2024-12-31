import {Container, Loader} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {useApiConfig} from "@contexts/ApiConfigContext.jsx";
import {useDocumentTitle} from "@hooks/DocumentTitle.jsx";
import {useState} from "react";
import {useListManager} from "@hooks/ListManager.jsx";
import {DoctorCard} from "@components/DoctorCard.jsx";
import {motion} from "framer-motion";
import {BookAppointments} from "@components/BookAppointment.jsx";
import {v4 as uuid} from 'uuid';
import {useModal} from "@hooks/AddEditModal.jsx";

const staggerContainer = {
    hidden: {opacity: 0},
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
        },
    },
};

const cardVariants = {
    hidden: {opacity: 0, x: -20},
    visible: {opacity: 1, x: 0, transition: {type: "spring", stiffness: 100}},
};

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
            title: `${t("bookAppointment")} - ${data.doctorName}`,
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
                    {/*<motion.div*/}
                    {/*    variants={staggerContainer}*/}
                    {/*    initial={"hidden"}*/}
                    {/*    animate={"visible"}*/}
                    {/*    className={"grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2"}*/}
                    {/*>*/}
                    <div className={"grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2"}>
                        {/* Card Grid */}
                        {dataSource.map((row, index) => (
                            // <motion.div
                            //     key={row.doctorId}
                            //     layout
                            //     variants={cardVariants}
                            //     whileTap={{scale: 0.95, zIndex: 1000}}
                            //     transition={{type: "spring", stiffness: 50, damping: 100}}
                            //     className="top-1/2 left-1/2 !bg-white cursor-pointer z-40"
                            //     ref={handleCardRef(row.doctorId)}
                            // >
                            <div key={row.doctorId}>
                                <DoctorCard
                                    onClick={(data, rect) => handleCardClick(data, rect)}
                                    data={row}
                                    layoutId={`card-${row.doctorId}`}
                                    isDetailsCard={false}
                                    loading={loading}
                                />
                            </div>
                            // </motion.div>
                        ))}
                </div>
                    {/*</motion.div>*/}
                </Container>
            )}
        </div>
    );
}
