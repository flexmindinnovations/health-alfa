
import { useDocumentTitle } from '@hooks/DocumentTitle'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { utils } from '@config/utils';
import { useEncrypt } from '@hooks/EncryptData.jsx';
import { AdminDashboard } from '@components/AdminDashboard';
import { DoctorDashboard } from '@components/DoctorDashboard';
import { PatientDashboard } from '@components/PatientDashboard';

export default function Dashboard() {
  const { t, i18n } = useTranslation()
  useDocumentTitle(t('home'))
  const { getEncryptedData } = useEncrypt();
  const [userType, setUserType] = useState(utils.userTypes.ADMIN);

  useEffect(() => {
    const user = getEncryptedData('roles')?.toLowerCase();
    console.log('user: ', user);

    setUserType(user);
  }, [userType])


  return (
    <div className='h-full w-full'>
      {
        userType === utils.userTypes.ADMIN ? <AdminDashboard />
          : userType === utils.userTypes.DOCTOR ? <DoctorDashboard /> 
          : <PatientDashboard />
      }
    </div>
  )
}
