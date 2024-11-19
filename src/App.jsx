import './App.css';
import {lazy, Suspense, useEffect} from 'react';
import {useDirection} from '@mantine/core';
import {useTranslation} from 'react-i18next';
import {Route, Routes} from 'react-router-dom';
import {Layout} from '@pages/Layout.jsx';
import {useApiConfig} from '@contexts/api-config.context';

const PublicLayout = lazy(() => import('@pages/PublicLayout'));
const PageNotFound = lazy(() => import('@pages/PageNotFound'));
const Login = lazy(() => import('@pages/Login'));
const Register = lazy(() => import('@pages/Register'));
const Home = lazy(() => import('@pages/Home'));
const Dashboard = lazy(() => import('@pages/dashboard/Dashboard'));
const Allergies = lazy(() => import('@pages/dashboard/Allergies'));
const Users = lazy(() => import('@pages/dashboard/Users'));
const Documents = lazy(() => import('@pages/dashboard/Documents'));
const MedicalTests = lazy(() => import('@pages/dashboard/MedicalTests'));
const HealthConditions = lazy(() => import('@pages/dashboard/HealthConditions'));
const Medications = lazy(() => import('@pages/dashboard/Medications'));
const Immunizations = lazy(() => import('@pages/dashboard/Immunizations'));
const AboutUs = lazy(() => import('@pages/AboutUs'));
const ContactUs = lazy(() => import('@pages/ContactUs'));

function App() {
    const {setDirection} = useDirection();
    const {i18n} = useTranslation();
    const {setPreferences} = useApiConfig();

    useEffect(() => {
        setPreferences();
        const direction = i18n.dir();
        setDirection(direction);
    }, [i18n, setDirection, setPreferences]);

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Routes>
                <Route path='/app' element={<Layout/>}>
                    <Route index element={<Dashboard/>}/>
                    <Route path='users' element={<Users/>}/>
                    <Route path='documents' element={<Documents/>}/>
                    <Route path='medical-tests' element={<MedicalTests/>}/>
                    <Route path='health-conditions' element={<HealthConditions/>}/>
                    <Route path='medications' element={<Medications/>}/>
                    <Route path='allergies' element={<Allergies/>}/>
                    <Route path='immunizations' element={<Immunizations/>}/>
                    <Route path='about-us' element={<AboutUs/>}/>
                    <Route path='contact-us' element={<ContactUs/>}/>
                </Route>

                <Route path='/login' element={<Login/>}/>
                <Route path='/register' element={<Register/>}/>

                <Route path='/' element={<PublicLayout/>}>
                    <Route index element={<Home/>}/>
                    <Route path='about-us' element={<AboutUs/>}/>
                    <Route path='contact-us' element={<ContactUs/>}/>
                </Route>

                <Route path='*' element={<PageNotFound/>}/>
            </Routes>
        </Suspense>
    );
}

export default App;
