import {Container} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {useEffect, useMemo, useState} from "react";
import {useApiConfig} from "@contexts/ApiConfigContext.jsx";
import {useDocumentTitle} from "@hooks/DocumentTitle.jsx";
import {DataTableWrapper} from "@components/DataTableWrapper.jsx";
import dayjs from 'dayjs';
import {useListManager} from "@hooks/ListManager.jsx";
import {useModal} from "@hooks/AddEditModal.jsx";
import {AddEditAvailability} from "@modals/AddEditAvailability.jsx";

const getFormattedTime = (time) => {
    const currentDate = dayjs().format("YYYY-MM-DD");
    return dayjs(`${currentDate}T${time}`, "YYYY-MM-DDTHH:mm:ss").format("h:mm A");
}

export default function Availability() {
    const {t} = useTranslation();
    const [tableData, setTableData] = useState([]);
    const {apiConfig} = useApiConfig();
    useDocumentTitle(t('doctors'));
    const columns = useMemo(() => [
        {
            accessor: 'doctorTimingId', title: t('id'), width: 80, style: {padding: '10px'},
        }, {
            accessor: 'doctorName', title: t('doctorName'), width: 'auto', style: {padding: '10px', flex: 1},
        }, {
            accessor: 'dayOfWeek', title: t('dayOfWeek'), width: 'auto', style: {padding: '10px', flex: 1},
        }, {
            accessor: 'slotType', title: t('slotType'), width: 'auto', style: {padding: '10px', flex: 1},
        }, {
            accessor: 'startTime',
            title: t('startTime'),
            width: 'auto',
            style: {padding: '10px', flex: 1},
            render: (record) => getFormattedTime(record.startTime),
        }, {
            accessor: 'endTime',
            title: t('endTime'),
            width: 'auto',
            style: {padding: '10px', flex: 1},
            render: (record) => getFormattedTime(record.endTime),
        },], [t])
    let {
        loading, dataSource, handleRefresh
    } = useListManager({
        apiEndpoint: apiConfig.doctors.getAvailability,
    });
    const {openModal} = useModal();

    useEffect(() => {
        if (dataSource && dataSource.length > 0) {
            const updatedResponse = dataSource.map((item) => {
                return {
                    ...item,
                    dayOfWeek: item.dayOfWeek.charAt(0).toUpperCase() + item.dayOfWeek.slice(1),
                    slotType: item.slotType.charAt(0).toUpperCase() + item.slotType.slice(1)
                }
            });
            setTableData(updatedResponse);
        }
    }, [dataSource]);

    const handleDelete = async (data) => {
    }

    const openAddEditModal = ({data = null, mode = 'add'}) => {
        const inputData = mode === 'add' ? data : tableData.filter((each) => each.dayOfWeek === data.dayOfWeek);
        openModal({
            Component: AddEditAvailability,
            data: inputData,
            mode,
            title: t("availability"),
            handleRefresh: handleRefresh
        });
    }

    return (<Container>
        <DataTableWrapper
            loading={loading}
            showAddButton={true}
            id={'doctorTimingId'}
            addTitle={t('availability')}
            columns={columns}
            dataSource={tableData}
            handleOnAdd={() => openAddEditModal({mode: 'add'})}
            handleOnEdit={(data) => openAddEditModal({data, mode: 'edit'})}
            onRefresh={handleRefresh}
            handleOnDelete={data => handleDelete(data)}
        />
    </Container>)
}