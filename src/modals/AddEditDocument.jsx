import ModalWrapper from '@components/Modal'
import { useState, useEffect } from 'react'
import { Container, Loader } from '@mantine/core'
import { useForm } from "@mantine/form";

export function AddEditDocument ({ data, mode = 'add' | 'edit', handleOnClose, open }) {
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('Add Document');
  const form = useForm({
      mode: "controlled",
      initialValues: {
      },
  });

  useEffect(() => {
    const _title = mode === 'edit' ? 'Edit Document' : 'Add Document'
    setTitle(_title)
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <Container
        m={0}
        p={0}
        px={10}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}
      >
        {' '}
        <Loader />{' '}
      </Container>
    )
  }

  return <ModalWrapper isOpen={open} toggle={handleOnClose} title={title}>

  </ModalWrapper>
}
