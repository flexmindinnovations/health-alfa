import {useMemo} from "react";
import {Container} from "@mantine/core";
import {DataTableWrapper} from "@components/DataTableWrapper";
import {useTranslation} from "react-i18next";
import {useApiConfig} from "@contexts/ApiConfigContext";
import {useDocumentTitle} from '@hooks/DocumentTitle';
import {useListManager} from "@hooks/ListManager.jsx";
import {AddEditDoctor} from "@modals/AddEditDoctor.jsx";
import {useModal} from "@hooks/AddEditModal.jsx";

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
        const title = mode === "edit" ? `${t("edit")}: ${data?.doctorName}` : `${t("add")} ${t("doctor")}`;
        openModal({Component: AddEditDoctor, data, mode, title});
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