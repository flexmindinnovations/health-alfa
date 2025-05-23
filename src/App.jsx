import './App.css';
import { lazy, Suspense, useEffect } from 'react';
import { useDirection } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { Route, Routes } from 'react-router-dom';
import { Layout } from '@pages/Layout.jsx';
import { useApiConfig } from '@contexts/ApiConfigContext.jsx';
import { AppLoader } from "@components/AppLoader.jsx";
import { useAuth } from '@contexts/AuthContext';

const PublicLayout = lazy(() => import('@pages/PublicLayout'));
const PageNotFound = lazy(() => import('@pages/PageNotFound'));
const Login = lazy(() => import('@pages/Login'));
const Register = lazy(() => import('@pages/Register'));
const Home = lazy(() => import('@pages/Home'));
const Dashboard = lazy(() => import('@pages/dashboard/Dashboard'));
const Doctors = lazy(() => import('@pages/dashboard/Doctors'));
const PatientVisits = lazy(() => import('@pages/dashboard/PatientVisits'));
const TestTypes = lazy(() => import('@pages/dashboard/TestTypes'));
const Allergies = lazy(() => import('@pages/dashboard/Allergies'));
const Clients = lazy(() => import('@pages/dashboard/Clients'));
const Documents = lazy(() => import('@pages/dashboard/Documents'));
const MedicalTests = lazy(() => import('@pages/dashboard/MedicalTests'));
const HealthConditions = lazy(() => import('@pages/dashboard/HealthConditions'));
const Medications = lazy(() => import('@pages/dashboard/Medications'));
const Immunizations = lazy(() => import('@pages/dashboard/Immunizations'));
const AboutUs = lazy(() => import('@pages/AboutUs'));
const ContactUs = lazy(() => import('@pages/ContactUs'));
const Availability = lazy(() => import('@dashboard/Availability.jsx'));
const Roles = lazy(() => import('@dashboard/Roles.jsx'));
const Appointments = lazy(() => import('@dashboard/Appointments.jsx'));
const AppointmentDetails = lazy(() => import('@dashboard/AppointmentDetails'));
const DoctorPrescription = lazy(() => import('@dashboard/DoctorPrescription'));
const AddEditAppointment = lazy(() => import('@dashboard/AddEditAppointment'));
const AppointmentHistory = lazy(() => import('@dashboard/AppointmentHistory'));
const PrescriptionList = lazy(() => import('@dashboard/PrescriptionList'));
const PatientDoctorHistory = lazy(() => import('@dashboard/PatientDoctorHistory'));
const PrescriptionDetails = lazy(() => import('@dashboard/PrescriptionDetails'));
const AppointmentRowDetails = lazy(() => import('@dashboard/AppointmentRowDetails'));

function App() {
    const { setDirection } = useDirection();
    const { i18n } = useTranslation();
    const { setPreferences } = useApiConfig();
    const { fetchUserDetails } = useAuth();

    useEffect(() => {
        setPreferences();
        const direction = i18n.dir();
        setDirection(direction);
        fetchUserDetails();
    }, [i18n.language, setDirection]);

    return (
        <Suspense fallback={<AppLoader />}>
            <Routes>
                <Route path='/app' element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path='clients' element={<Clients />} />
                    <Route path='doctors' element={<Doctors />} />
                    <Route path='availability' element={<Availability />} />
                    <Route path='patients' element={<PatientVisits />} />
                    <Route path='roles' element={<Roles />} />
                    <Route path='appointments' element={<Appointments />} />
                    <Route path='book-appointment' element={<AddEditAppointment />} />
                    <Route path='appointments/details/:appointmentId' element={<AppointmentDetails />} />
                    <Route path='appointments/details/all/:appointmentId' element={<AppointmentRowDetails />} />
                    <Route path='appointments/lookup/:doctorId/:patientId' element={<AppointmentHistory />} />
                    <Route path='prescription' element={<PrescriptionList />} />
                    <Route path='prescription/lookup/:doctorId/:patientId' element={<PatientDoctorHistory />} />
                    <Route path='prescription/details/:visitId' element={<PrescriptionDetails />} />
                    <Route path='tests' element={<TestTypes />} />
                    <Route path='documents' element={<Documents />} />
                    <Route path='medical-tests' element={<MedicalTests />} />
                    <Route path='health-conditions' element={<HealthConditions />} />
                    <Route path='medications' element={<Medications />} />
                    <Route path='allergies' element={<Allergies />} />
                    <Route path='immunizations' element={<Immunizations />} />
                    {/* <Route path='about-us' element={<AboutUs/>}/>
                    <Route path='contact-us' element={<ContactUs/>}/> */}
                    <Route path='*' element={<PageNotFound />} />
                </Route>

                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />

                <Route path='/' element={<PublicLayout />}>
                    <Route index element={<Home />} />
                    <Route path='about-us' element={<AboutUs />} />
                    <Route path='contact-us' element={<ContactUs />} />
                </Route>

                <Route path='*' element={<PageNotFound />} />
            </Routes>
        </Suspense>
    );
}

export default App;