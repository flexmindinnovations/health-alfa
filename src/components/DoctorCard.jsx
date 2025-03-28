import {Avatar, Card, CloseButton, Group, Loader, Stack, Text, Title, Tooltip} from "@mantine/core";
import {useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {Mail, Smartphone} from 'lucide-react';
import {motion} from "framer-motion";

export function DoctorCard({
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
        return text.substring(0, maxLength) + '...';
    }

    return (
        <>
            {
                loading ?
                    (
                        <Loader/>) :
                    (
                        <motion.div
                            layout
                            ref={cardRef}
                            whileTap={{y: 5}}
                            className={`p-0 relative w-full cursor-pointer overflow-auto rounded-2xl`}
                            onClick={handleClick}
                        >
                            {isDetailsCard && <CloseButton
                                onClick={handleCloseModal}
                                className="!absolute !top-2 !right-2 text-gray-500 hover:text-gray-700"
                            />}
                            <Card shadow={"none"} withBorder>
                                <Stack>
                                    <Group align={'center'} justify={'start'} gap={40}>
                                        <Avatar size={"lg"} radius={"xl"} src={profileImage}/>
                                        <Stack gap={5}>
                                            <Title size={'md'}>{data?.doctorName}</Title>
                                            <Stack>
                                                <Group gap={0}>
                                                    <Smartphone size={14}/>:&nbsp;
                                                    <Text size={"sm"}>{formatMobileNumber(data?.mobileNo)}</Text>
                                                </Group>
                                                {
                                                    data?.emailId &&
                                                    <Group>
                                                        <Mail size={14}/>:&nbsp;
                                                        <Text size={"sm"}>{data?.emailId}</Text>
                                                    </Group>
                                                }
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
                                                <Text
                                                    size={"xs"}>{truncateText(stringFormatting(data?.speciality), 40)}</Text>
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