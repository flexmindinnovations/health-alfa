import { useState, useEffect } from 'react'
import { Container, useMantineTheme } from '@mantine/core'
import { useDocumentTitle } from '@hooks/DocumentTitle'
import { useTranslation } from 'react-i18next'
import { DataTableWrapper } from '@components/DataTableWrapper'
import { IconEditCircle, IconTrash } from '@tabler/icons-react'
import { AddEditDocument } from '@modals/AddEditDocument'

export function Documents () {
  const { t } = useTranslation()
  useDocumentTitle(t('documents'))
  const [columns, setColumns] = useState([])
  const [dataSource, setDataSource] = useState([])
  const theme = useMantineTheme()
  const [popupMode, setPopupMode] = useState('add')
  const [showPopup, setShowPopup] = useState(false)
  const [popupData, setPopupData] = useState()

  useEffect(() => {
    const dtSrc = [
      {
        documentId: 'd1f7a9b2-45f6-4c92-95f1-53f9b2d09e1e',
        documentName: 'ProjectPlan.docx'
      },
      {
        documentId: 'a7c6d48b-9b45-401e-9b10-d6bda48a91f3',
        documentName: 'AnnualReport.pdf'
      },
      {
        documentId: 'b2c9a584-25f3-4b6e-8f7d-2b8f2d0a73e5',
        documentName: 'MeetingNotes.txt'
      },
      {
        documentId: 'e1a6f9d3-67f5-4b8e-9f9c-6d4b7a8b9a1c',
        documentName: 'Budget.xlsx'
      },
      {
        documentId: 'f2a8d6e9-98b3-4017-8d7e-8d3c7a9e4f1a',
        documentName: 'ResearchPaper.doc'
      }
    ]

    const cols = [
      {
        accessor: 'documentId',
        title: 'Document ID',
        width: 350,
        style: { padding: '10px' }
      },
      {
        accessor: 'documentName',
        title: 'Document Name',
        width: 'auto',
        style: { padding: '10px', flex: 1 }
      },
      {
        accessor: 'actions',
        title: 'Actions',
        width: 100,
        render: record => (
          <div style={{ display: 'flex', gap: '10px' }}>
            {' '}
            <IconEditCircle
              size={16}
              className={`h-7 p-1.5 w-7 rounded-full hover:bg-cPrimaryFilled hover:text-cDefault`}
              style={{ cursor: 'pointer', color: theme.primaryColor }}
              onClick={() => handleEdit(record)}
            />{' '}
            <IconTrash
              size={16}
              color='red'
              className='h-8 p-1.5 w-8 rounded-full hover:bg-red-100'
              style={{ cursor: 'pointer' }}
              onClick={() => handleDelete(record)}
            />{' '}
          </div>
        )
      }
    ]

    setDataSource(dtSrc)
    setColumns(cols)
  }, [])

  const handleOnAdd = () => {
    setPopupMode('add')
    setShowPopup(true)
  }

  const handleEdit = record => {
    setPopupMode('edit')
    setShowPopup(true)
    setPopupData(record)
  }

  const handleDelete = record => {
    console.log('handleDelete: ', record)
    const itemIndex = dataSource.findIndex((item) => item.documentId === record.documentId);
    if(itemIndex > -1) {
      const deleteItem = dataSource.splice(itemIndex, 1);
      console.log("deleteItem: ", deleteItem);
      const updatedData = dataSource.filter(item => item.documentId !== record.documentId);
      console.log("updatedData: ", updatedData);
      setDataSource(updatedData);
    }
  }

  const handleModalClose = closed => {
    setShowPopup(false)
  }

  return (
    <Container m={0} p={0} size='lg' w='100%' maw='100%'>
      {showPopup && (
        <AddEditDocument
          open={showPopup}
          data={popupData}
          handleOnClose={() => handleModalClose()}
          mode={popupMode}
        />
      )}

      <h1 className='mb-4'>Documents Page</h1>

      <DataTableWrapper
        showAddButton={true}
        id={'documentId'}
        addTitle='Document'
        columns={columns}
        dataSource={dataSource}
        handleOnAdd={() => handleOnAdd()}
      />
    </Container>
  )
}
