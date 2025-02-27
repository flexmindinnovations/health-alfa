import { useLocation } from 'react-router-dom';
import { useCallback, useEffect, useState, useMemo } from "react";
import {
    ActionIcon,
    Button,
    Container,
    Divider,
    Group,
    Select,
    Skeleton,
    Stack,
    Text,
    Textarea,
    TextInput,
    Title,
    useMantineTheme,
    Combobox, InputBase, useCombobox
} from "@mantine/core";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import useHttp from "@hooks/AxiosInstance.jsx";
import { useApiConfig } from '@contexts/ApiConfigContext.jsx'
import { debounce } from 'lodash';
import { openNotificationWithSound } from "@config/Notifications.js";
import { Plus, Trash2 } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { AppointmentRowItem } from '@components/AppointmentRowItem';

function AppointmentDetails() {
    const location = useLocation();
    const { t } = useTranslation();
    const { post } = useHttp();
    const { apiConfig } = useApiConfig();
    const theme = useMantineTheme();
    const [medicineList, setMedicineList] = useState([{ medicineId: '', frequency: '', dosage: '' }])
    const [diagnosis, setDiagnosis] = useState('');
    const [doctorSuggestion, setDoctorSuggestion] = useState('');
    const navigate = useNavigate();
    const [isSaving, setIsSaving] = useState(false);
    const state = location.state?.data || null;
    const [selectedMedicines, setSelectedMedicines] = useState([]);

    const addMedicine = () => {
        setMedicineList(prev => [
            ...prev,
            { medicineId: '', dosage: '', frequency: '' }
        ])
    };

    const removeMedicine = (index) => {
        setMedicineList(prev => prev.filter((_, i) => i !== index));
    };

    useEffect(() => {
        setSelectedMedicines(medicineList.map(item => item?.medicineId || null));
    }, [medicineList]);


    const handleInputChange = (values, index) => {
        setMedicineList(prev =>
            prev.map((item, i) =>
                i === index ? { ...item, ...values } : item
            )
        );
    };

    const isFormValid = useMemo(() => {
        return (
            medicineList.length > 0 &&
            medicineList.every(item => Object.values(item).every(value => value !== '' && value !== null && value !== undefined)) &&
            diagnosis.trim() !== '' &&
            doctorSuggestion.trim() !== ''
        );
    }, [medicineList, diagnosis, doctorSuggestion]);

    const saveMedicine = async (values) => {
        setIsSaving(true);
        setSelectedMedicines([]);
        const payload = {
            prescriptionId: state?.prescriptionId || 0,
            appointmentId: state?.appointmentId || 0,
            doctorId: state?.doctorId || 0,
            patientId: state?.patientId || 0,
            prescriptionDate: dayjs(state?.appointmentDate).toISOString() || dayjs().toISOString(),
            diagnosis,
            medications: medicineList.map((item) => {
                return {
                    medicationId: item?.medicationId || 0,
                    medicineId: item?.medicineId,
                    frequency: item?.frequency,
                    dosage: item?.dosage
                }
            })
        }

        try {
            const response = await post(
                apiConfig.doctorPrescription.saveDoctorPrescription,
                payload
            );
            if (response.status === 200) {
                openNotificationWithSound(
                    {
                        title: "Success",
                        message: response.data.message,
                        color: "blue",
                    },
                    { withSound: false }
                );

                navigate('/app/appointments');
            }
        } catch (error) {
            openNotificationWithSound(
                {
                    title: error.name || "Error",
                    message: error.message || "An unexpected error occurred.",
                    color: "red",
                },
                { withSound: false }
            );
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <Container fluid className={`relative`}>
            <Group py={20} className={`w-full flex items-center !justify-between`}>
                <Title>{state?.patientName}</Title>
                <Text className={`flex items-center`} size={"sm"}
                    opacity={0.8}>{t('appointmentDate')}:&nbsp;{dayjs(state?.appointmentDate).format('DD-MM-YYYY')}</Text>
            </Group>
            <Divider className="w-full" />
            <Stack gap={0} className={`max-h-[calc(100vh-300px)] overflow-y-auto`}>
                <Group pt={20} className={`w-full px-4 flex items-center !justify-between`}>
                    <Group className={`w-full flex items-center !justify-between`}>
                        <Text opacity={0.6}>Medications:</Text>
                        <Button onClick={addMedicine}>
                            <Plus size={16} className={`mr-1`} /> {t('medicine')}
                        </Button>
                    </Group>
                    <Stack w={'100%'} py={10} mah={250} className='overflow-auto'>
                        {
                            medicineList.map((field, index) => <AppointmentRowItem key={index} state={state}
                                selectedMedicines={selectedMedicines}
                                showDelete={medicineList?.length > 1} index={index} handleInputChange={(values) => handleInputChange(values, index)} removeMedicine={() => removeMedicine(index)} />)
                        }
                    </Stack>
                </Group>
                <Group py={10} className={`w-full px-4 flex items-center !justify-start`}>
                    <Text p={0} opacity={0.6}>{t('doctorSuggestion')}:</Text>
                    <Textarea rows={4} className="w-full" onChange={(event) => setDoctorSuggestion(event.target.value)} />
                </Group>
                <Group py={10} className={`w-full px-4 flex items-center !justify-start`}>
                    <Text p={0} opacity={0.6}>{t('diagnosis')}:</Text>
                    <Textarea rows={4} className="w-full" onChange={(event) => setDiagnosis(event.target.value)} />
                </Group>
            </Stack>
            <Group py={20} bg={theme.white} className={`w-full absolute bottom-0 right-0 flex items-center !justify-end`}>
                <Divider className="w-full" />
                <Button disabled={!isFormValid || isSaving} loading={isSaving} className={`mx-4`} onClick={saveMedicine}>Save</Button>
            </Group>
        </Container>
    )
}

export default AppointmentDetails