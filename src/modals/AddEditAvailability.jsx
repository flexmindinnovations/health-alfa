import {useEffect, useRef, useState} from "react";
import {z} from 'zod';
import {Controller, useFieldArray, useForm} from 'react-hook-form';
import {zodResolver} from "mantine-form-zod-resolver";
import {motion} from "framer-motion";
import {ActionIcon, Box, Button, CloseIcon, Group, Select, Stack, useMantineTheme} from '@mantine/core';
import {TimeInput} from '@mantine/dates';
import {Clock4Icon, Save, SquarePen, Trash2} from 'lucide-react';
import {useTranslation} from "react-i18next";
import {useApiConfig} from "@contexts/ApiConfigContext.jsx";
import useHttp from "@hooks/AxiosInstance.jsx";
import {openNotificationWithSound} from "@config/Notifications.js";

const schema = z.object({
    dayOfWeek: z.string().min(1, {message: 'Please select a day of week'}), slotList: z.array(z.object({
        slotType: z.string().min(1, {message: 'Select a shift name'}),
        startTime: z.string().min(1, {message: 'Select start time'}).regex(/^([0-9]{2}):([0-9]{2})$/, 'Start time must be in HH:mm format'),
        endTime: z.string().min(1, {message: 'Select end time'}).regex(/^([0-9]{2}):([0-9]{2})$/, 'End time must be in HH:mm format')
    })).nonempty({message: 'At least one shift is required'}),
});

