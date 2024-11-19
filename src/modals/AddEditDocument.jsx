import ModalWrapper from '@components/Modal';
import { useState, useEffect } from 'react';
import { Container, Loader, Button } from '@mantine/core';
import Input from '@components/Input'; // Your custom Input component

export function AddEditDocument({ data, mode = 'add', handleOnClose, open }) {
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('Add Document');
  const [error, setError] = useState('');
  
  const [documentName, setDocumentName] = useState(data?.documentName || ''); // manage document name state

  // Handle input change
  const handleInputChange = (value) => {
    setDocumentName(value);
  };

  // Handle form submission
  const handleSubmit = () => {
    setLoading(true);

    // Simulate an API call or form processing
    setTimeout(() => {
      console.log('Form submitted:', { documentName });
      setLoading(false);
      handleOnClose(); // Close modal after form submission
    }, 1000);
  };

  useEffect(() => {
    const _title = mode === 'edit' ? 'Edit Document' : 'Add Document';
    setTitle(_title);
    setLoading(false);
  }, [mode]);

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
          height: '100vh',
        }}
      >
        <Loader />
      </Container>
    );
  }

  return (
    <ModalWrapper isOpen={open} toggle={handleOnClose} title={title}>
      <div className="p-4">
        {/* Document Name Input */}
        <Input
          value={documentName}
          onChange={handleInputChange}
          title="Document Name"
          placeholder="Enter document name" // Show error message for validation
        />

        {/* Submit Button */}
        <div className="mt-4">
          <Button
            onClick={handleSubmit}
            fullWidth
            loading={loading}
            disabled={loading}
          >
            Submit
          </Button>
        </div>
      </div>
    </ModalWrapper>
  );
}
