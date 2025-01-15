import {Button, Card, Group, Select, Tooltip} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {Filter} from 'lucide-react';
import degreeMaster from "../assets/data/degree-master.json";
import {useState} from "react";

const mappedDegrees = degreeMaster.map(({degree}) => ({value: degree, label: degree}));

export function AppointmentFilter(
    {
        onFilterChange
    }
) {
    const {t} = useTranslation();
    const [values, setValues] = useState({
        qualification: null,
        speciality: null,
        gender: null,
    });

    const specialties = degreeMaster
        .flatMap(({specialities}) => specialities)
        .filter((value, index, self) => self.indexOf(value) === index)
        .map((speciality) => ({value: speciality, label: speciality}));

    const handleChange = (key, value) => {
        const updatedValues = {...values, [key]: value};
        setValues(updatedValues);
        if (onFilterChange) {
            onFilterChange(updatedValues);
        }
    };

    const resetFilters = () => {
        const initialState = {
            qualification: null,
            speciality: null,
            gender: null,
        };
        setValues(initialState);
        if (onFilterChange) {
            onFilterChange(initialState);
        }
    }

    return (
        <Card className={`flex !flex-row justify-start gap-3`} p={10}>
            <Group className={`self-end`} mb={7}>
                <Tooltip label={t('filter')}>
                    <Filter size={20}/>
                </Tooltip>
            </Group>
            <Group gap={10} className={`flex-1`}>
                <Select
                    label={t('doctorDegree')}
                    data={mappedDegrees}
                    value={values.qualification}
                    onChange={(value) => handleChange('qualification', value)}
                    searchable
                />

                <Select
                    label={t('speciality')}
                    data={specialties}
                    value={values.speciality}
                    onChange={(value) => handleChange('speciality', value)}
                    searchable
                />

                <Select
                    label={t('gender')}
                    data={[{value: 'Male', label: 'Male'}, {value: 'Female', label: 'Female'}]}
                    value={values.gender}
                    onChange={(value) => handleChange('gender', value)}
                    searchable
                />
            </Group>
            <Group gap={10}>
                <Button variant="light" onClick={resetFilters}>{t('resetFilters')}</Button>
            </Group>
        </Card>
    )
}