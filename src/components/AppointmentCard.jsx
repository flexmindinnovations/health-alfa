import { Card, CloseButton, Group, Loader, Stack, Text, Title, Tooltip, useMantineTheme, ActionIcon } from "@mantine/core";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { Info, XCircle } from "lucide-react";
import { utils } from "@config/utils";

export function AppointmentCard({
    data = {},
    loading = false,
    handleCloseModal,
    isDetailsCard = false,
    onClick,
    layoutId,
} = {}) {

    const [profileImage, setProfileImage] = useState(null);
    const { t } = useTranslation();
    const cardRef = useRef(null);
    const [isOpen, setIsOpen] = useState(handleCloseModal);
    const theme = useMantineTheme();

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
                            {data?.appointmentStatus && (
                                <div
                                    className={`absolute top-0 right-0 z-10 flex rounded-tr-2xl rounded-bl-2xl min-h-10 pl-2 ${data?.appointmentStatus === 'Booked'
                                        ? 'bg-blue-100 text-blue-800'
                                        : data?.appointmentStatus === 'Completed'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                        }`}
                                >
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
                                    <motion.div
                                        className={`px-3 py-1 text-xs flex items-center justify-center font-semibold rounded-tr-full rounded-bl-full shadow-none ${data?.appointmentStatus === 'Booked'
                                            ? 'bg-blue-100 text-blue-800'
                                            : data?.appointmentStatus === 'Completed'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                            }`}
                                    >
                                        <Text size="sm" fw={'bold'}>
                                            {data?.appointmentStatus}
                                        </Text>
                                    </motion.div>
                                </div>
                            )}
                            {isDetailsCard && <CloseButton
                                onClick={handleCloseModal}
                                className="!absolute !top-2 !right-2 text-gray-500 hover:text-gray-700"
                            />}
                            <Card shadow={"lg"} withBorder className="!relative">
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
                                        <Card
                                            px={10}
                                            py={5}
                                            withBorder
                                            shadow={"lg"}
                                            bg={data?.appointmentStatus === 'Pending' ? 'yellow' : 'green'}
                                            className={`!absolute top-0 right-0`}
                                        >
                                            <Text
                                                fw={"bold"}
                                                size={'xs'}
                                                c={data?.appointmentStatus === 'Pending' ? 'yellow' : 'white'}
                                            >
                                                {data?.appointmentStatus}
                                            </Text>
                                        </Card>
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