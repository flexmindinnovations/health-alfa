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
import {v4 as uuid} from "uuid";
import {useEncrypt} from "@hooks/EncryptData.jsx";
import {useAuth} from "@contexts/AuthContext.jsx";

const getFormattedTime = (time) => {
    const currentDate = dayjs().format("YYYY-MM-DD");
    return dayjs(`${currentDate}T${time}`, "YYYY-MM-DDTHH:mm:ss").format("h:mm A");
}

export default function Availability() {
    const {t} = useTranslation();
    const [tableData, setTableData] = useState([]);
    const {apiConfig} = useApiConfig();
    useDocumentTitle(t('doctors'));
    const {getEncryptedData} = useEncrypt();
    const {user} = useAuth();
    const [apiEndpoint, setApiEndpoint] = useState('');
    const [userType, setUserType] = useState('admin');

    const columns = useMemo(() => [
        {
            accessor: 'doctorName',
            title: t('doctorName'),
            width: 'auto',
            style: {padding: '10px', flex: 1},
        },
        {
            accessor: 'dayOfWeek', title: t('dayOfWeek'), width: 'auto', style: {padding: '10px', flex: 1},
        }
    ], [t]);

    useEffect(() => {
        const _userType = getEncryptedData('roles')?.toLowerCase();
        if (user && _userType) {
            setUserType(_userType);
            const endpoint = _userType === 'admin'
                ? apiConfig.doctors.getAvailability
                : apiConfig.doctors.getAvailabilityById(user?.doctorId);
            setApiEndpoint(endpoint);
        }
    }, [apiEndpoint, user, userType]);

    const {loading, dataSource, handleRefresh} = useListManager({apiEndpoint});

    const {openModal} = useModal();

    useEffect(() => {
        if (dataSource && dataSource.length > 0) {
            const updatedResponse = dataSource.map((item) => {
                return {
                    availabilityId: uuid(),
                    ...item,
                    dayOfWeek: item.dayOfWeek.charAt(0).toUpperCase() + item.dayOfWeek.slice(1),
                    slotList: item.slotList.map((child) => {
                        return {
                            ...child,
                            startTime: getFormattedTime(child.startTime),
                            endTime: getFormattedTime(child.endTime),
                            slotType: child.slotType.charAt(0).toUpperCase() + child.slotType.slice(1)
                        }
                    })
                }
            });
            setTableData(updatedResponse);
        }
    }, [dataSource]);

    const handleDelete = async (data) => {
    }

    const openAddEditModal = ({data = null, mode = 'add'}) => {
        const inputData = mode === 'add' ? user : tableData.filter((each) => each.dayOfWeek === data.dayOfWeek)[0];
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
            showAddButton={userType === 'doctor'}
            id={'availabilityId'}
            addTitle={t('availability')}
            columns={columns}
            dataSource={tableData}
            handleOnAdd={() => openAddEditModal({mode: 'add'})}
            handleOnEdit={(data) => openAddEditModal({data, mode: 'edit'})}
            onRefresh={handleRefresh}
            handleOnDelete={data => handleDelete(data)}
            hasNestedTable={true}
            nestedTableAccessor={'slotList'}
            nestedTableConfig={'doctorName'}
            nestedTableAccessorId={'doctorTimingId'}
            nestedColumns={[
                {
                    accessor: 'slotType',
                    title: t('slotType'),
                    width: 'auto',
                    style: {padding: '10px', flex: 1},
                }, {
                    accessor: 'startTime',
                    title: t('startTime'),
                    width: 'auto',
                    style: {padding: '10px', flex: 1},
                }, {
                    accessor: 'endTime',
                    title: t('endTime'),
                    width: 'auto',
                    style: {padding: '10px', flex: 1},
                },
            ]}
        />
    </Container>)
}