import { createContext, useContext } from 'react';
const defaultApiConfig = {
  user: {
    login: '',
    register: '',
    getUserDetails: '',
  },
  document: {
    getList: '/DocumentType/GetDocumentTypeList',
    saveDocument: '/DocumentType/saveDocumentType',
    updateDocument: (documentId) =>
        `/DocumentType/updateDocumentType/${documentId}`,
    deleteDocument: (documentId) =>
        `/DocumentType/deleteDocument/${documentId}`,
  },
};

const ApiConfigContext = createContext({
  apiConfig: defaultApiConfig,
  setPreferences: () => {},
});

export const ApiConfigProvider = ({ children }) => {
  const setPreferences = () => {
    let dir = localStorage.getItem('dir');
    let lng = localStorage.getItem('lng');
    if (!dir) {
      dir = 'ltr';
      localStorage.setItem('dir', dir);
    }
    if (!lng) {
      lng = 'en';
      localStorage.setItem('lng', lng);
    }
  };

  return (
      <ApiConfigContext.Provider value={{ apiConfig: defaultApiConfig, setPreferences }}>
        {children}
      </ApiConfigContext.Provider>
  );
};

export const useApiConfig = () => {
  const context = useContext(ApiConfigContext);
  if (!context) {
    throw new Error(
        'useApiConfig must be used within an ApiConfigProvider'
    );
  }
  return context;
};
