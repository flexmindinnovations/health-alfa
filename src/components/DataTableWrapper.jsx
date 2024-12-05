import { DataTable } from 'mantine-datatable';
import {
    ActionIcon,
    Container,
    Group,
    Loader,
    TextInput,
    Tooltip,
    useMantineTheme,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { Plus, RefreshCcw, SquarePen, Trash2, X } from 'lucide-react';
import styles from '@styles/DataTableWrapper.module.css';

export function DataTableWrapper({
                                     loading,
                                     columns = [],
                                     dataSource = [],
                                     showAddButton = false,
                                     showFilter = false,
                                     addTitle = '',
                                     id,
                                     handleOnAdd,
                                     handleOnEdit,
                                     handleOnDelete,
                                     onRefresh,
                                 }) {
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 15,
        sortStatus: { columnAccessor: 'name', direction: 'asc' },
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [filteredData, setFilteredData] = useState(dataSource);

    const PAGE_SIZES = [10, 15, 20];
    const theme = useMantineTheme();
    const { t } = useTranslation();

    const buttonDimensions = {
        height: 38,
        width: 60,
    };

    const handleEdit = (record) => handleOnEdit(record);
    const handleDelete = (record) => handleOnDelete(record);

    useEffect(() => {
        const lowercasedQuery = searchQuery.toLowerCase();
        const filtered = dataSource
            .filter((record) =>
                Object.values(record).some((value) =>
                    String(value).toLowerCase().includes(lowercasedQuery)
                )
            )
            .filter((record) =>
                statusFilter ? record.status === statusFilter : true
            );
        setFilteredData(filtered);
    }, [searchQuery, statusFilter, dataSource]);

    const actionColumn = {
        accessor: 'actions',
        title: t('action'),
        width: 100,
        render: (record) => (
            <div style={{ display: 'flex', gap: '10px' }}>
                <Tooltip label={t('edit')}>
                    <SquarePen
                        size={16}
                        style={{ cursor: 'pointer', color: theme.primaryColor }}
                        onClick={() => handleEdit(record)}
                    />
                </Tooltip>
                <Tooltip label={t('delete')}>
                    <Trash2
                        size={16}
                        style={{ cursor: 'pointer', color: 'red' }}
                        onClick={() => handleDelete(record)}
                    />
                </Tooltip>
            </div>
        ),
    };
    const enhancedColumns = [...columns, actionColumn];

    const handleClearSearch = () => setSearchQuery('');

    return (
        <div className="h-full w-full flex flex-col items-start justify-start gap-4">
            <div className={`${styles.toolbar}`}>
                <div className="search-filter flex items-center justify-between w-full gap-4">
                    <div style={{ position: 'relative', width: '50%' }}>
                        <TextInput
                            type="text"
                            disabled={loading}
                            placeholder={t('search')}
                            value={searchQuery}
                            size={'md'}
                            radius={'lg'}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            styles={{
                                root: {
                                    width: '100%',
                                    radius: theme.radius.lg
                                },
                            }}
                        />
                        {searchQuery && (
                            <ActionIcon
                                onClick={handleClearSearch}
                                radius={'lg'}
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    right: 10,
                                    transform: 'translateY(-50%)',
                                }}
                                size={20}
                            >
                                <X size={16} />
                            </ActionIcon>
                        )}
                    </div>

                    <Group gap={0.5}>
                        <Tooltip label={t('refreshData')}>
                            <ActionIcon
                                key="refreshData"
                                loading={loading}
                                disabled={!dataSource.length || loading}
                                onClick={onRefresh}
                                radius={0}
                                styles={{
                                    root: {
                                        borderRadius: showAddButton
                                            ? `${theme.radius.lg} 0 0 ${theme.radius.lg}`
                                            : theme.radius.lg,
                                        minWidth: buttonDimensions.width,
                                        minHeight: buttonDimensions.height,
                                    },
                                }}
                            >
                                <RefreshCcw size={16} />
                            </ActionIcon>
                        </Tooltip>
                        {showAddButton && (
                            <Tooltip label={`${t('add')} ${addTitle}`}>
                                <ActionIcon
                                    key="addTitle"
                                    disabled={loading}
                                    onClick={handleOnAdd}
                                    radius={0}
                                    styles={{
                                        root: {
                                            borderRadius: `0 ${theme.radius.lg} ${theme.radius.lg} 0`,
                                            minWidth: buttonDimensions.width,
                                            minHeight: buttonDimensions.height,
                                        },
                                    }}
                                >
                                    <Plus size={16} />
                                </ActionIcon>
                            </Tooltip>
                        )}
                    </Group>
                </div>
            </div>

            {loading ? (
                <Container
                    p={0}
                    px={10}
                    className="!flex-1"
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        height: '100%',
                        margin: '0 auto',
                        background: 'transparent',
                    }}
                >
                    <Loader />
                </Container>
            ) : (
                <DataTable
                    style={{
                        width: '100%',
                    }}
                    idAccessor={id}
                    width="100%"
                    withTableBorder
                    withColumnBorders
                    withRowBorders
                    striped
                    highlightOnHover
                    minHeight={150}
                    records={filteredData}
                    noRecordsText={t('noRecordsToShow')}
                    recordsPerPageLabel={t('recordsPerPage')}
                    columns={enhancedColumns}
                    totalRecords={filteredData.length}
                    paginationActiveBackgroundColor="grape"
                    recordsPerPage={pagination.pageSize}
                    page={pagination.page}
                    onPageChange={(page) =>
                        setPagination((prev) => ({ ...prev, page }))
                    }
                    recordsPerPageOptions={PAGE_SIZES}
                    onRecordsPerPageChange={(pageSize) =>
                        setPagination((prev) => ({ ...prev, pageSize }))
                    }
                    sortStatus={pagination.sortStatus}
                    onSortStatusChange={(sortStatus) =>
                        setPagination((prev) => ({ ...prev, sortStatus }))
                    }
                    paginationSize="md"
                    loadingText={`${t('loading')}...`}
                    paginationText={({ from, to, totalRecords }) =>
                        `${t('records')} ${from} - ${to} ${t('of')} ${totalRecords}`
                    }
                    paginationWrapBreakpoint="sm"
                />
            )}
        </div>
    );
}
