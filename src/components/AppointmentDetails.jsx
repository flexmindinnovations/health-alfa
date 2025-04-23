import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Avatar,
    Badge,
    Card,
    Divider,
    Group,
    Stack,
    Text,
    Title,
    Tooltip,
    useMantineTheme
} from "@mantine/core";
import { Mail, Smartphone, Calendar, Clock, User, MapPin, Stethoscope, GraduationCap, Star, Hash, FileText, Activity } from "lucide-react";
import dayjs from "dayjs";
import { utils } from "@config/utils.js";

export function AppointmentDetails({ data = {} }) {
    const theme = useMantineTheme();
    const { t } = useTranslation();
    const [profileImage, setProfileImage] = useState(null);
    const appointmentDetails = data;

    useEffect(() => {
        const imageEndpoint = appointmentDetails?.doctorProfileImagePath || appointmentDetails?.profileImagePath;
        const host = import.meta.env.VITE_API_URL;
        const imageUrl = imageEndpoint ? `${host}/${imageEndpoint}`?.replace('/api', '') : null;
        setProfileImage(imageUrl);
    }, [appointmentDetails]);

    const formatMobileNumber = (number) => {
        if (!number) return 'N/A';
        const cleanedNumber = number.replace(/\D/g, '');
        if (cleanedNumber.startsWith('91') && cleanedNumber.length === 12) {
            return `+91-${cleanedNumber.slice(2, 7)}-${cleanedNumber.slice(7)}`;
        }
        return number;
    };

    const stringFormatting = (inputString) => {
        if (!inputString) return 'N/A';
        inputString = inputString.trim();
        if (inputString.includes(',')) {
            const inputStringArray = inputString.split(',').map(input => input.trim()).filter(Boolean);
            if (inputStringArray.length > 1) {
                const lastString = inputStringArray.pop();
                return `${inputStringArray.join(', ')} ${t('and')} ${lastString}`;
            } else if (inputStringArray.length === 1) {
                return inputStringArray[0];
            }
        }
        return inputString || 'N/A';
    };

    const truncateText = (text, maxLength) => {
        if (!text || text.length <= maxLength) {
            return text || 'N/A';
        }
        return text.substring(0, maxLength) + '...';
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'booked': return 'blue';
            case 'completed': return 'green';
            case 'cancelled': return 'red';
            case 'pending': return 'yellow';
            default: return 'gray';
        }
    };

    return (
        <motion.div layout className="overflow-auto">
            <Card radius="md" py="lg" classNames={{root: `max-h-[450px]  !overflow-auto`}}>
                <Stack gap="lg">
                    <Group justify="flex-end">
                        <Badge
                            color={getStatusColor(appointmentDetails?.appointmentStatus)}
                            variant="light"
                            size="lg"
                        >
                            {appointmentDetails?.appointmentStatus || t('unknownStatus')}
                        </Badge>
                    </Group>
                    <Title order={4} mb="xs">{t('doctorDetails')}</Title>
                    <Group align={'flex-start'} gap="xl">
                        <Avatar size={"xl"} radius={"xl"} src={profileImage}>
                            {appointmentDetails?.doctorName?.charAt(0)}
                        </Avatar>
                        <Stack gap="xs" style={{ flex: 1 }}>
                            <Title order={5}>{appointmentDetails?.doctorName || t('notAvailable')}</Title>
                            <Group gap="sm">
                                <Smartphone size={16} opacity={0.7} />
                                <Text size="sm">{formatMobileNumber(appointmentDetails?.mobileNo)}</Text>
                            </Group>
                            {appointmentDetails?.emailId && (
                                <Group gap="sm">
                                    <Mail size={16} opacity={0.7} />
                                    <Text size="sm">{appointmentDetails?.emailId}</Text>
                                </Group>
                            )}
                            <Group gap="sm">
                                <MapPin size={16} opacity={0.7} />
                                <Text size="sm">{appointmentDetails?.doctorAddress || t('notAvailable')}</Text>
                            </Group>
                            <Group gap="sm">
                                <GraduationCap size={16} opacity={0.7} />
                                <Text size="sm">{stringFormatting(appointmentDetails?.qualification)}</Text>
                            </Group>
                            <Group gap="sm">
                                <Star size={16} opacity={0.7} />
                                <Tooltip label={stringFormatting(appointmentDetails?.speciality)} position="bottom-start">
                                    <Text size="sm" style={{ maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {appointmentDetails?.speciality}
                                    </Text>
                                </Tooltip>
                            </Group>
                            {appointmentDetails?.medicalRegistrationNumber && (
                                <Group gap="sm">
                                    <Hash size={16} opacity={0.7} />
                                    <Text size="sm">{t('registrationNo')}: {appointmentDetails.medicalRegistrationNumber}</Text>
                                </Group>
                            )}
                            {appointmentDetails?.medicalCouncil && (
                                <Group gap="sm">
                                    <Activity size={16} opacity={0.7} />
                                    <Text size="sm">{t('medicalCouncil')}: {appointmentDetails.medicalCouncil}</Text>
                                </Group>
                            )}
                        </Stack>
                    </Group>

                    <Divider />

                    {/* Patient Info Section */}
                    <Title order={4} mb="xs">{t('patientDetails')}</Title>
                    <Stack gap="sm">
                        <Group gap="sm">
                            <User size={16} opacity={0.7} />
                            <Text size="sm" fw={500}>{appointmentDetails?.patientName || t('notAvailable')}</Text>
                        </Group>
                        {appointmentDetails?.patientMobileNo && (
                            <Group gap="sm">
                                <Smartphone size={16} opacity={0.7} />
                                <Tooltip label={t('mobileNo')}>
                                    <Text size="sm">{formatMobileNumber(appointmentDetails.patientMobileNo)}</Text>
                                </Tooltip>
                            </Group>
                        )}
                        <Group gap="sm">
                            <Stethoscope size={16} opacity={0.7} />
                            <Tooltip label={t('gender')}>
                                <Text size="sm">{appointmentDetails?.gender || t('notAvailable')}</Text>
                            </Tooltip>
                        </Group>
                        <Group gap="sm">
                            <Calendar size={16} opacity={0.7} />
                            <Tooltip label={t('dob')}>
                                <Text size="sm">{appointmentDetails?.dateOfBirth ? dayjs(appointmentDetails.dateOfBirth).format("DD MMM YYYY") : t('notAvailable')}</Text>
                            </Tooltip>
                        </Group>
                    </Stack>

                    <Divider />

                    {/* Appointment Info Section */}
                    <Title order={4} mb="xs">{t('appointmentInfo')}</Title>
                    <Stack gap="sm">
                        <Group gap="sm">
                            <Calendar size={16} opacity={0.7} />
                            <Text size="sm">{t('date')}: {appointmentDetails?.appointmentDate ? dayjs(appointmentDetails.appointmentDate).format("ddd, DD MMM YYYY") : t('notAvailable')}</Text>
                        </Group>
                        <Group gap="sm">
                            <Clock size={16} opacity={0.7} />
                            <Text size="sm">{t('time')}: {appointmentDetails?.appointmentDate ? dayjs(appointmentDetails.appointmentDate).format("h:mm A") : t('notAvailable')}</Text>
                        </Group>
                        <Group gap="sm">
                            <Clock size={16} opacity={0.7} /> {/* Reusing Clock icon */}
                            <Text size="sm">{t('duration')}: {appointmentDetails?.durationInMinutes ? `${appointmentDetails.durationInMinutes} ${t('minutes')}` : t('notAvailable')}</Text>
                        </Group>
                        {appointmentDetails?.notes && (
                            <Group gap="sm" align="flex-start">
                                <FileText size={16} opacity={0.7} style={{ marginTop: '2px' }} />
                                <Group gap={2}>
                                    <Text size="sm" fw={500}>{t('notes')}:</Text>
                                    <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>{appointmentDetails.notes}</Text>
                                </Group>
                            </Group>
                        )}
                    </Stack>

                </Stack>
            </Card>
        </motion.div>
    );
}
