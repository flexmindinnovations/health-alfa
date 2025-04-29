import { Container, Stack, Group, Textarea, useMantineTheme } from '@mantine/core';
import { createRef, useRef, useEffect, useState } from "react";
import PrescriptionViewer from "@components/PrescriptionViewer.jsx";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ModalFooterButtons } from "@components/ModalFooterButtons.jsx";
import { v4 as uuid } from "uuid";
import { useEncrypt } from "@hooks/EncryptData.jsx";
import { modals } from "@mantine/modals";
import dayjs from "dayjs";
import useHttp from "@hooks/AxiosInstance.jsx";
import { useApiConfig } from "@contexts/ApiConfigContext.jsx";
import { openNotificationWithSound } from "@config/Notifications.js";
import { useParams } from 'react-router-dom';

const parentVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
            when: "beforeChildren",
        },
    },
}

const childVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { type: "spring", stiffness: 150, damping: 20 }
    },
};

export function UploadPrescription(
    {
        mode = 'add',
        data = {},
        layoutId,
        onClose,
        handleCancel
    }
) {
    const [prescriptions, setPrescriptions] = useState([{ id: uuid(), type: null, file: null }]);
    const prescriptionRefs = useRef([]);
    const notesRef = useRef('');
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const { getEncryptedData } = useEncrypt();
    const { apiConfig } = useApiConfig();
    const http = useHttp();
    const theme = useMantineTheme();
    const [doctorInfo, setDoctorInfo] = useState({});

    useEffect(() => {
        getDoctorInfo(data.doctorId).then(res => {
            if(res) setDoctorInfo(res);
        });
    }, [])
    

    const addPrescriptionRef = (index) => {
        if (!prescriptionRefs.current[index]) {
            prescriptionRefs.current[index] = createRef();
        }
        return prescriptionRefs.current[index];
    };


    const handleModalClose = () => {
        modals.closeAll();
    };

    const handlePrescriptionChange = (file, type, index) => {
        setPrescriptions((prev) => {
            const updated = prev.map((item, i) =>
                i === index ? { ...item, type, file } : item
            );
            return [...updated, { id: uuid(), type: 'null', file: null }];
        });
    };

    const getDoctorInfo = async (doctorId) => {
        try {
            console.log('doctorId: ', doctorId);
            
            const response = await http.get(apiConfig.doctors.getDoctorInfoById(doctorId));
            if (response?.status === 200) {
                return response.data;
            } else {
                return null;
            }
        } catch (err) {
            openNotificationWithSound({
                title: 'Error', message: err.message, color: theme.colors.red[6]
            }, {withSound: false});
            return null;
        }
    };

    const handleDelete = (data) => {
        setPrescriptions((prev) => {
            const updated = prev.filter((item, i) =>
                item.id !== data.id);
            return updated;
        })
    }

    const handleUploadPrescription = async () => {
        const patientId = getEncryptedData('user');
        const uploadedDocs = prescriptions.filter(item => item.file !== null).map(item => item.file);
        const formData = new FormData();
        const payload = {
            doctorId: doctorInfo?.doctorId,
            patientId: patientId,
            doctorName: doctorInfo?.doctorName || '',
            visitDate: dayjs().toISOString(),
            doctorSuggetion: notesRef.current.value
        }
        formData.append("model", JSON.stringify(payload));
        uploadedDocs.forEach(item => (
            formData.append("files", item)
        ))
        setLoading(true);
        try {
            const apiMethod = mode === 'add' ? http.post : http.put;
            const url = mode === 'add'
                ? apiConfig.patientVisits.savePatientVisit
                : `${apiConfig.patientVisits.updatePatientVisit(data?.visitId)}`;
            const response = await apiMethod(url, formData);
            if (response.status === 200) {
                const { data } = response;
                openNotificationWithSound(
                    {
                        title: t('success'),
                        message: data.message,
                        color: theme.colors.brand[9],
                    },
                    { withSound: false }
                );
                handleCancel({ refresh: false })
            } 

        } catch (error) {
            console.error('Error: ', error);
            const { name, message } = error;
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

    return (
        <Container>
            <Stack w={'100%'}>
                <motion.div className={`w-full h-full flex-1 flex items-start justify-start gap-1 flex-col`}>
                    <motion.div
                        variants={parentVariants}
                        initial="hidden"
                        animate="visible"
                        className={`
                p-5 w-full flex items-start justify-start 
                flex-wrap gap-3 min-h-96
                max-h-[40vh] overflow-y-auto
                `}>
                        {prescriptions.map((prescription, index) => (
                            <motion.div key={prescription.id} variants={childVariants}>
                                <PrescriptionViewer
                                    key={prescription.id}
                                    data={prescription}
                                    ref={addPrescriptionRef(index)}
                                    value={prescription.file}
                                    handleDelete={(data) => handleDelete(data)}
                                    onChange={(file, type) => handlePrescriptionChange(file, type, index)}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                    <motion.div
                        key={'notes'}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className={`w-full p-5`}
                    >
                        <Textarea
                            ref={notesRef}
                            minRows={3}
                            style={{
                                width: '100%'
                            }}
                            radius="lg"
                            label={t('notes')}
                        />
                    </motion.div>
                </motion.div>
                <Group position="right" px={20} py={20}
                    justify={'space-between'}>
                    <ModalFooterButtons
                        loading={loading}
                        disabled={loading || prescriptions.length === 1}
                        handleCancel={handleModalClose}
                        title={t('uploadPrescription')}
                        showCount={false}
                        selectedRows={[]}
                        handleSaveUpdate={handleUploadPrescription}
                    />
                </Group>
            </Stack>
        </Container>
    )
}