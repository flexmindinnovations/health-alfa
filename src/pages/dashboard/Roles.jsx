import {Container} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {useMemo} from "react";
import {useApiConfig} from "@contexts/ApiConfigContext.jsx";
import {useDocumentTitle} from "@hooks/DocumentTitle.jsx";
import {AddEditRole} from "@modals/AddEditRole.jsx";
import {DataTableWrapper} from "@components/DataTableWrapper.jsx";
import {useListManager} from "@hooks/ListManager.jsx";
import {useModal} from "@hooks/AddEditModal.jsx";

export default function Roles() {
    const {t} = useTranslation();
    const {apiConfig} = useApiConfig();
    useDocumentTitle(t('roles'));
    const {openModal} = useModal();

    const columns = useMemo(() => [
        {accessor: 'doctorId', title: t('id'), width: 80, style: {padding: '10px'}},
        {accessor: 'doctorName', title: t('doctorName'), width: 'auto', style: {padding: '10px', flex: 1}},
        {accessor: 'doctorAddress', title: t('address'), width: 'auto', style: {padding: '10px', flex: 1}},
        {accessor: 'doctorDegree', title: t('doctorDegree'), width: 'auto', style: {padding: '10px', flex: 1}},
    ], [t]);

    const {
        loading,
        dataSource,
        handleRefresh
    } = useListManager({
        apiEndpoint: apiConfig.doctors.getList,
    });

    const openAddEditModal = ({data = null, mode = 'add'}) => {
        openModal({
            Component: AddEditRole,
            data,
            mode,
            title: t("role"),
            handleRefresh: handleRefresh
        });
    };

    const handleDelete = async (data) => {
    }

    return (
        <Container p={15}>
            <DataTableWrapper
                loading={loading}
                showAddButton={true}
                id={'doctorId'}
                addTitle={t('role')}
                columns={columns}
                dataSource={dataSource}
                handleOnAdd={() => openAddEditModal({mode: 'add'})}
                handleOnEdit={(data) => openAddEditModal({data, mode: 'edit'})}
                handleOnDelete={data => handleDelete(data)}
                onRefresh={handleRefresh}
            />
        </Container>
    )
}