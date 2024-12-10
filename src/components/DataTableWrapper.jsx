import {DataTable} from 'mantine-datatable';
import {ActionIcon, Container, Group, Loader, Text, TextInput, Tooltip, useMantineTheme} from '@mantine/core';
import {useTranslation} from 'react-i18next';
import {useCallback, useEffect, useState} from 'react';
import {Plus, RefreshCcw, SquarePen, Trash2, X} from 'lucide-react';
import styles from '@styles/DataTableWrapper.module.css';
import {modals} from "@mantine/modals";

export function DataTableWrapper({
                                     loading,
                                     columns = [],
                                     dataSource = [],
                                     showAddButton = false,
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
        sortStatus: {columnAccessor: '', direction: ''},
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState(dataSource);
    const theme = useMantineTheme();
    const {t} = useTranslation();
    const [rowData, setRowData] = useState({});

    const PAGE_SIZES = [10, 15, 20];
    const radius = theme.radius.xl;

    const applyFilters = () => {
        const query = searchQuery.toLowerCase();
        setFilteredData(
            dataSource.filter((record) =>
                Object.values(record).some((value) =>
                    String(value).toLowerCase().includes(query)
                )
            )
        );
    };

    useEffect(applyFilters, [searchQuery, dataSource]);

    const handleSortChange = (sortStatus) => {
        const {columnAccessor, direction} = sortStatus;
        setFilteredData((prev) =>
            [...prev].sort((a, b) => {
                const valA = a[columnAccessor];
                const valB = b[columnAccessor];
                return direction === 'asc'
                    ? valA > valB
                        ? 1
                        : -1
                    : valA < valB
                        ? 1
                        : -1;
            })
        );
        setPagination((prev) => ({...prev, sortStatus}));
    };

    const enhancedColumns = [
        ...columns.map((col) => ({...col, sortable: true})),
        {
            accessor: 'actions',
            title: t('action'),
            width: 100,
            render: (record) => (
                <div style={{display: 'flex', gap: '10px'}}>
                    <Tooltip label={t('edit')}>
                        <SquarePen
                            size={16}
                            style={{cursor: 'pointer', color: theme.primaryColor}}
                            onClick={() => handleOnEdit(record)}
                        />
                    </Tooltip>
                    <Tooltip label={t('delete')}>
                        <Trash2
                            size={16}
                            style={{cursor: 'pointer', color: 'red'}}
                            onClick={() => {
                                setRowData(record);
                                openDeleteModal(record);
                            }}
                        />
                    </Tooltip>
                </div>
            ),
        },
    ];

    const openDeleteModal = useCallback(
        (data) => {
            modals.openConfirmModal({
                title: t('deleteConfirm'),
                centered: true,
                children: (
                    <Text size="sm">{t('areYouSureToDelete')}?</Text>
                ),
                labels: {confirm: t('delete'), cancel: t('cancel')},
                confirmProps: {color: 'red', radius: radius},
                cancelProps: {radius: radius},
                onCancel: () => {
                },
                onConfirm: () => onDelete(data),
            })
        }, [rowData])

    const onDelete = (data) => {
        handleOnDelete(data);
    }

    return (
        <div className="h-full w-full flex flex-col items-start justify-start gap-4">
            <div className={`${styles.toolbar}`}>
                <div className="search-filter flex items-center justify-between w-full gap-4">
                    <div style={{position: 'relative', width: '50%'}}>
                        <TextInput
                            type="text"
                            disabled={loading}
                            placeholder={t('search')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{width: '100%'}}
                        />
                        {searchQuery && (
                            <ActionIcon
                                onClick={() => setSearchQuery('')}
                                radius="lg"
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    right: 10,
                                    transform: 'translateY(-50%)',
                                }}
                            >
                                <X size={16}/>
                            </ActionIcon>
                        )}
                    </div>
                    <Group gap={1}>
                        <Tooltip label={t('refreshData')}>
                            <ActionIcon
                                onClick={onRefresh}
                                radius={0}
                                loading={loading}
                                style={{
                                    borderRadius: showAddButton
                                        ? `${radius} 0 0 ${radius}`
                                        : radius,
                                    width: 60,
                                    height: 38,
                                }}
                            >
                                {<RefreshCcw size={16}/>}
                            </ActionIcon>
                        </Tooltip>
                        {showAddButton && (
                            <Tooltip label={`${t('add')} ${addTitle}`}>
                                <ActionIcon
                                    onClick={handleOnAdd}
                                    radius={0}
                                    disabled={loading}
                                    style={{
                                        borderRadius: `0 ${radius} ${radius} 0`,
                                        width: 60,
                                        height: 38,
                                    }}
                                >
                                    <Plus size={16}/>
                                </ActionIcon>
                            </Tooltip>
                        )}
                    </Group>
                </div>
            </div>
            {loading ? (
                <Container className="flex-1 flex items-center justify-center">
                    <Loader/>
                </Container>
            ) : (
                <DataTable
                    styles={{
                        root: {width: '100%'},
                    }}
                    idAccessor={id}
                    withTableBorder
                    withColumnBorders
                    striped
                    highlightOnHover
                    records={filteredData}
                    noRecordsText={t('noRecordsToShow')}
                    recordsPerPageLabel={t('recordsPerPage')}
                    columns={enhancedColumns}
                    totalRecords={filteredData.length}
                    recordsPerPage={pagination.pageSize}
                    page={pagination.page}
                    onPageChange={(page) => setPagination((prev) => ({...prev, page}))}
                    recordsPerPageOptions={PAGE_SIZES}
                    onRecordsPerPageChange={(pageSize) =>
                        setPagination((prev) => ({...prev, pageSize}))
                    }
                    sortStatus={pagination.sortStatus}
                    onSortStatusChange={handleSortChange}
                    paginationSize="md"
                    paginationText={({from, to, totalRecords}) =>
                        `${t('records')} ${from} - ${to} ${t('of')} ${totalRecords}`
                    }
                    paginationWrapBreakpoint="sm"
                />
            )}
        </div>
    );
}
