import { Card, CloseButton, Group, Loader, Stack, Text, Title, Tooltip, useMantineTheme, ActionIcon, Badge } from "@mantine/core";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { Info, XCircle } from "lucide-react";
import { utils } from "@config/utils";

const defaultGetStatusColor = (status) => {
    switch (status?.toLowerCase()) {
        case 'booked': return 'blue';
        case 'completed': return 'green';
        case 'cancelled': return 'red';
        case 'pending': return 'yellow';
        default: return 'gray';
    }
};

export function AppointmentCard({
    data = {},
    loading = false,
    handleCloseModal,
    isDetailsCard = false,
    onClick,
    layoutId,
    getStatusColor = defaultGetStatusColor,
} = {}) {

    const [profileImage, setProfileImage] = useState(null);
    const { t } = useTranslation();
    const cardRef = useRef(null);
    const [isOpen, setIsOpen] = useState(handleCloseModal);
    const theme = useMantineTheme();
    const { appointmentStatus } = data;

    const handleClick = () => {
        if (cardRef.current) {
            const rect = cardRef.current.getBoundingClientRect();
            onClick(data, rect);
            setIsOpen(true);
        }
    };

    return (
        <>
            {
                loading ?
                    (
                        <Loader />) :
                    (
                        <motion.div
                            ref={cardRef}
                            className={`p-0 relative cursor-pointer appointment-card`}
                            onClick={handleClick}
                        >
                            {appointmentStatus && (
                                <Badge
                                    color={getStatusColor(appointmentStatus)}
                                    variant="light"
                                    size="lg"
                                    radius={"xl"}
                                    className="!absolute !top-1 !right-1 z-20 
                                    !rounded-tr-full !rounded-bl-full
                                    items-center justify-center"
                                    style={{ display: isDetailsCard ? 'none' : 'flex' }}
                                >
                                    <motion.div className={`flex items-center justify-center gap-2.5 bg-[${getStatusColor(appointmentStatus)}]`}>
                                        <motion.div>
                                            {data?.appointmentStatus === 'Booked' && (
                                                <div className="py-1 flex gap-2">
                                                    {/* <Tooltip label={t('reschedule')}>
                                                    <ActionIcon
                                                        variant="transparent"
                                                        color="blue"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            console.log("Reschedule clicked");
                                                        }}
                                                    >
                                                        <CalendarClock size={22} />
                                                    </ActionIcon>
                                                </Tooltip> */}
                                                    <Tooltip label={t('cancelAppointment')}>
                                                        <ActionIcon
                                                            size={"xs"}
                                                            variant="transparent"
                                                            color="red"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                console.log("Cancel clicked");
                                                            }}
                                                        >
                                                            <XCircle size={22} />
                                                        </ActionIcon>
                                                    </Tooltip>
                                                </div>
                                            )}
                                        </motion.div>
                                        <Text size="xs">
                                            {t(appointmentStatus.toLowerCase()) || appointmentStatus}
                                        </Text>
                                    </motion.div>
                                </Badge>
                            )}
                            {isDetailsCard && <CloseButton
                                onClick={handleCloseModal}
                                className="!absolute !top-2 !right-2 text-gray-500 hover:text-gray-700"
                            />}
                            <Card radius={"xl"} shadow={"lg"} withBorder className="!relative">
                                <Stack>
                                    <Group align={'center'} justify={'space-between'} gap={40}>
                                        <Title size={'md'} className={`flex items-center justify-center gap-0.5`}>
                                            <Tooltip label={t('patientName')}>
                                                <Info size={16}
                                                    color={theme.colorScheme === 'dark' ? 'gray' : theme.colors.brand[9]} />
                                            </Tooltip> &nbsp;
                                            <Tooltip label={data?.patientName}>
                                                <p>
                                                    {utils.truncateText(data?.patientName, 12)}
                                                </p>
                                            </Tooltip>
                                        </Title>
                                    </Group>
                                    <Stack gap={5}>
                                        <Group gap={10}>
                                            <Text
                                                size={'xs'}
                                            > {t('doctorName')}: &nbsp;{data?.doctorName} </Text>
                                        </Group>
                                        <Group gap={10}>
                                            <Text
                                                size={"xs"}>{t('appointmentDate')}:&nbsp; {dayjs(data?.appointmentDate).format("YYYY-MM-DD")}</Text>
                                        </Group>
                                        <Group gap={10}>
                                            <Text
                                                size={"xs"}>{t('appointmentTime')}:&nbsp; {dayjs(data?.appointmentDate).format("h:mm A")}</Text>
                                        </Group>
                                        <Group gap={10}>
                                            <Text
                                                size={"xs"}>{t('appointmentDuration')}:&nbsp; {data?.durationInMinutes} {t('minutes')}</Text>
                                        </Group>
                                    </Stack>
                                </Stack>
                            </Card>
                        </motion.div>
                    )
            }
        </>
    )
}