import {useViewportSize} from "@mantine/hooks";
import {motion, useAnimation} from "framer-motion";
import {
    BackgroundImage,
    Card,
    Container,
    Group,
    Loader,
    Overlay,
    Stack,
    Tabs,
    Text,
    Textarea,
    useMantineTheme
} from "@mantine/core";
import {useEffect, useRef, useState} from "react";
import dayjs from "dayjs";
import MorningImage from "../assets/images/morning.jpg";
import EveningImage from "../assets/images/evening.jpg";
import NightImage from "../assets/images/night.jpg";
import {CheckCircle} from "lucide-react";
import useHttp from "@hooks/AxiosInstance.jsx";
import {useApiConfig} from "@contexts/ApiConfigContext.jsx";
import {useTranslation} from "react-i18next";
import {v4 as uuid} from 'uuid';
import {openNotificationWithSound} from "@config/Notifications.js";
import {useEncrypt} from "@hooks/EncryptData.jsx";
import {ModalFooterButtons} from "@components/ModalFooterButtons.jsx";

const generateDate = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
        const currentDate = dayjs().add(i, 'day');
        const dateObject = {
            key: currentDate.format('dddd'),
            title: currentDate.format('YYYY-MM-DD'),
            value: currentDate.toDate(),
            date: currentDate.toISOString(),
            day: currentDate.format('dddd')
        };
        dates.push(dateObject);
    }
    return dates;
}

const getFormattedTime = (time) => {
    const currentDate = dayjs().format("YYYY-MM-DD");
    return dayjs(`${currentDate}T${time}`, "YYYY-MM-DDTHH:mm:ss").format("h:mm A");
}

const appendTimeToCurrentDate = (date, time) => {
    const currentDate = dayjs(date);
    const dateWithTime = dayjs(`${currentDate.format('YYYY-MM-DD')} ${time}`, 'YYYY-MM-DD hh:mm A');
    return dateWithTime.toISOString();
};

const getDurationInMinutes = (startTime, endTime) => {
    const start = dayjs(startTime);
    const end = dayjs(endTime);
    const durationInMinutes = end.diff(start, 'minute');
    return durationInMinutes;
}

const SlotCard = ({slot, isSelected, onClick, disabled}) => {
    const theme = useMantineTheme();
    return (
        <Card
            withBorder
            h={50}
            p={0}
            radius={'xl'}
            className={`cursor-pointer ${isSelected ? "!text-white" : ""} ${disabled ? "opacity-50 pointer-events-none" : ""}`}
            onClick={() => onClick(slot)}
        >
            <BackgroundImage
                radius="lg"
                h="100%"
                src={slot.backgroundImage}
            >
                <Overlay bg={isSelected ? theme.colors.brand[9] : theme.white} opacity={0.9} blur center>
                    <Stack
                        align="center"
                        justify="center"
                        gap={2}
                        color={isSelected ? theme.white : theme.colors.gray[9]}
                        className={isSelected ? theme.white : theme.colors.brand[9]}
                        styles={{
                            position: 'relative'
                        }}
                    >
                        {isSelected && (
                            <CheckCircle size={12} className={`absolute font-semibold top-2 right-3`}/>
                        )}
                        {/*<Text size="xs"*/}
                        {/*      fw={"bold"}>{slot.slotType.charAt(0).toUpperCase() + slot.slotType.slice(1)}</Text>*/}
                        <Text size="xs">{slot.startTime} - {slot.endTime}</Text>
                    </Stack>
                </Overlay>
            </BackgroundImage>
        </Card>
    );
};

const parentVariants = {
    hidden: {opacity: 0},
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
            when: "beforeChildren",
        },
    },
}

const childVariants = {
    hidden: {opacity: 0, x: -20},
    visible: {
        opacity: 1,
        x: 0,
        transition: {type: "spring", stiffness: 150, damping: 20}
    },
};

