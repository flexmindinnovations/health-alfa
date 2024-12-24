import {Container} from '@mantine/core'
import {useDocumentTitle} from '@hooks/DocumentTitle'
import {useTranslation} from 'react-i18next'
import {DataTableWrapper} from '@components/DataTableWrapper'
import {AddEditDocument} from '@modals/AddEditDocument'
import {useApiConfig} from '@contexts/ApiConfigContext.jsx'
import {useListManager} from "@hooks/ListManager.jsx";
import {useModal} from "@hooks/AddEditModal.jsx";

export default function Documents() {
    const {t} = useTranslation()
    const {apiConfig} = useApiConfig();
    useDocumentTitle(t('documents'))
    const {openModal} = useModal();

    const columns = [{
        accessor: 'documentTypeId', title: t('id'), width: 80, style: {padding: '10px'},
    }, {
        accessor: 'documentTypeEnglish', title: t('documentName'), width: 'auto', style: {padding: '10px', flex: 1},
    }, {
        accessor: 'documentTypeArabic', title: t('documentName'), width: 'auto', style: {padding: '10px', flex: 1},
    },];

    const {
        loading, dataSource, handleRefresh
    } = useListManager({
        apiEndpoint: apiConfig.document.getList,
    });

    const handleDelete = record => {

    }

    const openAddEditModal = ({data = null, mode = 'add'}) => {
        openModal({
            Component: AddEditDocument,
            data,
            mode,
            title: t("document"),
            handleRefresh: handleRefresh
        });
    }

    return (<Container>
        <DataTableWrapper
            loading={loading}
            showAddButton={true}
            id={'documentTypeId'}
            addTitle={t('document')}
            columns={columns}
            dataSource={dataSource}
            handleOnAdd={() => openAddEditModal({mode: 'add'})}
            handleOnEdit={(data) => openAddEditModal({data, mode: 'edit'})}
            onRefresh={handleRefresh}
            handleOnDelete={data => handleDelete(data)}
        />
    </Container>)
}
