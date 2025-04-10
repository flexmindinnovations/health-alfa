import {
    Center,
    Combobox,
    Container,
    Loader,
    Text,
    useMantineTheme,
    InputBase,
    Stack,
    useCombobox,
    Grid,
    Paper,
    Skeleton,
    ScrollArea,
    Title
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useApiConfig } from "@contexts/ApiConfigContext.jsx";
import { useDocumentTitle } from "@hooks/DocumentTitle.jsx";
import { useEffect, useState } from "react";
import { DoctorCard } from "@components/DoctorCard";
import { BookAppointments } from "@components/BookAppointment.jsx";
import { useEncrypt } from "@hooks/EncryptData.jsx";
import { openNotificationWithSound } from "@config/Notifications.js";
import useHttp from "@hooks/AxiosInstance.jsx"; import { motion, AnimatePresence } from "framer-motion";
import { Stethoscope } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AddEditAppointment() {
    const { t } = useTranslation();
    useDocumentTitle(t("bookAppointment"));
    const [doctorList, setDoctorList] = useState([]);
    const [selectedDoctorId, setSelectedDoctorId] = useState(null);
    const [doctorInfo, setDoctorInfo] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const { apiConfig } = useApiConfig();
    const [listLoading, setListLoading] = useState(true);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const { getEncryptedData } = useEncrypt();
    const theme = useMantineTheme();
    const http = useHttp();
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });

    const navigate = useNavigate();

    // Fetch Doctor List
    useEffect(() => {
        const getDoctorList = async () => {
            setListLoading(true);
            setDoctorInfo(null);
            setSelectedDoctorId(null);
            setSearchValue('');
            try {
                const response = await http.get(apiConfig.doctors.getList);
                if (response?.status === 200) {
                    const formattedData = response.data.map((item) => ({
                        value: String(item.doctorId),
                        label: item.doctorName,
                    }));
                    setDoctorList(formattedData);
                } else {
                    setDoctorList([]);
                }
            } catch (err) {
                setDoctorList([]);
            } finally {
                setListLoading(false);
            }
        };
        getDoctorList();
    }, []);

    useEffect(() => {
        const getDoctorInfo = async (doctorId) => {
            if (!doctorId) {
                setDoctorInfo(null);
                return;
            }
            setDetailsLoading(true);
            setDoctorInfo(null);
            try {
                const response = await http.get(apiConfig.doctors.getDoctorInfoById(doctorId));
                if (response?.status === 200) {
                    setDoctorInfo(response.data);
                } else {
                    setDoctorInfo(null);
                }
            } catch (err) {
                setDoctorInfo(null);
                handleApiError(err);
            } finally {
                setDetailsLoading(false);
            }
        };

        getDoctorInfo(selectedDoctorId);
    }, [selectedDoctorId]);

    const handleApiError = (err) => {
        const { name, message } = err;
        openNotificationWithSound(
            {
                title: name || "Error",
                message: message || "An unexpected error occurred.",
                color: theme.colors.red[6],
            },
            { withSound: false }
        );
    };

    const filteredOptions = doctorList.filter((item) =>
        item.label.toLowerCase().includes(searchValue.toLowerCase().trim())
    );

    const options = filteredOptions.map((item) => (
        <Combobox.Option value={item.value} key={item.value}>
            {item.label}
        </Combobox.Option>
    ));

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        },
        exit: { opacity: 0 }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 },
        exit: { y: -20, opacity: 0 }
    };

    return (
        <Container fluid p="0">
            <Grid gutter="md">
                <Grid.Col span={{ base: 12, md: 12 }}>
                    <Title>{t('bookAppointment')}</Title>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 4 }}>
                    <Paper p="md" radius="md">
                        <Stack>
                            <Text fw={500}>{t('selectDoctor')}</Text>
                            {listLoading ? (
                                <Skeleton height={36} radius="md" />
                            ) : (
                                <Combobox
                                    store={combobox}
                                    withinPortal={false}
                                    onOptionSubmit={(val) => {
                                        const selectedOption = doctorList.find(option => option.value === val);
                                        setSelectedDoctorId(val);
                                        setSearchValue(selectedOption ? selectedOption.label : '');
                                        combobox.closeDropdown();
                                    }}
                                >
                                    <Combobox.Target>
                                        <InputBase
                                            value={searchValue}
                                            placeholder={t('searchDoctor')}
                                            rightSection={listLoading ? <Loader size="xs" /> : <Combobox.Chevron />}
                                            onChange={(event) => {
                                                setSearchValue(event.currentTarget.value);
                                                combobox.openDropdown();
                                                combobox.updateSelectedOptionIndex();
                                            }}
                                            onClick={() => combobox.openDropdown()}
                                            onFocus={() => combobox.openDropdown()}
                                            onBlur={() => combobox.closeDropdown()}
                                            rightSectionPointerEvents="none"
                                            radius="md"
                                        />
                                    </Combobox.Target>

                                    <Combobox.Dropdown>
                                        <Combobox.Options mah={200} style={{ overflowY: 'auto' }}>
                                            {options.length > 0 ? options : <Combobox.Empty>{t('nothingFound')}</Combobox.Empty>}
                                        </Combobox.Options>
                                    </Combobox.Dropdown>
                                </Combobox>
                            )}
                        </Stack>
                        <Stack py={40}>
                            {
                                detailsLoading ? (
                                    <Stack>
                                        <Skeleton height={120} radius="md" />
                                    </Stack>
                                ) :
                                    doctorInfo && (
                                        <motion.div variants={itemVariants}>
                                            <DoctorCard
                                                truncateTextLength={true}
                                                border={false}
                                                data={doctorInfo}
                                                key={doctorInfo.doctorId}
                                                loading={detailsLoading}
                                                onClick={(data, rect) => { }}
                                            />
                                        </motion.div>
                                    )
                            }
                        </Stack>
                    </Paper>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 8 }}>
                    <AnimatePresence mode="wait">
                        {selectedDoctorId ? (
                            <motion.div
                                key={selectedDoctorId}
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                <Paper shadow="none" p="none" radius="md">
                                    {detailsLoading ? (
                                        <Stack>
                                            <Skeleton height={300} radius="md" mt="md" />
                                        </Stack>
                                    ) : doctorInfo ? (
                                        <Stack>
                                            <motion.div variants={itemVariants}>
                                                <ScrollArea>
                                                    <BookAppointments showCancel={false}
                                                        data={doctorInfo}
                                                        handleCancel={() => { navigate('/app/appointments') }}
                                                    />
                                                </ScrollArea>
                                            </motion.div>
                                        </Stack>
                                    ) : (
                                        <motion.div variants={itemVariants}>
                                            <Center h={200}>
                                                <Text c="dimmed">{t('errorLoadingDoctorDetails')}</Text>
                                            </Center>
                                        </motion.div>
                                    )}
                                </Paper>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="placeholder"
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                <Paper
                                    shadow="none"
                                    p="xl"
                                    radius="md"
                                    style={{
                                        minHeight: 300,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Center>
                                        <Stack align="center" gap="sm">
                                            <Stethoscope size={48} color={theme.colors.gray[5]} />
                                            <Text c="dimmed" ta="center">
                                                {listLoading ? t('loadingDoctors') : t('selectDoctorPrompt')}
                                            </Text>
                                        </Stack>
                                    </Center>
                                </Paper>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Grid.Col>
            </Grid>
        </Container>
    );
}
