import {Container} from '@mantine/core'
import {useDocumentTitle} from '@hooks/DocumentTitle'
import {useTranslation} from 'react-i18next'
import {DataTableWrapper} from '@components/DataTableWrapper'
import {AddEditDocument} from '@modals/AddEditDocument'
import {useApiConfig} from '@contexts/ApiConfigContext.jsx'
import {modals} from "@mantine/modals";
import {useListManager} from "@hooks/ListManager.jsx";

export default function Documents() {
    const {t} = useTranslation()
    const {apiConfig} = useApiConfig();
    useDocumentTitle(t('documents'))

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
        modals.open({
            title: mode === "edit" ? `${t("edit")} ${t("document")}` : `${t("add")} ${t("document")}`,
            centered: true,
            children: (<AddEditDocument
                    mode={mode}
                    data={data}
                    handleCancel={(event) => {
                        const {refresh} = event;
                        modals.closeAll();
                        refresh && handleRefresh();
                    }}
                />)
        })
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
