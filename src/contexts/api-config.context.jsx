import { createContext, useContext } from 'react'

const ApiConfigContext = createContext(null)

export const ApiConfigProvider = ({ children }) => {
  const apiConfig = {
    documents:{
      getDocumentList:`/DocumentType/GetDocumentTypeList`,
      saveDocument:`/DocumentType/saveDocumentType`,
    },
    user: {
      login: ``,
      register: ``,
      getUserDetails: ``
    }
  }

  const setPrefrences = () => {
    let dir = localStorage.getItem('dir')
    let lng = localStorage.getItem('lng')
    if (!dir) {
      dir = 'ltr'
      localStorage.setItem('dir', dir)
    }
    if (!lng) {
      lng = 'en'
      localStorage.setItem('lng', lng)
    }
  }

  return (
    <ApiConfigContext.Provider value={{ apiConfig, setPrefrences }}>
      {children}
    </ApiConfigContext.Provider>
  )
}

export const useApiConfig = () => {
  const context = useContext(ApiConfigContext)
  if (!context)
    throw new Error('useApiConfig must be used within an ApiConfigProvider')
  return context
}
