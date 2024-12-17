import { useState, useEffect } from 'react';
import { useForm } from '@mantine/form';
import { TextInput, Button, Group, Box, Select, Grid, Textarea, MultiSelect, ScrollArea, Stack, CloseIcon } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { zodResolver } from 'mantine-form-zod-resolver';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { SquarePen, Save, X } from 'lucide-react';
import { ImagePicker } from '@components/ImagePicker';
import { useApiConfig } from '@contexts/ApiConfigContext';
import useHttp from '@hooks/axios-instance';
import { openNotificationWithSound } from '@config/Notifications';
import { useTranslation } from 'react-i18next';
import degreeMaster from '../assets/data/degree-master.json';

const genderOptions = [
    { title: 'Male', value: 'Male' },
    { title: 'Female', value: 'Female' },
    { title: 'Other', value: 'Other' },
];

const mappedDegrees = degreeMaster.map(({ degree }) => ({ value: degree, label: degree }));

const normalizeField = (field) =>
    Array.isArray(field)
        ? field
        : typeof field === 'string' && field.includes(',')
            ? field.split(',').map((item) => item.trim())
            : [field];

const doctorSchema = z.object({
    doctorId: z.number().optional(),
    doctorName: z.string().min(1, 'Doctor name is required'),
    mobileNo: z.string().optional(),
    dateOfBirth: z.date({ required_error: 'Date of birth is required' }),
    gender: z
        .string()
        .optional()
        .refine((value) => genderOptions.some(({ value: v }) => v === value), 'Gender is required'),
    qualification: z.array(z.string()).nonempty('At least one qualification is required'),
    speciality: z.array(z.string()).optional(),
    medicalRegistrationNumber: z.string().optional(),
    medicalCouncil: z.string().optional(),
    registerDate: z.date({ required_error: 'Registration date is required' }),
    emailId: z.string().optional(),
    doctorAddress: z.string().optional(),
    doctorProfileImagePath: z
        .any()
        .refine((file) => file instanceof File || typeof file === 'string', 'Invalid file type')
        .optional(),
});

