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
import {
  createTheme,
  MantineProvider,
  DirectionProvider,
  Loader
} from '@mantine/core'
import RingLoader from '@components/RingLoader'
import '@mantine/core/styles.css'
import 'mantine-datatable/styles.layer.css'

function AppWrapper () {
  const theme = createTheme({
    fontFamily: `${'Poppins'}, 'sans-serif'`,
    headings: { fontFamily: `${'Poppins'}, 'sans-serif'` },
    colors: {
      brand: [
        '#effafc',
        '#d6f1f7',
        '#b2e4ef',
        '#7dcee3',
        '#41b0cf',
        '#2594b5',
        '#227798',
        '#22617c',
        '#245066',
        '#224557',
        '#143345'
      ],
      primary: [
        '#fff9ea',
        '#ffeec5',
        '#ffdc86',
        '#ffc346',
        '#ffab1c',
        '#f17e01',
        '#e16000',
        '#bb3e02',
        '#973009',
        '#7c280b',
        '#481100'
      ],
      secondary: [
        '#e6f0ff',
        '#cce0ff',
        '#99c2ff',
        '#66a3ff',
        '#3385ff',
        '#0066ff',
        '#0059e6',
        '#004dcc',
        '#0040b3',
        '#003399'
      ]
    },
    primaryColor: 'brand',
    primaryShade: 9,
    components: {
      Loader: Loader.extend({
        defaultProps: {
          loaders: { ...Loader.defaultLoaders, ring: RingLoader },
          type: 'ring'
        }
      })
    }
  })

  return (
    <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
      <App />
    </MantineProvider>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <DirectionProvider>
        <NextUIProvider className='!h-full'>
          <ErrorBoundary>
            <ApiConfigProvider>
              <AuthProvider>
                <DeviceProvider>
                  <AppWrapper />
                </DeviceProvider>
              </AuthProvider>
            </ApiConfigProvider>
          </ErrorBoundary>
        </NextUIProvider>
      </DirectionProvider>
    </BrowserRouter>
  </StrictMode>
)