export function AddEditAvailability({data, mode = 'add', handleCancel}) {
    const {t} = useTranslation();
    const [loading, setLoading] = useState(false);
    const {apiConfig} = useApiConfig();
    const http = useHttp();
    const fromRef = useRef([]);
    const toRef = useRef([]);
    const [selectedShifts, setSelectedShifts] = useState([]);
    const shiftsData = Array.isArray(data) ? data : [];
    const theme = useMantineTheme();

    const availableDays = [{label: t('sunday'), value: 'sunday'}, {
        label: t('monday'),
        value: 'monday'
    }, {label: t('tuesday'), value: 'tuesday'}, {label: t('wednesday'), value: 'wednesday'}, {
        label: t('thursday'),
        value: 'thursday'
    }, {label: t('friday'), value: 'friday'}, {label: t('saturday'), value: 'saturday'}];

    const shiftsMaster = [{label: t('morning'), value: 'morning', disabled: false}, {
        label: t('afternoon'),
        value: 'afternoon',
        disabled: false
    }, {label: t('evening'), value: 'evening', disabled: false}];

    const [availableShifts, setAvailableShifts] = useState(shiftsMaster);
    const {handleSubmit, watch, getValues, formState: {errors, isSubmitting}, control} = useForm({
        mode: 'onChange', defaultValues: {
            dayOfWeek: shiftsData?.[0]?.dayOfWeek.toLowerCase() || '', slotList: shiftsData?.map(item => ({
                dayOfWeek: item?.dayOfWeek || '',
                slotType: item.slotType.toLowerCase() || '',
                startTime: item.startTime || '',
                endTime: item.endTime || ''
            })) || [{dayOfWeek: '', slotType: '', startTime: '', endTime: ''}]
        }, resolver: zodResolver(schema),
    });

    const {fields, append, remove} = useFieldArray({
        control, name: 'slotList'
    });

    const selectedDay = watch('dayOfWeek');
    const slotList = watch('slotList');
    const shiftCount = watch('slotList').length;

    useEffect(() => {
        const shiftValues = getValues().slotList.map(item => item.slotType) || [];
        setAvailableShifts(prevShifts => prevShifts.map(shift => ({
            ...shift, disabled: shiftValues.includes(shift.value)
        })));
    }, [watch('slotList')]);

    const addShift = () => {
        append({dayOfWeek: '', slotType: '', startTime: '', endTime: ''});
        setAvailableShifts((prev) => prev.map((shift) => ({...shift, disabled: selectedShifts.includes(shift.value)})));
    };

    const removeShift = (index) => {
        const removedSlotType = getValues(`slotList.${index}.slotType`);
        setAvailableShifts((prev) => prev.map((shift) => (shift.value === removedSlotType ? {
            ...shift,
            disabled: false
        } : shift)));
        setSelectedShifts((prev) => prev.filter((shift) => shift !== removedSlotType));
        remove(index);
    };


    const handleShiftChange = (field, value, index) => {
        if (selectedShifts.includes(value)) return;

        setAvailableShifts(prev => prev.map((shift, idx) => idx === index ? {...shift, disabled: true} : shift));

        const previousValue = field.value;
        setSelectedShifts(prev => [...prev.filter(shift => shift !== previousValue), value]);
        field.onChange(value);
    };

    const onSubmit = (event) => {
        event.preventDefault();
        const values = getValues();
        const formData = {
            doctorId: data[0]?.doctorId || 2,
            doctorName: data[0]?.doctorName || '',
            dayOfWeek: values.dayOfWeek,
            slotList: values.slotList.map((shift, index) => ({
                doctorTimingId: shiftsData[index]?.doctorTimingId || 0,
                startTime: shift.startTime,
                endTime: shift.endTime,
                slotType: shift.slotType
            }))
        };
        saveUpdateTiming(formData);
    };

    const saveUpdateTiming = async (payload) => {
        setLoading(true);
        try {
            const response = mode === 'add' ? await http.post(apiConfig.doctors.saveDoctorAvailability, payload) : await http.put(apiConfig.doctors.updateDoctorAvailability, payload);
            if (response.status === 200) {
                const data = response.data;
                openNotificationWithSound({
                    title: t('success'), message: data.message, color: theme.colors.brand[6]
                }, {withSound: false})
            }
        } catch (error) {
            const {message} = error;
            openNotificationWithSound({
                title: t('error'), message: message, color: theme.colors.red[6]
            }, {withSound: false})
        } finally {
            setLoading(false);
            handleCancel({refresh: true});
        }
    }

    const isSaveEnabled = slotList.every(shift => shift.slotType && shift.startTime && shift.endTime);

    return (<motion.div initial={{opacity: 0, y: 50}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: 50}}>
            <Box mw={600} mx="auto">
                <form>
                    <Controller
                        name="dayOfWeek"
                        control={control}
                        render={({field}) => (<Select
                                label={t('selectDayOfWeek')}
                                placeholder={t('selectDayOfWeek')}
                                data={availableDays}
                                {...field}
                                mb="lg"
                            />)}
                    />
                    {selectedDay && (<Stack>
                            {fields.map((field, index) => (
                                <Group align="end" justify="space-between" key={field.id} gap={5}>
                                    <Controller
                                        control={control}
                                        name={`slotList.${index}.slotType`}
                                        render={({field}) => (<Select
                                                {...field}
                                                label={t('slotType')}
                                                data={availableShifts}
                                                value={getValues(`slotList.${index}.slotType`) || ''}
                                                onChange={(value) => handleShiftChange(field, value, index)}
                                                error={errors.slotList?.[index]?.slotType?.message}
                                            />)}
                                    />
                                    <Controller
                                        control={control}
                                        name={`slotList.${index}.startTime`}
                                        render={({field}) => (<TimeInput
                                                {...field}
                                                label={t('startTime')}
                                                withSeconds
                                                ref={(ref) => {
                                                    fromRef.current[index] = ref;
                                                }}
                                                rightSection={<ActionIcon variant="subtle" color="gray"
                                                                          onClick={() => fromRef.current[index]?.showPicker()}>
                                                    <Clock4Icon size={16}/>
                                                </ActionIcon>}
                                                error={errors.slotList?.[index]?.startTime?.message}
                                            />)}
                                    />
                                    <Controller
                                        control={control}
                                        name={`slotList.${index}.endTime`}
                                        render={({field}) => (<TimeInput
                                                {...field}
                                                withSeconds
                                                label={t('endTime')}
                                                ref={(ref) => {
                                                    toRef.current[index] = ref;
                                                }}
                                                rightSection={<ActionIcon variant="subtle" color="gray"
                                                                          onClick={() => toRef.current[index]?.showPicker()}>
                                                    <Clock4Icon size={16}/>
                                                </ActionIcon>}
                                                error={errors.slotList?.[index]?.endTime?.message}
                                            />)}
                                    />
                                    <Button color="red" leftSection={<Trash2 size={16}/>}
                                            onClick={() => removeShift(index)}>
                                        {t('remove')}
                                    </Button>
                                </Group>))}
                            {shiftCount < 3 && (
                                <Button mt="md" onClick={addShift} disabled={availableShifts.length === 0}>
                                    {t('addSlot')}
                                </Button>)}
                        </Stack>)}
                    <Group position="right" mt="xl" align="center" justify="end">
                        <Button variant="outline" leftSection={<CloseIcon size={16}/>}
                                onClick={() => handleCancel({refresh: false})}>
                            {t('cancel')}
                        </Button>
                        <Button
                            onClick={onSubmit}
                            disabled={!isSaveEnabled}
                            loading={isSubmitting || loading}
                            leftSection={mode === 'add' ? <Save size={16}/> : <SquarePen size={16}/>}
                        >
                            {mode === 'add' ? t('save') : t('update')}
                        </Button>
                    </Group>
                </form>
            </Box>
        </motion.div>);
}
