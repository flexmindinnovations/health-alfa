import {useMemo} from "react";
import {Container} from "@mantine/core";
import {DataTableWrapper} from "@components/DataTableWrapper";
import {useTranslation} from "react-i18next";
import {useApiConfig} from "@contexts/ApiConfigContext";
import {AddEditTestType} from '@modals/AddEditTestType';
import {useDocumentTitle} from "@hooks/DocumentTitle";
import {useListManager} from "@hooks/ListManager.jsx";
import {useModal} from "@hooks/AddEditModal.jsx";

export default function TestTypes() {
    const {t} = useTranslation();
    const {apiConfig} = useApiConfig();
    useDocumentTitle(t('testTypes'));
    const {openModal} = useModal();

    const columns = useMemo(() =>
        [
            {
                accessor: 'testTypeId',
                title: t('id'),
                width: 80,
                style: {padding: '10px'},
            },
            {
                accessor: 'testTypeEnglish',
                title: t('testTypeNameEn'),
                width: 'auto',
                style: {padding: '10px', flex: 1},
            },
            {
                accessor: 'testTypeArabic',
                title: t('testTypeNameAr'),
                width: 'auto',
                style: {padding: '10px', flex: 1},
            },
        ], [t])

    const {
        loading,
        dataSource,
        handleRefresh
    } = useListManager({
        apiEndpoint: apiConfig.testTypes.getList,
    });

    const handleDelete = async (data) => {

    }

    const openAddEditModal = ({data = null, mode = 'add'}) => {
        openModal({
            Component: AddEditTestType,
            data,
            mode,
            title: t("testTypes"),
            handleRefresh: handleRefresh
        });

    }


    return (
        <Container p={15}>
            <DataTableWrapper
                loading={loading}
                showAddButton={true}
                id={'testTypeId'}
                addTitle={t('testType')}
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