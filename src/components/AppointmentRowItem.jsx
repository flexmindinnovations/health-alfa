import React from 'react'
import { Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState, useRef } from "react";
import {
    ActionIcon,
    Button,
    Container,
    Divider,
    Group,
    Select,
    Skeleton,
    Stack,
    Text,
    Tooltip,
    TextInput,
    Loader,
    useMantineTheme,
    Combobox, InputBase, useCombobox
} from "@mantine/core";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import useHttp from "@hooks/AxiosInstance.jsx";
import { useApiConfig } from '@contexts/ApiConfigContext.jsx'
import { debounce } from 'lodash';
import { openNotificationWithSound } from "@config/Notifications.js";

const pageNumber = 1;
const pageSize = 10;

export function AppointmentRowItem({
    state = null,
    showDelete = false,
    index = 0,
    handleInputChange,
    selectedMedicines = [],
    removeMedicine
}) {

    const { t } = useTranslation();
    const { get } = useHttp();
    const { apiConfig } = useApiConfig();
    const [medicineTypeList, setMedicineTypeList] = useState([]);
    const [medicineTypeListLoading, setMedicineTypeListLoading] = useState(true);
    const [medicineSearch, setMedicineSearch] = useState({});
    const [medicineOptions, setMedicineOptions] = useState({});
    const [loading, setLoading] = useState(false);
    const [localSearch, setLocalSearch] = useState('');
    const theme = useMantineTheme();
    const combobox = useCombobox();
    const [selectedMedicine, setSelectedMedicine] = useState('');
    // const [selectedMedicineType, setSelectedMedicineType] = useState(null);
    const selectedMedicineType = useRef(null);
    const [searchValue, setSearchValue] = useState('');
    const [formValue, setFormValue] = useState({ medicineId: '', frequency: '', dosage: '' });
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        if (state) getMedicineTypes();
    }, [state]);

    const getMedicineTypes = async () => {
        try {
            const response = await get(apiConfig.medicineType.getList);

            if (response?.status === 200) {
                const formattedData = response?.data.map((item) => ({
                    value: String(item.medicineTypeId),
                    label: item.medicineTypeName,
                }));
                const typeList = [{ label: "All", value: "all" }, ...formattedData]
                setMedicineTypeList(typeList);
            }
        } catch (err) {
            setTypeList([{ label: "All", value: "all" }]);
            openNotificationWithSound({ title: "Error", message: err.message, color: theme.colors.red[6] });
        } finally {
            setMedicineTypeListLoading(false);
        }
    }

    const handleMedicineTypeChange = (value) => {
        selectedMedicineType.current = value;
        getMedicineList({ value });
    }

    const getMedicineList = async ({ type = selectedMedicineType.current, query = '' }) => {
        setLoading(true);
        setIsSearching(true);
        try {
            const response = type === 'all' ? await get(apiConfig.medicine.getList(pageNumber, pageSize, query)) : await get(apiConfig.medicine.getMedicineListByType(type, pageNumber, pageSize, query));

            if (response?.status === 200) {
                const formattedData = response.data.map((item) => ({
                    value: String(item.medicineId),
                    label: item.medicineName,
                }));
                setMedicineOptions(formattedData);
            }
        } catch (err) {
            openNotificationWithSound({ title: "Error", message: err.message, color: theme.colors.red[6] });
        } finally {
            setLoading(false);
            setIsSearching(false);
        }
    };

    useEffect(() => {
        handleInputChange(formValue);
    }, [formValue]);

    const handleMedicineSearch = useCallback(
        debounce(async (query) => {
            if (!query || query.length < 3) return;
            getMedicineList({ query });
        }, 500), []);

    const onInputChange = (name, value) => {
        setFormValue(prev => ({
            ...prev,
            [name]: value
        }))
    }
    if (medicineTypeListLoading) {
        return (
            <Group className={`!w-full flex-1 !items-start`}>
                <Skeleton className={`flex-1`} visible height={60} width={205} />
                <Skeleton className={`flex-1`} visible height={60} width={205} />
                <Skeleton className={`flex-1`} visible height={60} width={205} />
                <Skeleton className={`flex-1`} visible height={60} width={205} />
                <Skeleton visible height={60} width={40} />
            </Group>
        );
    }

    return (
        <Group m={0} mah={80} className={`!w-full flex-1 !items-start`}>
            <Select
                label={t('medicineType')}
                placeholder={t('searchValue')}
                data={medicineTypeList}
                className={`flex-1`}
                disabled={medicineTypeListLoading}
                rightSection={medicineTypeListLoading ? <Loader /> : <Combobox.Chevron />}
                onChange={(value) => handleMedicineTypeChange(value)}
                searchable
            />

            <Combobox
                className={`flex-1`}
                label={t('medicine')}
                store={combobox}
                disabled={!selectedMedicineType.current}
                withinPortal={false}
                onOptionSubmit={(val) => {
                    const selectedOption = medicineOptions.find(option => option.value === val);
                    setSelectedMedicine(selectedOption || null);
                    setSearchValue(selectedOption ? selectedOption.label : '');
                    onInputChange('medicineId', val);
                    combobox.closeDropdown();
                }}
            >
                <Combobox.Target>
                    <InputBase
                        value={searchValue}
                        rightSection={isSearching ? <Loader /> : <Combobox.Chevron />}
                        disabled={!selectedMedicineType.current}
                        onChange={(event) => {
                            const { value } = event.target;
                            setSearchValue(value);
                            setSelectedMedicine(null);
                            handleMedicineSearch(value);
                            combobox.openDropdown();
                        }}
                        onClick={() => combobox.openDropdown()}
                        onFocus={() => combobox.openDropdown()}
                        onBlur={() => {
                            combobox.closeDropdown();
                        }}
                        placeholder={t('searchValue')}
                        rightSectionPointerEvents="none"
                        styles={{
                            label: {
                                marginBottom: '4px',
                                marginLeft: '0.5rem',
                                fontWeight: 'normal',
                                fontSize: '12px',
                            }
                        }}
                    />
                </Combobox.Target>

                <Combobox.Dropdown>
                    <Combobox.Options>
                        {
                            isSearching ?
                                <Combobox.Empty>{
                                    <div className='w-full flex items-center justify-center py-2'>
                                        <Loader />
                                    </div>
                                }</Combobox.Empty>
                                : medicineOptions?.length > 0 ? (
                                    medicineOptions.map((option) => (
                                        <Combobox.Option key={option.value} value={option.value}
                                            disabled={selectedMedicines.includes(option.value)}
                                        >
                                            {option.label}
                                        </Combobox.Option>
                                    ))
                                ) : (
                                    <Combobox.Empty>Nothing found</Combobox.Empty>
                                )}
                    </Combobox.Options>
                </Combobox.Dropdown>
            </Combobox>
            <Select
                label={t('dosage')}
                className={`flex-1`}
                disabled={!selectedMedicine}
                data={[
                    { value: "morning", label: "1--0--0" },
                    { value: "morningEvening", label: "1--0--1" },
                    { value: "morningAfternoonEvening", label: "1--1--1" },
                    { value: "evening", label: "0--0--1" },
                    { value: "afternoon", label: "0--1--0" },
                    { value: "morningAfternoon", label: "1--1--0" },
                    { value: "afternoonEvening", label: "0--1--1" },
                ]}
                onChange={(value) => onInputChange('frequency', value)}
                searchable
            />
            <TextInput
                className={`flex-1`}
                label={t('quantity')}
                disabled={!selectedMedicine}
                onChange={(event) =>
                    onInputChange('dosage', event?.target?.value)}
            />
            {
                showDelete && (
                    <Tooltip label={t('delete')}>
                        <ActionIcon className={`!mt-6`} onClick={() => removeMedicine()} variant={'transparent'}
                            c={theme.colors.red[6]}>
                            <Trash2 size={20} />
                        </ActionIcon>
                    </Tooltip>
                )
            }
        </Group>
    );
}
