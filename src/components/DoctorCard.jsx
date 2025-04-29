import { Avatar, Badge, Card, CloseButton, Group, Loader, Stack, Text, Title, Tooltip } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Mail, Smartphone, Award, MapPin, User } from 'lucide-react';
import { motion } from "framer-motion";
import PropTypes from 'prop-types';

const formatListString = (inputString) => {
    if (!inputString || typeof inputString !== 'string') return '';
    const trimmedString = inputString.trim();
    if (trimmedString.includes(',')) {
        const items = trimmedString.split(',').map(item => item.trim()).filter(Boolean);
        if (items.length > 1) {
            const lastItem = items.pop();
            return `${items.join(', ')} and ${lastItem}`;
        }
        return items[0] || '';
    }
    return trimmedString;
};

const formatMobileNumber = (number) => {
    if (!number || typeof number !== 'string') return '';
    const cleanedNumber = number.replace(/\D/g, '');
    if (cleanedNumber.startsWith('91') && cleanedNumber.length === 12) {
        return `+91 ${cleanedNumber.slice(2, 7)} ${cleanedNumber.slice(7)}`;
    }
    return number;
};

const defaultGetStatusColor = (status) => {
    switch (status?.toLowerCase()) {
        case 'booked': return 'blue';
        case 'completed': return 'green';
        case 'cancelled': return 'red';
        case 'pending': return 'yellow';
        default: return 'gray';
    }
};

export function DoctorCard({
    data = {},
    loading = false,
    handleCloseModal,
    isDetailsCard = false,
    onClick,
    layoutId,
    border = true,
    showAddress = true,
    showGender = true,
    getStatusColor = defaultGetStatusColor,
}) {
    const [profileImage, setProfileImage] = useState(null);
    const { t } = useTranslation();
    const cardRef = useRef(null);
    const { appointmentStatus } = data;

    useEffect(() => {
        const imageEndpoint = data?.doctorProfileImagePath;
        if (imageEndpoint) {
            const host = import.meta.env.VITE_API_URL || '';
            const imageUrl = new URL(imageEndpoint.startsWith('/') ? imageEndpoint.substring(1) : imageEndpoint, host).href;
            setProfileImage(imageUrl);
        } else {
            setProfileImage(null);
        }
    }, [data?.doctorProfileImagePath]);

    const handleClick = (event) => {
        if (event.target.closest('.mantine-CloseButton') || event.target.closest('.status-badge')) {
            return;
        }
        if (onClick && typeof onClick === 'function' && cardRef.current) {
            const rect = cardRef.current.getBoundingClientRect();
            onClick(data, rect);
        }
    };

    const truncateText = (text, maxLength = 40) => {
        if (!text || typeof text !== 'string') return '';
        return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
    };

    const formattedQualification = formatListString(data?.qualification);
    const formattedSpeciality = formatListString(data?.speciality);
    const truncatedSpeciality = truncateText(formattedSpeciality);

    if (loading) {
        return <Loader />;
    }

    return (
        <motion.div
            ref={cardRef}
            whileTap={!isDetailsCard ? { scale: 0.98, y: 2 } : {}}
            className={`relative w-full ${!isDetailsCard ? 'cursor-pointer' : ''} overflow-hidden rounded-lg`}
            onClick={!isDetailsCard ? handleClick : undefined}
            style={{ WebkitTapHighlightColor: 'transparent' }}
        >
            {isDetailsCard && handleCloseModal && (
                <CloseButton
                    onClick={(e) => {
                        e.stopPropagation();
                        handleCloseModal();
                    }}
                    aria-label={t('closeDetails')}
                    className="!absolute !top-2 !right-2 text-gray-500 hover:text-gray-700 z-30 bg-white rounded-full shadow-sm"
                />
            )}

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
                    <Text size="xs">
                        {t(appointmentStatus.toLowerCase()) || appointmentStatus}
                    </Text>
                </Badge>
            )}

            <Card shadow={isDetailsCard ? "md" : "sm"} withBorder={border} padding="lg" radius="xl">
                <Stack gap="md">
                    <Group wrap="nowrap" align="flex-start" gap="lg">
                        <Avatar
                            size={isDetailsCard ? "xl" : "lg"}
                            radius="xl"
                            src={profileImage}
                            alt={`${data?.doctorName || 'Doctor'}'s profile picture`}
                        />
                        <Stack gap={2} style={{ flex: 1 }}>
                            <Title order={4} lineClamp={1}>Dr. {data?.doctorName || t('notAvailable')}</Title>
                            <Tooltip
                                label={formattedSpeciality}
                                disabled={formattedSpeciality.length <= 40}
                                multiline
                                w={220}
                                withArrow
                            >
                                <Text size="sm" c="dimmed" lineClamp={1}>
                                    {truncatedSpeciality || t('noSpeciality')}
                                </Text>
                            </Tooltip>
                        </Stack>
                    </Group>

                    <Stack gap="xs">
                        {formattedQualification && (
                            <Group wrap="nowrap" gap="xs">
                                <Award size={16} strokeWidth={1.5} style={{ flexShrink: 0 }} />
                                <Text size="xs" lineClamp={isDetailsCard ? undefined : 1}>
                                    {formattedQualification}
                                </Text>
                            </Group>
                        )}
                        {data?.mobileNo && (
                            <Group wrap="nowrap" gap="xs">
                                <Smartphone size={16} strokeWidth={1.5} style={{ flexShrink: 0 }} />
                                <Text size="xs" component="a" href={`tel:${data.mobileNo.replace(/\D/g, '')}`}>
                                    {formatMobileNumber(data.mobileNo)}
                                </Text>
                            </Group>
                        )}
                        {data?.emailId && (
                            <Group wrap="nowrap" gap="xs">
                                <Mail size={16} strokeWidth={1.5} style={{ flexShrink: 0 }} />
                                <Text size="xs" component="a" href={`mailto:${data.emailId}`} lineClamp={1}>
                                    {data.emailId}
                                </Text>
                            </Group>
                        )}
                        {showGender && data?.gender && (
                            <Group wrap="nowrap" gap="xs">
                                <User size={16} strokeWidth={1.5} style={{ flexShrink: 0 }} />
                                <Text size="xs">{data.gender}</Text>
                            </Group>
                        )}
                        {showAddress && data?.doctorAddress && (
                            <Group wrap="nowrap" gap="xs" align="flex-start">
                                <MapPin size={16} strokeWidth={1.5} style={{ flexShrink: 0, marginTop: '2px' }} />
                                <Text size="xs" lineClamp={isDetailsCard ? undefined : 2}>
                                    {data.doctorAddress}
                                </Text>
                            </Group>
                        )}
                    </Stack>
                </Stack>
            </Card>
        </motion.div>
    );
}

DoctorCard.propTypes = {
    data: PropTypes.shape({
        doctorProfileImagePath: PropTypes.string,
        doctorName: PropTypes.string,
        speciality: PropTypes.string,
        qualification: PropTypes.string,
        mobileNo: PropTypes.string,
        emailId: PropTypes.string,
        gender: PropTypes.string,
        doctorAddress: PropTypes.string,
        appointmentStatus: PropTypes.string,
    }),
    loading: PropTypes.bool,
    handleCloseModal: PropTypes.func,
    isDetailsCard: PropTypes.bool,
    onClick: PropTypes.func,
    layoutId: PropTypes.string,
    border: PropTypes.bool,
    showAddress: PropTypes.bool,
    showGender: PropTypes.bool,
    getStatusColor: PropTypes.func,
};
