import './App.css'
import { useEffect } from 'react'
import { useDirection } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { Route, Routes, Navigate } from 'react-router-dom'
import { Layout } from '@pages/Layout.jsx'
import PageNotFound from './pages/PageNotFound.jsx'
import { Login } from '@pages/Login.jsx'
import { Register } from '@pages/Register.jsx'
import { Home } from '@pages/Home'
import { Dashboard } from '@pages/dashboard/Dashboard'
import { Allergies } from '@pages/dashboard/Allergies'
import { Users } from '@pages/dashboard/Users'
import { Documents } from '@pages/dashboard/Documents'
import { MedicalTests } from '@pages/dashboard/MedicalTests'
import { HealthConditions } from '@pages/dashboard/HealthConditions'
import { Medications } from '@pages/dashboard/Medications'
import { Immunizations } from '@pages/dashboard/Immunizations'
import { AboutUs } from '@pages/AboutUs'
import { ContactUs } from '@pages/ContactUs'

function App () {
  const { setDirection } = useDirection()
  const { i18n } = useTranslation()

  useEffect(() => {
    const dir = localStorage.getItem('dir') || 'ltr'
    const lng = localStorage.getItem('lng') || 'en'
    setDirection(dir)
    i18n.changeLanguage(lng)
  }, [])

  return (
    <Routes>
      <Route path='/app' element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path='users' element={<Users />} />
        <Route path='documents' element={<Documents />} />
        <Route path='medical-tests' element={<MedicalTests />} />
        <Route path='health-conditions' element={<HealthConditions />} />
        <Route path='medications' element={<Medications />} />
        <Route path='allergies' element={<Allergies />} />
        <Route path='immunizations' element={<Immunizations />} />
        <Route path='about-us' element={<AboutUs />} />
        <Route path='contact-us' element={<ContactUs />} />
      </Route>

      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />

      <Route path='/' element={<Navigate to='/app' />} />
      {/* <Route path='/' element={<Home />} /> */}

      <Route path='*' element={<PageNotFound />} />
    </Routes>
  )
}

export default App
