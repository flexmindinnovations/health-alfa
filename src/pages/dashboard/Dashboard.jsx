
import { useDocumentTitle } from '@hooks/DocumentTitle'
import { useTranslation } from 'react-i18next'

export default function Dashboard() {
  const { t, i18n } = useTranslation()
  useDocumentTitle(t('home'))
  return (
    <div>
      <p>Welcome to Dashboard</p>
    </div>
  )
}
