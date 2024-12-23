import {createContext, useContext} from 'react'
import {useDirection} from '@mantine/core'
import {useTranslation} from 'react-i18next'

const defaultApiConfig = {
    appConfig: {
        opacity: '0.4'
    },
    translate: `http://localhost:5000/translate`,
    auth: {
        login: `/User/SignIn`,
        register: ``,
        getUserDetails: ``
    },
    clients: {
        getList: `/ClientPersonalInfo/getClientPersonalInfoList`,
        updateUserImage: (id) => `/ClientPersonalInfo/UpdateProfileImage?ClientId=${id}`,
        save: `/ClientPersonalInfo/saveClientPersonalInfo`,
        update: (id) => `/ClientPersonalInfo/updateClientPersonalInfo/${id}`
    },
    doctors: {
        getList: `/Doctor/getDoctorList`,
        getDoctorInfoById: (id) => `/Doctor/getDoctorInfoById/${id}`,
        getAvailability: `/DoctorTiming/GetDoctorTimingList`,
        getAvailabilityById: (doctorId) => `/DoctorTiming/GetDoctorTimingByDoctorId/${doctorId}`,
        updateAvailability: (doctorTimingId) => `/DoctorTiming/updateDoctorTiming/${doctorTimingId}`,
        updateDoctorImage: (id) => `/Doctor/UpdateDoctorProfileImage?doctorId=${id}`,
        save: `/Doctor/SignUp`,
        saveDoctorAvailability: `/DoctorTiming/saveDoctorTiming`,
        updateDoctorAvailability: `DoctorTiming/updateDoctorTiming`,
        getTimeSlots: (doctorId, dayOfWeek, requestedDate) => `/api/DoctorTiming/GetTimeSlots/${doctorId}/${dayOfWeek}/${requestedDate}`,
        update: (id) => `/Doctor/UpdateDoctorPersonalInfo/${id}`
    },
    patientVisits: {
        getList: `/PatientVisit/GetPatientVisitList`
    },
    testTypes: {
        getList: `/TestType/getTestTypeList`
    },
    document: {
        getList: `/DocumentType/GetDocumentTypeList`,
        saveDocument: `/DocumentType/saveDocumentType`,
        updateDocument: documentId =>
            `/DocumentType/updateDocumentType/${documentId}`,
        deleteDocument: documentId => `/DocumentType/deleteDocument/${documentId}`
    }
}

const ApiConfigContext = createContext({
    apiConfig: defaultApiConfig,
    setPreferences: () => {
    }
})

export const ApiConfigProvider = ({children}) => {
    const {setDirection} = useDirection()
    const {i18n} = useTranslation()

    const setPreferences = () => {
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

        setDirection(dir)
        i18n.changeLanguage(lng)
    }

    return (
        <ApiConfigContext.Provider
            value={{apiConfig: defaultApiConfig, setPreferences}}
        >
            {children}
        </ApiConfigContext.Provider>
    )
}

export const useApiConfig = () => {
    const context = useContext(ApiConfigContext)
    if (!context) {
        throw new Error('useApiConfig must be used within an ApiConfigProvider')
    }
    return context
}
