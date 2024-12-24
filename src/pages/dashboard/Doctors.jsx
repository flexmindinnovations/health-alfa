import {useMemo} from "react";
import {Container} from "@mantine/core";
import {DataTableWrapper} from "@components/DataTableWrapper";
import {useTranslation} from "react-i18next";
import {useApiConfig} from "@contexts/ApiConfigContext";
import {useDocumentTitle} from '@hooks/DocumentTitle';
import {useListManager} from "@hooks/ListManager.jsx";
import {useModal} from "@hooks/AddEditModal.jsx";
import {AddEditDoctor} from "@modals/AddEditDoctor.jsx";

export default function Doctors() {
    const {t} = useTranslation();
    const {apiConfig} = useApiConfig();
    useDocumentTitle(t('doctors'));
    const {openModal} = useModal();

    const columns = useMemo(() =>
        [
            {
                accessor: 'doctorId',
                title: t('id'),
                width: 80,
                style: {padding: '10px'},
            },
            {
                accessor: 'doctorName',
                title: t('doctorName'),
                width: 'auto',
                style: {padding: '10px', flex: 1},
            },
            {
                accessor: 'doctorAddress',
                title: t('address'),
                width: 'auto',
                style: {padding: '10px', flex: 1},
            },
            {
                accessor: 'doctorDegree',
                title: t('doctorDegree'),
                width: 'auto',
                style: {padding: '10px', flex: 1},
            },
        ], [t])

    const {
        loading,
        dataSource,
        handleRefresh
    } = useListManager({
        apiEndpoint: apiConfig.doctors.getList,
    });

    const openAddEditModal = ({data = null, mode = 'add'}) => {
        openModal({
            Component: AddEditDoctor,
            data,
            mode,
            title: t("doctor"),
            handleRefresh: handleRefresh
        });
    };

    const handleDelete = (data) => {
    }

    return (
        <Container>
            <DataTableWrapper
                loading={loading}
                showAddButton={false}
                id={'doctorId'}
                addTitle={t('doctor')}
                columns={columns}
                dataSource={dataSource}
                handleOnAdd={() => openAddEditModal({mode: 'add'})}
                handleOnEdit={(data) => openAddEditModal({data, mode: 'edit'})}
                onRefresh={handleRefresh}
                handleOnDelete={data => handleDelete(data)}
            />
        </Container>
    )
}