export function AddEditDoctor({ data = {}, mode = 'add', handleCancel }) {
    const [profileImage, setProfileImage] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [specialtyOptions, setSpecialtyOptions] = useState([]);
    const { i18n, t } = useTranslation();
    const { apiConfig } = useApiConfig();
    const http = useHttp();
    const [disableForm, setDisableForm] = useState(false);

    const form = useForm({
        initialValues: {
            doctorId: data?.doctorId || 0,
            doctorName: data?.doctorName || '',
            doctorAddress: data?.doctorAddress || '',
            mobileNo: data?.mobileNo || '',
            dateOfBirth: data?.dateOfBirth ? new Date(data.dateOfBirth) : new Date(),
            gender: data?.gender || '',
            qualification: normalizeField(data?.qualification),
            speciality: normalizeField(data?.speciality),
            medicalRegistrationNumber: data?.medicalRegistrationNumber || '',
            medicalCouncil: data?.medicalCouncil || '',
            registerDate: data?.registerDate ? new Date(data.registerDate) : new Date(),
            emailId: data?.emailId || '',
            doctorProfileImagePath: data?.doctorProfileImagePath || '',
        },
        enhanceGetInputProps: () => ({ disabled: disableForm }),
        validateInputOnBlur: true,
        validateInputOnChange: true,
        validate: zodResolver(doctorSchema),
    });

    useEffect(() => {
        if (form.values.qualification.length > 0) {
            const specialties = degreeMaster
                .filter(({ degree }) => form.values.qualification.includes(degree))
                .flatMap(({ specialities }) => specialities)
                .filter((value, index, self) => self.indexOf(value) === index);
            setSpecialtyOptions(specialties.map((specialty) => ({ value: specialty, label: specialty })));
        }
    }, [form.values.qualification]);

    const handleSubmit = async (values) => {
        setLoading(true);
        const payload = {
            ...values,
            qualification: values.qualification.join(','),
            speciality: values.speciality.join(','),
        };

        const apiCalls = [
            values.doctorId
                ? http.put(apiConfig.doctors.update(values.doctorId), payload)
                : http.post(apiConfig.doctors.save, payload),
        ];

        if (profileImage) {
            const formData = new FormData();
            formData.append('file', profileImage);
            apiCalls.push(
                http.post(apiConfig.doctors.updateDoctorImage(values.doctorId), formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    onUploadProgress: ({ loaded, total }) => {
                        const progress = Math.round((loaded * 100) / total);
                        setImageUploadProgress(progress);
                        setIsUploading(progress > 0 && progress < 100);
                    },
                })
            );
        }

        try {
            const responses = await Promise.allSettled(apiCalls);
            const [saveResponse, imageResponse] = responses;

            if (saveResponse.status === 'fulfilled' && saveResponse.value.status === 200) {
                openNotificationWithSound({
                    title: t('updateSuccessfull'),
                    message: saveResponse.value.data.message,
                });
            }

            if (imageResponse?.status === 'fulfilled' && imageResponse.value.status === 200) {
                openNotificationWithSound({
                    title: t('profileImageUpdateSuccessfull'),
                    message: imageResponse.value.data.message,
                });
            }
        } catch (error) {
            openNotificationWithSound({
                title: error.name,
                message: error.message,
                color: 'red',
            });
        } finally {
            setLoading(false);
            handleCancel({ refresh: true });
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}>
            <Box sx={{ maxWidth: 900, margin: '0 auto' }}>
                <motion.form onSubmit={form.onSubmit(handleSubmit)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <Stack>
                        <ScrollArea scrollbars={'y'}>
                            <Stack className="flex-1 max-h-[30rem] mx-auto">
                                <Grid
                                    gutter="md"
                                >
                                    <Grid.Col span={{ base: 12, md: 4, lg: 4 }} className="flex items-center justify-center">
                                        <ImagePicker
                                            disableForm={loading}
                                            value={form.values.doctorProfileImagePath}
                                            uploadProgress={imageUploadProgress}
                                            isUploading={isUploading}
                                            onChange={setProfileImage}
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={{ base: 12, md: 8, lg: 8 }}>
                                        <Grid gutter="md">
                                            <Grid.Col span={6}>
                                                <TextInput label="Doctor Name" placeholder="Enter doctor name" {...form.getInputProps('doctorName')} />
                                            </Grid.Col>
                                            <Grid.Col span={6}>
                                                <TextInput label="Mobile Number" placeholder="Enter mobile number" {...form.getInputProps('mobileNo')} disabled />
                                            </Grid.Col>
                                            <Grid.Col span={6}>
                                                <DateInput label="Date of Birth" placeholder="Select date" {...form.getInputProps('dateOfBirth')} />
                                            </Grid.Col>
                                            <Grid.Col span={6}>
                                                <Select
                                                    label="Gender"
                                                    searchable
                                                    placeholder="Select gender"
                                                    data={['Male', 'Female', 'Other']}
                                                    {...form.getInputProps('gender')}
                                                />
                                            </Grid.Col>
                                        </Grid>
                                    </Grid.Col>
                                </Grid>

                                <Grid mt={5} gutter="md">
                                    <Grid.Col span={6}>
                                        <MultiSelect
                                            label="Qualification"
                                            placeholder="Select degree(s)"
                                            data={mappedDegrees}
                                            value={form.values.qualification}
                                            onChange={(selected) => form.setFieldValue('qualification', selected)}
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={6}>
                                        <MultiSelect
                                            label="Speciality"
                                            placeholder="Select specialty"
                                            data={specialtyOptions}
                                            {...form.getInputProps('speciality')}
                                        />
                                    </Grid.Col>
                                </Grid>

                                <Grid mt={5} gutter="md">
                                    <Grid.Col span={6}>
                                        <TextInput label="Medical Registration Number" placeholder="Enter registration number" {...form.getInputProps('medicalRegistrationNumber')} />
                                    </Grid.Col>
                                    <Grid.Col span={6}>
                                        <TextInput label="Medical Council" placeholder="Enter medical council" {...form.getInputProps('medicalCouncil')} />
                                    </Grid.Col>
                                </Grid>

                                <Grid mt={5} gutter="md">
                                    <Grid.Col span={6}>
                                        <DateInput label="Register Date" placeholder="Pick date" {...form.getInputProps('registerDate')} />
                                    </Grid.Col>
                                    <Grid.Col span={6}>
                                        <TextInput label="Email ID" placeholder="Enter email address" {...form.getInputProps('emailId')} />
                                    </Grid.Col>
                                </Grid>

                                <Grid mt="md">
                                    <Grid.Col span={12}>
                                        <Textarea
                                            rows={3}
                                            label="Address"
                                            placeholder="Enter address"
                                            {...form.getInputProps('doctorAddress')}
                                        />
                                    </Grid.Col>
                                </Grid>
                            </Stack>
                        </ScrollArea>
                        <Group position="right" justify='flex-end'>
                            <Button
                                disabled={disableForm}
                                leftSection={<CloseIcon size={16} />}
                                variant="outline"
                                onClick={() => handleCancel({ refresh: false })}>
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                loading={loading}
                                className='min-w-24'
                                leftSection={
                                    mode === 'add' ? <Save size={16} /> : <SquarePen size={16} />
                                }
                            >
                                {mode === 'add' ? 'Save' : 'Update'}
                            </Button>
                        </Group>
                    </Stack>
                </motion.form>
            </Box>
        </motion.div>
    );
}
