import {Container} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {useMemo} from "react";
import {useApiConfig} from "@contexts/ApiConfigContext.jsx";
import {useDocumentTitle} from "@hooks/DocumentTitle.jsx";
import {modals} from "@mantine/modals";
import {AddEditRole} from "@modals/AddEditRole.jsx";
import {DataTableWrapper} from "@components/DataTableWrapper.jsx";
import {useListManager} from "@hooks/ListManager.jsx";

export default function Roles() {
    const {t} = useTranslation();
    const {apiConfig} = useApiConfig();
    useDocumentTitle(t('roles'));

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
        modals.closeAll();
        modals.open({
            title: mode === "edit" ? `${t("edit")}: ${data?.doctorName}` : `${t("add")} ${t("doctor")}`,
            centered: true,
            size: 'xl',
            styles: {title: {fontWeight: '500', fontSize: '14px'}},
            children: (
                <AddEditRole
                    mode={mode}
                    data={data}
                    handleCancel={(event) => {
                        const {refresh} = event;
                        modals.closeAll();
                        refresh && handleRefresh();
                    }}
                />
            )
        });
    };

    const handleDelete = async (data) => {
    }

    return (
        <Container>
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