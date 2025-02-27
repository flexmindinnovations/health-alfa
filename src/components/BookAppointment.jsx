import {useViewportSize} from "@mantine/hooks";
import {AnimatePresence, motion, useAnimation} from "framer-motion";
import {Card, Center, Group, Loader, Stack, Tabs, Text, Textarea, useMantineTheme} from "@mantine/core";
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
import classes from '@styles/BookAppointment.module.css';
import {utils} from "@config/utils.js";

const generateDate = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
        const currentDate = dayjs().add(i, 'day');
        const dateObject = {
            key: currentDate.format('dddd'),
            title: currentDate.format('DD-MM-YYYY'),
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
    const currentDate = dayjs(date).format('YYYY-MM-DD');
    const dateWithTime = dayjs(`${currentDate} ${time}`, 'YYYY-MM-DD hh:mm A');
    return dateWithTime.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
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
            py={5}
            px={25}
            miw={120}
            h={'100%'}
            width={'100%'}
            radius={'xl'}
            className={`cursor-pointer ${(disabled || slot?.isBooked) ? "cursor-not-allowed pointer-events-none" : ""}`}
            bg={slot?.isBooked ? theme.colors.gray[5] : isSelected ? theme.colors.brand[9] : theme.white}
            onClick={() => onClick(slot)}
        >
            <Center
                h={'100%'}
                w={'100%'}
            >
                <AnimatePresence>
                    {isSelected && (
                        <motion.div
                            key={'check-circle'}
                            className={`absolute top-2 right-2.5`}
                            initial={{opacity: 0, scale: 0}}
                            animate={{opacity: 1, scale: 1}}
                            exit={{opacity: 0, scale: 0}}
                            transition={{duration: 0.3}}
                        >
                            <CheckCircle size={12} className={`text-white font-semibold`}/>
                        </motion.div>
                    )}
                    <motion.div
                        key={'slot-info'}
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        transition={{duration: 0.3}}
                    >
                        <Text size="xs" className={`!select-none`} fw={'550'}
                              c={(isSelected || slot?.isBooked) ? theme.white : theme.colors.brand[9]}>{slot.startTime}</Text>
                    </motion.div>
                </AnimatePresence>
            </Center>
        </Card>
    );
};

export function BookAppointments({
                                     data = {},
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
    const [doctorInfo, setDoctorInfo] = useState(data);
    const notesRef = useRef(null);
    const theme = useMantineTheme();
    const {getEncryptedData} = useEncrypt();
    const [slotTypes, setSlotTypes] = useState([]);
    const [activeSlotType, setActiveSlotType] = useState('morning');
    const [animationKey, setAnimationKey] = useState(0);
    const [areSlotsRendered, setAreSlotsRendered] = useState(false);

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
            const response = await http.get(apiConfig.doctors.getTimeSlots(doctorId, day, dayjs(selectedDate.date).format('YYYY-MM-DD')));
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
                const activeSlot = _slotTypes?.length ? _slotTypes[0].value : null;
                setActiveSlotType(activeSlot);
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
        if (slot) {
            setSelectedSlots((prevSelectedSlots) => {
                if (prevSelectedSlots.includes(slot.id)) {
                    return prevSelectedSlots.filter((selectedSlot) => selectedSlot !== slot.id);
                } else {
                    // return [...prevSelectedSlots, slot.id];
                    return [slot.id];
                }
            });
        } else {
            setSelectedSlots([]);
        }
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
        setActiveSlotType(null);
        setAreSlotsRendered(false);
        onCardClick(null);
    }

    const onChildTabChange = (tab) => {
        setActiveSlotType(tab);
        setAreSlotsRendered(false);
        setAnimationKey((prevKey) => prevKey + 1);
        onCardClick(null);
    }

    return (
        <div className={`min-h-[inherit] relative`}>
            <Tabs
                keepMounted={false}
                variant={'unstyled'}
                value={activeTab}
                radius={'xl'}
                onChange={onTabChange}
                classNames={classes}
                className="flex-grow"
                styles={{
                    root: {
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                    },
                    panel: {
                        minHeight: theme.breakpoints.lg ? `calc(100vh - 370px)` : `calc(100vh - 260px)`,
                    },
                }}
            >
                <Tabs.List justify="center" variant="scrollable">
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
                        <div className={`h-full w-full flex items-center justify-center min-h-[inherit]`}>
                            <Loader/>
                        </div>
                    ) : doctorAvailability?.length > 0 ? (
                        <Stack>
                            <Tabs
                                keepMounted={false}
                                radius={'xl'}
                                classNames={classes}
                                variant={'unstyled'}
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
                                                minHeight: 'calc(100vh - 580px)',
                                                maxHeight: 'calc(100vh - 580px)',
                                                overflowY: 'auto',
                                            }}
                                            variants={utils.parentVariants}
                                            initial="hidden"
                                            animate="visible"
                                            className={`flex items-start`}
                                            onAnimationComplete={() => setAreSlotsRendered(true)}
                                        >
                                            <div
                                                className={`grid grid-cols-3 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-5 gap-4 mx-auto`}
                                            >
                                                {doctorAvailability
                                                    ?.filter((slot) => slot.slotType === key)
                                                    ?.map((slot) => (
                                                        <motion.div key={slot.id}
                                                                    variants={utils.childVariants}
                                                                    whileTap={slot.isBooked ? {y: 0} : {y: 3}}
                                                                    className={`p-0 h-10`}
                                                        >
                                                            <SlotCard
                                                                disabled={isBooking}
                                                                slot={slot}
                                                                isSelected={selectedSlots.includes(slot.id)}
                                                                onClick={onCardClick}
                                                            />
                                                        </motion.div>
                                                    ))}
                                            </div>
                                        </motion.div>
                                    </Tabs.Panel>
                                ))}
                            </Tabs>
                            <Group w={'100%'} px={20}>
                                <div className={`w-full min-h-[5.5rem]`}>
                                    <AnimatePresence>
                                        {selectedSlots.length > 0 && (
                                            <motion.div
                                                key={animationKey}
                                                initial={{opacity: 0, y: -20}}
                                                animate={{opacity: 1, y: 0}}
                                                exit={{opacity: 0, y: -20}}
                                                transition={{duration: 0.3}}
                                                className={`w-full`}
                                            >
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
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </Group>
                        </Stack>
                    ) : (
                        <motion.div
                            initial={{opacity: 0, x: -20}}
                            animate={{opacity: 1, x: 0}}
                            exit={{opacity: 0, x: -20}}
                            className={`h-full w-full flex items-center justify-center min-h-[inherit]`}>
                            <Text align="center" opacity={0.4}>
                                {t('noSlotsAvailable')}
                            </Text>
                        </motion.div>
                    )}
                </Tabs.Panel>
            </Tabs>
            <Group className={`absolute bottom-4 w-full`} position="right" px={20} py={10} justify={'space-between'}>
                <ModalFooterButtons
                    loading={isBooking}
                    disabled={isBooking || !selectedSlots.length}
                    handleCancel={handleModalClose}
                    title={t('bookSlot')}
                    showCount={false}
                    selectedRows={selectedSlots}
                    handleSaveUpdate={handleBookAppointment}
                />
            </Group>
        </div>
    );
}
