import { DataTable } from 'mantine-datatable'
import { Button } from '@mantine/core'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { IconPlus } from '@tabler/icons-react'

export function DataTableWrapper ({
  children,
  columns = [],
  dataSource = [],
  showAddButton = false,
  showFilter = false,
  addTitle = '',
  handleOnAdd,
  handleOnEdit,
  handleOnDelete
}) {
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 15
  const PAGE_SIZES = [10, 15, 20]
  const [pageSize, setPageSize] = useState(PAGE_SIZES[1])
  const [sortStatus, setSortStatus] = useState({
    columnAccessor: 'name',
    direction: 'asc'
  })

  useEffect(() => {
    const from = (page - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE
  }, [page])

  return (
    <div className='h-full w-full flex flex-col items-start justify-start gap-2'>
      <div className='toolbar w-full flex items-center justify-between'>
        <div className='search-filter'></div>
        <div className='action-items flex-1'>
          {showAddButton && (
            <Button leftSection={<IconPlus size={16} />}>{addTitle}</Button>
          )}
        </div>
      </div>
      <DataTable
        style={{ minHeight: 500, width: '100%' }}
        idAccessor={'documentId'}
        width='100%'
        borderRadius=''
        withTableBorder
        withColumnBorders
        striped
        highlightOnHover
        minHeight={150}
        records={dataSource}
        noRecordsText='No records to show'
        columns={columns}
        totalRecords={dataSource.length}
        paginationActiveBackgroundColor='grape'
        recordsPerPage={PAGE_SIZE}
        page={page}
        onPageChange={p => setPage(p)}
        recordsPerPageOptions={PAGE_SIZES}
        onRecordsPerPageChange={setPageSize}
        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
        paginationSize='md'
        loadingText='Loading...'
        paginationText={({ from, to, totalRecords }) =>
          `Records ${from} - ${to} of ${totalRecords}`
        }
      />
    </div>
  )
}