export function BookAppointments({
                                     data = {},
                                     layoutId,
                                     onClose,
                                     handleCancel
                                 }) {
    const {width, height} = useViewportSize();
    const controls = useAnimation();
    const [dates, setDates] = useState(generateDate());
    const [activeTab, setActiveTab] = useState(dates[0].key);
    const [loading, setLoading] = useState(false);
    const [isBooking, setIsBooking] = useState(false);
    const [doctorAvailability, setDoctorAvailability] = useState([]);
    const [selectedSlots, setSelectedSlots] = useState([]);
    const http = useHttp();
    const {apiConfig} = useApiConfig();
    const {t} = useTranslation();
    const [doctorInfo, setDoctorInfo] = useState(data?.data);
    const notesRef = useRef(null);
    const theme = useMantineTheme();
    const {getEncryptedData} = useEncrypt();
    const [slotTypes, setSlotTypes] = useState([]);
    const [activeSlotType, setActiveSlotType] = useState('morning');
    const [animationKey, setAnimationKey] = useState(0);

    useEffect(() => {
        controls.start({
            top: "50%",
            left: "50%",
            x: "-50%",
            y: "-50%",
            width: width * 0.6,
            height: height * 0.75,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 3000,
                damping: 100,
                duration: 0.4,
            },
        }).then(() => {
        });
    }, [controls, width, height]);

    const getDoctorAvailability = async (day) => {
        setLoading(true);
        try {
            const selectedDate = dates.find((date) => date.key === day);
            const {doctorId} = doctorInfo;
            const response = await http.get(apiConfig.doctors.getTimeSlots(doctorId, day, selectedDate.date));
            const data = response.data;
            if (response.status === 200) {
                const updatedData = data?.map((slot) => {
                        return {
                            ...slot,
                            id: uuid(),
                            startTime: getFormattedTime(slot?.startTime),
                            endTime: getFormattedTime(slot?.endTime),
                            backgroundImage: getBackgroundImageUrl(slot.slotType)
                        }
                    })?.sort((a, b) => {
                        const slotTypePriority = {morning: 1, afternoon: 2, evening: 3};
                        const typeComparison = slotTypePriority[a.slotType] - slotTypePriority[b.slotType];
                        if (typeComparison !== 0) {
                            return typeComparison;
                        }
                        const timeA = new Date(`1970-01-01T${a.startTime}`);
                        const timeB = new Date(`1970-01-01T${b.startTime}`);
                        return timeA - timeB;
                    })
                    ?? [];
                const _slotTypes = updatedData
                    .map((slot) => {
                        return {
                            key: slot.slotType,
                            value: slot.slotType,
                            title: slot.slotType.charAt(0).toUpperCase() + slot.slotType.slice(1),
                        }
                    })
                    .filter((value, index, self) => self.findIndex((t) => t.key === value.key) === index);
                setSlotTypes(_slotTypes);
                setDoctorAvailability(updatedData);
                setLoading(false);
            }
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    }

    useEffect(() => {
        getDoctorAvailability(activeTab).then(() => {
        });
        setSelectedSlots([]);
    }, [activeTab]);

    const getBackgroundImageUrl = (slotType) => {
        switch (slotType.toLowerCase()) {
            case 'morning':
                return MorningImage;
            case 'afternoon':
                return EveningImage;
            case 'evening':
                return NightImage;
            default:
                return MorningImage;
        }
    };

    const onCardClick = (slot) => {
        setSelectedSlots((prevSelectedSlots) => {
            if (prevSelectedSlots.includes(slot.id)) {
                return prevSelectedSlots.filter((selectedSlot) => selectedSlot !== slot.id);
            } else {
                // return [...prevSelectedSlots, slot.id];
                return [slot.id];
            }
        });
    };

    const handleBookAppointment = async () => {
        setIsBooking(true);
        const {doctorId} = doctorInfo;
        const selectedDate = dates.find((date) => date.key === activeTab);
        const selectedSlotsData = doctorAvailability.filter((slot) => selectedSlots.includes(slot.id));
        const selectedSlot = selectedSlotsData[0];
        const appointmentDate = appendTimeToCurrentDate(selectedDate.date, selectedSlot?.startTime);
        const user = getEncryptedData('user');
        const payload = {
            id: 0,
            doctorId,
            patientId: user,
            appointmentDate,
            durationInMinutes: getDurationInMinutes(appointmentDate, appendTimeToCurrentDate(selectedDate.date, selectedSlot?.endTime)),
            notes: notesRef.current.value,
            appointmentStatus: 'Booked'
        };
        try {
            const response = await http.post(apiConfig.appointment.bookAppointment, payload);
            if (response.status === 200) {
                const data = response.data;
                openNotificationWithSound({
                    title: t('success'), message: data.message, color: theme.colors.brand[6]
                }, {withSound: true})
                handleModalClose();
                setIsBooking(false);
            }
        } catch (error) {
            console.error(error);
            const {name, message} = error;
            setIsBooking(false);
            openNotificationWithSound(
                {
                    title: name || "Error",
                    message: message || "An unexpected error occurred.",
                    color: theme.colors.red[6],
                },
                {withSound: false}
            );
        }
    }

    const handleModalClose = () => {
        handleCancel({refresh: false});
    };

    const onTabChange = (tab) => {
        setActiveTab(tab);
    }

    const onChildTabChange = (tab) => {
        setActiveSlotType(tab);
        setAnimationKey((prevKey) => prevKey + 1);
    }

    return (
        <Container
            styles={{
                root: {
                    minHeight: 'inherit',
                }
            }}
        >
            <Tabs
                variant={'pills'}
                value={activeTab}
                onChange={onTabChange}
                className="flex-grow"
                styles={{
                    root: {
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                    },
                    panel: {
                        minHeight: `calc(100vh - 355px)`,
                    }
                }}
            >
                <Tabs.List justify="center">
                    {dates.map(({key, title, day}) => (
                        <Tabs.Tab key={key} value={key}>
                            <Stack gap={0} align="center">
                                <Text size="xs">{title}</Text>
                                <Text size="xs">{day}</Text>
                            </Stack>
                        </Tabs.Tab>
                    ))}
                </Tabs.List>
                <Tabs.Panel value={activeTab} py={20}
                            styles={{
                                root: {
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }
                            }}>
                    {loading ? (
                        <div className={`h-full w-full min-h-full flex items-center justify-center min-h-[inherit]`}>
                            <Loader/>
                        </div>
                    ) : doctorAvailability?.length > 0 ? (
                        <Stack>
                            <Tabs
                                variant={'pills'}
                                value={activeSlotType}
                                onChange={onChildTabChange}
                            >
                                <Tabs.List justify="center">
                                    {slotTypes.map(({key, value, title}) => (
                                        <Tabs.Tab key={key} value={value}>
                                            <Text size="sm">{title}</Text>
                                        </Tabs.Tab>
                                    ))}
                                </Tabs.List>
                                {slotTypes.map(({key, value}) => (
                                    <Tabs.Panel key={key} value={value} className={`py-8`}>
                                        <motion.div
                                            key={animationKey}
                                            style={{
                                                padding: '0 20px',
                                                minHeight: 'calc(100vh - 560px)',
                                                maxHeight: 'calc(100vh - 560px)',
                                                overflowY: 'auto',
                                            }}
                                            variants={parentVariants}
                                            initial="hidden"
                                            animate="visible"
                                            className={`grid gap-y-2 grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`}
                                        >
                                            {doctorAvailability
                                                ?.filter((slot) => slot.slotType === key)
                                                ?.map((slot) => (
                                                    <motion.div key={slot.id}
                                                                variants={childVariants}
                                                                className={`h-[50px]`}
                                                    >
                                                        <SlotCard
                                                            disabled={isBooking}
                                                            slot={slot}
                                                            isSelected={selectedSlots.includes(slot.id)}
                                                            onClick={onCardClick}
                                                        />
                                                    </motion.div>
                                                ))}
                                        </motion.div>
                                    </Tabs.Panel>
                                ))}
                            </Tabs>
                            <Group w={'100%'} px={20}>
                                <Textarea
                                    disabled={isBooking}
                                    ref={notesRef}
                                    minRows={3}
                                    style={{
                                        width: '100%'
                                    }}
                                    radius="lg"
                                    label={t('notes')}
                                />
                            </Group>
                        </Stack>
                    ) : (
                        <motion.div className={`h-full w-full flex items-center justify-center min-h-[inherit]`}>
                            <Text align="center" opacity={0.4}>
                                {t('noSlotsAvailable')}
                            </Text>
                        </motion.div>
                    )}
                </Tabs.Panel>
            </Tabs>
            <Group position="right" px={20} py={10} justify={'space-between'}>
                <ModalFooterButtons
                    loading={isBooking}
                    disabled={isBooking || !selectedSlots.length}
                    handleCancel={handleModalClose}
                    title={t('bookSlot')}
                    showCount={true}
                    selectedRows={selectedSlots}
                    handleSaveUpdate={handleBookAppointment}
                />
            </Group>
        </Container>
    );
}
