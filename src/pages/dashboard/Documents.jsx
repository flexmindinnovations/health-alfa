import { useEffect, useState, Suspense } from 'react'
import { Container, Loader } from '@mantine/core'
import { useDocumentTitle } from '@hooks/DocumentTitle'
import { useTranslation } from 'react-i18next'
import { DataTableWrapper } from '@components/DataTableWrapper'
import { AddEditDocument } from '@modals/AddEditDocument'
import { useApiConfig } from '@contexts/api-config.context'
import useHttp from '@hooks/axios-instance'

export function Documents () {
  const { t, i18n } = useTranslation()
  useDocumentTitle(t('documents'))
  const [columns, setColumns] = useState()
  const [dataSource, setDataSource] = useState([])
  const [popupMode, setPopupMode] = useState('add')
  const [showPopup, setShowPopup] = useState(false)
  const [popupData, setPopupData] = useState()
  const { apiConfig } = useApiConfig()
  const [loading, setLoading] = useState(true)
  const http = useHttp()

  useEffect(() => {
    if (i18n.isInitialized) {
      setColumns([
        {
          accessor: 'documentTypeId',
          title: t('documentId'),
          width: 350,
          style: { padding: '10px' }
        },
        {
          accessor: 'documentTypeEnglish',
          title: t('documentName'),
          width: 'auto',
          style: { padding: '10px', flex: 1 }
        },
        {
          accessor: 'documentTypeArabic',
          title: t('documentName'),
          width: 'auto',
          style: { padding: '10px', flex: 1 }
        }
      ])
      const getDocumentList = async () => {
        try {
          const response = await http.get(apiConfig.document.getList)
          if (response?.status === 200) {
            const data = response['data']
            setDataSource(data)
            setLoading(false)
          }
        } catch (err) {
          setLoading(false)
          console.log(err)
        }
      }
      getDocumentList()
    }
  }, [i18n.language])

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
    const itemIndex = dataSource.findIndex(
      item => item.documentTypeId === record.documentTypeId
    )

    if (itemIndex > -1) {
      const deleteItem = dataSource.splice(itemIndex, 1)
      const updatedData = dataSource.filter(
        item => item.documentTypeId !== record.documentTypeId
      )
      setDataSource(updatedData)
    }
  }

  const handleModalClose = closed => {
    setShowPopup(false)
  }

  if (loading) {
    return (
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
    )
  }

  return (
    <Container m={0} p={0} size='lg' w='100%' maw='100%' h='100%'>
      {showPopup && (
        <AddEditDocument
          open={showPopup}
          data={popupData}
          handleOnClose={() => handleModalClose()}
          mode={popupMode}
        />
      )}

      <DataTableWrapper
        loading={loading}
        showAddButton={true}
        id={'documentTypeId'}
        addTitle={t('document')}
        columns={columns}
        dataSource={dataSource}
        handleOnAdd={() => handleOnAdd()}
        handleOnDelete={data => handleDelete(data)}
        handleOnEdit={data => handleEdit(data)}
      />
    </Container>
  )
}