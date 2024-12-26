import {useMemo} from 'react'
import {Container} from '@mantine/core'
import {useDocumentTitle} from '@hooks/DocumentTitle'
import {useTranslation} from 'react-i18next'
import {DataTableWrapper} from '@components/DataTableWrapper'
import {useApiConfig} from '@contexts/ApiConfigContext.jsx'
import dayjs from 'dayjs';
import {useListManager} from "@hooks/ListManager.jsx";
import {useModal} from "@hooks/AddEditModal.jsx";
import {AddEditDocument} from "@modals/AddEditDocument.jsx";
import {AddEditClient} from "@modals/AddEditClient.jsx";

export default function Users() {
    const {t} = useTranslation();
    const {apiConfig} = useApiConfig();
    useDocumentTitle(t('clients'));
    const {openModal} = useModal();

    const props = {
        resizable: true,
        sortable: true,
        // toggleable: true,
        // draggable: true,
    };

    const columns = useMemo(() => [
        {
            accessor: 'clientId',
            title: t('id'),
            width: 80,
            style: {padding: '10px'},
        },
        {
            accessor: 'profileImagePath',
            title: t('profileImagePath'),
            width: 80,
            style: {padding: '10px'},
            render: (record) => {
                const imageEndpoint = record.profileImagePath;
                const host = import.meta.env.VITE_API_URL;
                const imageUrl = `${host}/${imageEndpoint}`.replace('/api', '');
                return (
                    <img
                        src={imageUrl}
                        alt={t('profileImage')}
                        style={{
                            width: '30px',
                            height: '30px',
                            margin: '0 auto',
                            borderRadius: '50%',
                            objectFit: 'cover',
                        }}
                    />
                )
            }
        },
        {
            accessor: 'firstName',
            title: t('firstName'),
            width: 'auto',
            style: {padding: '10px', flex: 1},
            ...props
        },
        {
            accessor: 'middleName',
            title: t('middleName'),
            width: 'auto',
            style: {padding: '10px', flex: 1},
            ...props
        },
        {
            accessor: 'lastName',
            title: t('lastName'),
            width: 'auto',
            style: {padding: '10px', flex: 1},
            ...props
        },
        {
            accessor: 'emergencyContactNumber',
            title: t('emergencyContactNumber'),
            width: 'auto',
            style: {padding: '10px', flex: 1},
            ...props
        },
        {
            accessor: 'emailId',
            title: t('emailId'),
            width: 'auto',
            style: {padding: '10px', flex: 1},
            ...props
        },
        {
            accessor: 'mobileNo',
            title: t('mobileNo'),
            width: 'auto',
            style: {padding: '10px', flex: 1},
            ...props
        },
        {
            accessor: 'gender',
            title: t('gender'),
            width: 'auto',
            style: {padding: '10px', flex: 1},
            ...props
        },
        {
            accessor: 'bloodType',
            title: t('bloodType'),
            width: 'auto',
            style: {padding: '10px', flex: 1},
            ...props
        },
        {
            accessor: 'dateOfBirth',
            title: t('dateOfBirth'),
            width: 'auto',
            style: {padding: '10px', flex: 1},
            ...props,
            render: (record) => dayjs(record.dateOfBirth).format('DD/MM/YYYY'),
        },
        {
            accessor: 'height',
            title: t('height'),
            width: 'auto',
            style: {padding: '10px', flex: 1},
            ...props
        },
        {
            accessor: 'clientAddress',
            title: t('address'),
            ellipsis: true,
            width: 'auto',
            style: {padding: '10px', flex: 1},
        },
    ], [t])

    const {
        loading,
        dataSource,
        handleRefresh
    } = useListManager({
        apiEndpoint: apiConfig.clients.getList,
    });

    const handleDelete = async (data) => {
    }

    const openAddEditModal = ({data = {}, mode = 'add'}) => {
        openModal({
            Component: AddEditClient,
            data,
            mode,
            title: t("client"),
            handleRefresh: handleRefresh
        });
    }

    return (
        <Container>
            <DataTableWrapper
                loading={loading}
                showAddButton={true}
                id={'clientId'}
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
