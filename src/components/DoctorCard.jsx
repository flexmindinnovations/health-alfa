import { Avatar, Card, CloseButton, Group, Loader, Stack, Text, Title, Tooltip, ActionIcon } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Mail, Smartphone, CalendarClock, XCircle } from 'lucide-react';
import { motion } from "framer-motion";

export function DoctorCard({
    data = {},
    loading = false,
    handleCloseModal,
    isDetailsCard = false,
    truncateTextLength = true,
    onClick,
    layoutId,
    border = true
} = {}) {
    const [profileImage, setProfileImage] = useState(null);
    const { t } = useTranslation();
    const cardRef = useRef(null);
    const [isOpen, setIsOpen] = useState(handleCloseModal);

    useEffect(() => {
        const imageEndpoint = data?.doctorProfileImagePath;
        const host = import.meta.env.VITE_API_URL;
        const imageUrl = `${host}/${imageEndpoint}`?.replace('/api', '');
        if (imageEndpoint && imageUrl) setProfileImage(imageUrl);
    }, [data]);

    const formatMobileNumber = (number) => {
        const cleanedNumber = number?.replace(/\D/g, '');
        if (cleanedNumber?.startsWith('91') && cleanedNumber.length === 12) {
            return `+91-${cleanedNumber.slice(2)}`;
        }
        return number;
    };

    const stringFormatting = (inputString) => {
        inputString = inputString?.trim() || [];
        if (inputString.includes(',')) {
            const inputStringArray = inputString.split(',').map(input => input.trim());
            if (inputStringArray.length > 1) {
                const lastString = inputStringArray.pop();
                return `${inputStringArray.join(', ')} and ${lastString}`;
            }
        }
        return inputString;
    };

    const handleClick = () => {
        if (cardRef.current) {
            const rect = cardRef.current.getBoundingClientRect();
            onClick(data, rect);
            setIsOpen(true);
        }
    };

    const truncateText = (text, maxLength) => {
        if (text.length <= maxLength) {
            return text;
        }
        return truncateTextLength ? text.substring(0, maxLength) + '...' : text;
    }

    return (
        <>
            {
                loading ?
                    (
                        <Loader />) :
                    (
                        <motion.div
                            ref={cardRef}
                            whileTap={{ y: 5 }}
                            className={`p-0 relative w-full cursor-pointer overflow-auto rounded-2xl`}
                            onClick={handleClick}
                        >
                            {data?.appointmentStatus && (
                                <div
                                    className={`absolute top-0 right-0 z-10 flex rounded-bl-2xl min-h-10 pl-2 ${data?.appointmentStatus === 'Booked'
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
                                        className={`px-3 py-1 text-xs flex items-center justify-center font-semibold rounded-bl-full shadow-none ${data?.appointmentStatus === 'Booked'
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
                            {isDetailsCard && (
                                <CloseButton
                                    onClick={handleCloseModal}
                                    className="!absolute !top-2 !right-2 text-gray-500 hover:text-gray-700 z-20"
                                />
                            )}

                            <Card shadow={"none"} withBorder={border}>
                                <Stack>
                                    <Group align={'center'} justify={'start'} gap={40}>
                                        <Avatar size={"lg"} radius={"xl"} src={profileImage} />
                                        <Stack gap={5}>
                                            <Title size={'md'}>{data?.doctorName}</Title>
                                            <Stack>
                                                <Group gap={0}>
                                                    <Smartphone size={14} />:&nbsp;
                                                    <Text size={"sm"}>{formatMobileNumber(data?.mobileNo)}</Text>
                                                </Group>
                                                {data?.emailId && (
                                                    <Group>
                                                        <Mail size={14} />:&nbsp;
                                                        <Text size={"sm"}>{data?.emailId}</Text>
                                                    </Group>
                                                )}
                                            </Stack>
                                        </Stack>
                                    </Group>
                                    <Stack gap={5}>
                                        <Group gap={10}>
                                            <Text size={"xs"}>{t('gender')}:</Text>
                                            <Text size={"xs"}>{data?.gender}</Text>
                                        </Group>
                                        <Group gap={10}>
                                            <Text size={"xs"}>{t('qualification')}:</Text>
                                            <Text size={"xs"}>{stringFormatting(data?.qualification)}</Text>
                                        </Group>
                                        <Group gap={10}>
                                            <Text size={"xs"}>{t('speciality')}:</Text>
                                            <Tooltip label={stringFormatting(data?.speciality)}>
                                                <Text size={"xs"}>
                                                    {truncateText(stringFormatting(data?.speciality), 40)}
                                                </Text>
                                            </Tooltip>
                                        </Group>
                                        <Group gap={10}>
                                            <Text size={"xs"}>{t('address')}:</Text>
                                            <Text size={"xs"}>{data?.doctorAddress}</Text>
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