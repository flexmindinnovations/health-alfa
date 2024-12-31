import {Card, CloseButton, Group, Loader, Stack, Text, Title, Tooltip, useMantineTheme} from "@mantine/core";
import {motion} from "framer-motion";
import {useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import dayjs from "dayjs";
import {Info} from "lucide-react";

export function AppointmentCard({
                                    data = {},
                                    loading = false,
                                    handleCloseModal,
                                    isDetailsCard = false,
                                    onClick,
                                    layoutId,
                                } = {}) {

    const [profileImage, setProfileImage] = useState(null);
    const {t} = useTranslation();
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
                        <Loader/>) :
                    (
                        <motion.div
                            ref={cardRef}
                            className={`p-0 relative cursor-pointer }`}
                            onClick={handleClick}
                        >
                            {isDetailsCard && <CloseButton
                                onClick={handleCloseModal}
                                className="!absolute !top-2 !right-2 text-gray-500 hover:text-gray-700"
                            />}
                            <Card shadow={"lg"} withBorder>
                                <Stack>
                                    <Group align={'center'} justify={'space-between'} gap={40}>
                                        <Title size={'md'} className={`flex items-center justify-center gap-0.5`}>
                                            <Tooltip label={t('patientName')}>
                                                <Info size={16}
                                                      color={theme.colorScheme === 'dark' ? 'gray' : theme.colors.brand[6]}/>
                                            </Tooltip> &nbsp;
                                            {data?.patientName}
                                        </Title>
                                        <Card
                                            px={10}
                                            py={5}
                                            radius={"xl"}
                                            withBorder
                                            shadow={"lg"}
                                            bg={data?.appointmentStatus === 'Pending' ? 'yellow' : 'green'}
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