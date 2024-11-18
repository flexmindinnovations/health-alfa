import { DataTable } from 'mantine-datatable'
import {
  Button,
  Container,
  Loader,
  useMantineTheme,
  Tooltip
} from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { SquarePen, Plus, Trash2 } from 'lucide-react'
import styles from '@styles/DataTableWrapper.module.css'

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
                                     handleOnDelete
                                 }) {
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 15,
        sortStatus: {columnAccessor: 'name', direction: 'asc'}
    })

  const PAGE_SIZES = [10, 15, 20]
  const theme = useMantineTheme()
  const { t } = useTranslation()

    const handleEdit = record => handleOnEdit(record)
    const handleDelete = record => handleOnDelete(record)

  const actionColumn = {
    accessor: 'actions',
    title: t('action'),
    width: 100,
    render: record => (
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
    )
  }

  const enhancedColumns = [...columns, actionColumn]

  return (
    <div className='h-[calc(100%_-_50px)] w-full flex flex-col items-start justify-start gap-4'>
      <div className={`${styles.toolbar}`}>
        <div className='search-filter flex-1 flex items-center justify-end gap-2'></div>
        <div className={`${styles.dataTableWrapper}`}>
          {showAddButton && (
            <Button leftSection={<Plus size={16} />} onClick={handleOnAdd}>
              {addTitle}
            </Button>
          )}
        </div>
      </div>
      {loading ? (
        <Container
          p={0}
          px={10}
          className='!flex-1'
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: 'calc(100% - 3rem)',
            margin: '0 auto'
          }}
        >
          <Loader />
        </Container>
      ) : (
        <DataTable
          style={{
            height: 'calc(100% - 3rem)',
            maxHeight: 550,
            width: '100%'
          }}
          idAccessor={id}
          width='100%'
          withTableBorder
          withColumnBorders
          withRowBorders
          striped
          highlightOnHover
          minHeight={150}
          records={dataSource}
          noRecordsText='No records to show'
          columns={enhancedColumns}
          totalRecords={dataSource.length}
          paginationActiveBackgroundColor='grape'
          recordsPerPage={pagination.pageSize}
          page={pagination.page}
          onPageChange={page => setPagination(prev => ({ ...prev, page }))}
          recordsPerPageOptions={PAGE_SIZES}
          onRecordsPerPageChange={pageSize =>
            setPagination(prev => ({ ...prev, pageSize }))
          }
          sortStatus={pagination.sortStatus}
          onSortStatusChange={sortStatus =>
            setPagination(prev => ({ ...prev, sortStatus }))
          }
          paginationSize='md'
          loadingText='Loading...'
          paginationText={({ from, to, totalRecords }) =>
            `Records ${from} - ${to} of ${totalRecords}`
          }
        />
      )}
    </div>
  )
}
