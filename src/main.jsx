import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ApiConfigProvider } from '@contexts/ApiConfigContext'
import { AuthProvider } from '@contexts/AuthContext'
import { ErrorBoundary } from '@components/ErrorBoundary'
import { NextUIProvider } from '@nextui-org/react'
import { DeviceProvider } from '@hooks/device-detector'
import './i18n'
import { createTheme, DirectionProvider, Loader, MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import RingLoader from '@components/RingLoader'
import '@mantine/core/styles.css'
import 'mantine-datatable/styles.layer.css'
import '@mantine/notifications/styles.css'

export const notificationAudio = new Audio('/sounds/notification.wav')
notificationAudio.load()

const theme = createTheme({
    // fontFamily: `'Poppins', sans-serif`,
    // headings: { fontFamily: `'Poppins', sans-serif` },
    colors: {
        brand: [
            '#effafc', '#d6f1f7', '#b2e4ef', '#7dcee3', '#41b0cf',
            '#2594b5', '#227798', '#22617c', '#245066', '#224557', '#143345'
        ],
        primary: [
            '#fff9ea', '#ffeec5', '#ffdc86', '#ffc346', '#ffab1c',
            '#f17e01', '#e16000', '#bb3e02', '#973009', '#7c280b', '#481100'
        ],
        secondary: [
            '#e6f0ff', '#cce0ff', '#99c2ff', '#66a3ff', '#3385ff',
            '#0066ff', '#0059e6', '#004dcc', '#0040b3', '#003399'
        ]
    },
    primaryColor: 'brand',
    primaryShade: 9,
    components: {
        Loader: Loader.extend({
            defaultProps: {
                loaders: { ...Loader.defaultLoaders, ring: RingLoader },
                type: 'ring',
                size: 'xl'
            }
        }),
        TextInput: {
            defaultProps: {
                radius: 'md'
            }
        },
        Button: {
            defaultProps: {
                radius: 'sm',
                loaderProps: { h: '48px', w: '48px' }
            },
        },
        Modal: {
            defaultProps: {
                styles: {
                    inner: {
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        translate: '-50% -50%'
                    }
                }
            }
        }
    }
})

function AppWrapper() {
    return (
        <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
            <Notifications position='top-right' zIndex={9999} />
            <Suspense>
                <App />
            </Suspense>
        </MantineProvider>
    )
}

const container = document.getElementById('root')
const root = createRoot(container)

root.render(
    <StrictMode>
        <BrowserRouter
            future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true
            }}
        >
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
