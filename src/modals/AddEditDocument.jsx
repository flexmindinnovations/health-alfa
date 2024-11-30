import { useState, useEffect } from 'react';
import ModalWrapper from '@components/Modal';
import { Container, Loader, Button } from '@mantine/core';
import Input from '@components/Input';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { useTranslation } from "react-i18next";

export function AddEditDocument({ data, mode = 'add', handleOnClose, open }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('Add Document');
  const form = useForm({
    mode: "controlled",
    initialValues: {
      documentNameEnglish: "",
      documentNameArabic: "",
    },
  });

  const [errors, setErrors] = useState({
    documentNameEnglish: "",
    documentNameArabic: "",
  })

  const [translatedText, setTranslatedText] = useState('');
  const [error, setError] = useState(null);

  const [inputs, setInputs] = useState({
    documentNameEnglish: "",
    documentNameArabic: "",
  });


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
          from: 'en',
          to: 'ar',
          q: text,
        },
      };
      const response = await axios.request(options);
      +
        setTranslatedText(response.data);
    } catch (err) {
      setError('Error translating text');
      console.error(err);
    }
  }, 500);

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));

    if (name === "documentNameEnglish") {
      setErrors((prev) => ({
        ...prev,
        [name]: value.trim() === "" ? `${t('thisFieldIsRequired')}` : "",
      }));
      debouncedTranslate(value);
    }
    if (name === "documentNameArabic") {
      setErrors((prev) => ({
        ...prev,
        [name]: value.trim() === "" ? `${t('thisFieldIsRequired')}` : "",
      }));
      debouncedTranslate(value);
    }
  };

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      console.log('Form submitted:', inputs);
      setLoading(false);
      handleOnClose();
    }, 1000);
  };

  useEffect(() => {
    const _title = mode === 'edit' ? `${t('edit')} ${t('document')}` : `${t('add')} ${t('document')}`;
    setTitle(_title);
    if (mode === 'edit' && data) {
      setInputs({
        documentNameEnglish: data.documentTypeEnglish || "",
        documentNameArabic: data.documentTypeArabic || "",
      });
    }
    setLoading(false);
  }, [mode, data, t]);

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
    <ModalWrapper isOpen={open} toggle={handleOnClose} title={title} size='md'>
      <div className="flex flex-col gap-2">
        <Input
          value={inputs.documentNameEnglish}
          onChange={handleInputChange}
          title={`${t('documentName')} ${t('english')}`}
          error={errors.documentNameEnglish}
          name="documentNameEnglish"

        />
        <Input
          value={inputs.documentNameArabic}
          onChange={handleInputChange}
          title={`${t('documentName')} ${t('arabic')}`}
          error={errors.documentNameArabic}
          name="documentNameArabic"
          disabled={true}
        />

        <div className="flex justify-end mt-4">
          <Button onClick={handleSubmit} loading={loading} disabled={loading}>
            {t('submit')}
          </Button>
        </div>
      </div>
    </ModalWrapper>
  );
}
