import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ApiConfigProvider } from './contexts/api-config.context.jsx'
import { AuthProvider } from './contexts/auth.context.jsx'
import { ErrorBoundary } from './components/error-boundary.jsx'
import { NextUIProvider } from '@nextui-org/react'
import { DeviceProvider } from './hooks/device-detector.jsx'
import './i18n'
import { createTheme, MantineProvider, DirectionProvider } from '@mantine/core'
import '@mantine/core/styles.css'


const theme = createTheme({
  fontFamily: `${'Poppins'}, 'sans-serif'`,
//   colors: ['#143345'],
//   primaryColor: 'primary',
  headings: { fontFamily: `${'Poppins'}, 'sans-serif'` }
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <DirectionProvider>
        <NextUIProvider className='!h-full'>
          <MantineProvider theme={theme}>
            <ErrorBoundary>
              <ApiConfigProvider>
                <AuthProvider>
                  <DeviceProvider>
                    <App />
                  </DeviceProvider>
                </AuthProvider>
              </ApiConfigProvider>
            </ErrorBoundary>
          </MantineProvider>
        </NextUIProvider>
      </DirectionProvider>
    </BrowserRouter>
  </StrictMode>
)
