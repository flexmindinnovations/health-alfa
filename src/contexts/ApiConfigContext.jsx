import { createContext, useContext } from 'react'
import { useDirection } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { utils } from '@config/utils';


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
    admin: {
        getAdminInfoById: (id) => `/Admin/getAdminInfoById/${id}`
    },
    clients: {
        getList: `/ClientPersonalInfo/getClientPersonalInfoList`,
        updateUserImage: (id) => `/ClientPersonalInfo/UpdateProfileImage?ClientId=${id}`,
        save: `/ClientPersonalInfo/saveClientPersonalInfo`,
        update: (id) => `/ClientPersonalInfo/updateClientPersonalInfo/${id}`,
        clientInfo: (clientId) => `/ClientPersonalInfo/getClientInfoById/${clientId}`
    },
    doctors: {
        getList: `/Doctor/getDoctorList`,
        getDoctorInfoById: (id) => `/Doctor/getDoctorInfoById/${id}`,
        getAvailability: `/DoctorTiming/GetDoctorTimingList`,
        getAvailabilityById: (doctorId) => `/DoctorTiming/GetDoctorTimingByDoctorId/${doctorId}`,
        updateAvailability: (doctorTimingId) => `/DoctorTiming/updateDoctorTiming/${doctorTimingId}`,
        updateDoctorImage: (id) => `/Doctor/UpdateDoctorProfileImage?doctorId=${id}`,
        save: `/Doctor/SignUp`,
        getDoctorTimingByDoctorIdAndDayWise: (doctorId, dayName) => `/DoctorTiming/GetDoctorTimingByDoctorIdAndDayWise?doctorId=${doctorId}&dayName=${dayName}`,
        saveDoctorAvailability: `/DoctorTiming/saveDoctorTiming`,
        updateDoctorAvailability: `DoctorTiming/updateDoctorTiming`,
        getTimeSlots: (doctorId, dayOfWeek, requestedDate) => `/DoctorTiming/GetTimeSlots/${doctorId}/${dayOfWeek}/${requestedDate}`,
        update: (id) => `/Doctor/UpdateDoctorPersonalInfo/${id}`
    },
    patientVisits: {
        getList: `/PatientVisit/GetPatientVisitList`,
        getPatientVisitInfoByVisitId: (id) => `/PatientVisit/getPatientVisitInfoByVisitId/${id}`,
        getPatientVisitListDoctorWise: (doctorId) => `/PatientVisit/getPatientVisitListDoctorWise/${doctorId}`,
        savePatientVisit: `/PatientVisit/SavePatientVisit`,
        updatePatientVisit: (visitId) => `/PatientVisit/updatePatientVisit/${visitId}`
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
    },
    appointment: {
        getList: `/Appointment/GetAppointmentList`,
        getAppointmentDetailsById: (appointmentId) => `/Appointment/GetAppointmentDetailsById/${appointmentId}`,
        getAppointmentListByPatientIdId: (patientId) => `/Appointment/GetAppointmentListByPatientIdWise/${patientId}`,
        getAppointmentListByDoctorId: (doctorId) => `/Appointment/GetAppointmentListByDoctorIdWise/${doctorId}`,
        bookAppointment: `/Appointment/BookAppointment`,
        getAppointmentByStatusAndPatientId: (patientId, status = utils.appointmentStatus.COMPLETED) => `Appointment/GetAppointmentListByPatientAndAppointmentStatusWise/${patientId}/${status}`,
        getAppointmentByStatusAndDoctorId: (doctorId, status = utils.appointmentStatus.COMPLETED) => `/api/Appointment/GetAppointmentListByDoctorAndAppointStatusWise/${doctorId}/${status}`
    },
    medicine: {
        getList: (pageNumber = 1, pageSize = 10, query = '') => `/Medicine/getMedicineList?pageNumber=${pageNumber}&pageSize=${pageSize}&searchTerm=${query}`,
        getMedicineListByType: (
            medicineType,
            pageNumber,
            pageSize,
            searchTerm
        ) =>
            `/Medicine/getMedicineListByType/${medicineType}?pageNumber=${pageNumber}&pageSize=${pageSize}&searchTerm=${searchTerm}`,
    },
    medicineType: {
        getList: `/MedicineType/GetMedicineTypeList`,
    },
    prescription: {
        savePrescription: `/DoctorPrescription/saveDoctorPrescription`
    },
    doctorPrescription: {
        saveDoctorPrescription: `/DoctorPrescription/saveDoctorPrescription`,
    },
}

const ApiConfigContext = createContext({
    apiConfig: defaultApiConfig,
    setPreferences: () => {
    }
})

export const ApiConfigProvider = ({ children }) => {
    const { setDirection } = useDirection()
    const { i18n } = useTranslation()

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
            value={{ apiConfig: defaultApiConfig, setPreferences }}
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
