import { useState, useEffect } from 'react';
import ModalWrapper from '@components/Modal';
import { Container, Loader, Button } from '@mantine/core';
import Input from '@components/Input';
import axios from 'axios';
import debounce from 'lodash.debounce';

export function AddEditDocument({ data, mode = 'add', handleOnClose, open }) {
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('Add Document');
  const [errors, setErrors] = useState({
    documentNameEnglish: "",
    documentNameArabic: "",
  });

  const [translatedText, setTranslatedText] = useState('');
  const [error, setError] = useState(null);

  const [inputs, setInputs] = useState({
    documentNameEnglish: "",
    documentNameArabic: "",
  });

  // Debounced translate function to prevent excessive API calls
  const debouncedTranslate = debounce(async (text) => {
    try {
      const options = {
        method: 'POST',
        url: 'https://rapid-translate-multi-traduction.p.rapidapi.com/t',
        headers: {
          'x-rapidapi-key': 'c9c7afa5c2msh95eeca710489737p171324jsn2a4da1714fe3',
          'x-rapidapi-host': 'rapid-translate-multi-traduction.p.rapidapi.com',
          'Content-Type': 'application/json',
        },
        data: {
          from: 'en',  // Language code for source language
          to: 'ar',    // Language code for target language
          q: text,     // The text you want to translate
        },
      };
      const response = await axios.request(options);
      setTranslatedText(response.data);
    } catch (err) {
      setError('Error translating text');
      console.error(err);
    }
  }, 500); // Set a 500ms delay (can be adjusted as needed)

  // Handle input change
  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));

    // If input is documentNameEnglish, trigger the debounced translate
    if (name === "documentNameEnglish") {
      setErrors((prev) => ({
        ...prev,
        [name]: value.trim() === "" ? "This field is required" : "",
      }));
      debouncedTranslate(value); // Call debounced translation
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      console.log('Form submitted:', inputs);
      setLoading(false);
      handleOnClose();
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
      <div className="flex flex-col gap-4">
        <Input
          value={inputs.documentNameEnglish}
          onChange={handleInputChange}
          title="Document Name English"
          error={errors.documentNameEnglish}
          name="documentNameEnglish"
        />
        <Input
          value={inputs.documentNameArabic}
          onChange={handleInputChange}
          title="Document Name Arabic"
          error={errors.documentNameArabic}
          name="documentNameArabic"
          disabled={true} // Document name in Arabic should be read-only while translating
        />

        {/* Submit Button */}
        <div className="flex justify-end mt-4">
          <Button onClick={handleSubmit} loading={loading} disabled={loading}>
            Submit
          </Button>
        </div>
      </div>
    </ModalWrapper>
  );
}
