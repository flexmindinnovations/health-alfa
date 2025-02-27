import {StrictMode, Suspense} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
import {ApiConfigProvider} from '@contexts/ApiConfigContext'
import {AuthProvider} from '@contexts/AuthContext'
import {ErrorBoundary} from '@components/ErrorBoundary'
import {DeviceProvider} from '@hooks/DeviceDetector.jsx'
import './i18n'
import {DirectionProvider, MantineProvider} from '@mantine/core'
import {Notifications} from '@mantine/notifications'
import '@mantine/core/styles.css'
import 'mantine-datatable/styles.layer.css'
import '@mantine/notifications/styles.css'
import '@mantine/carousel/styles.css';
import '@mantine/dates/styles.css';
import {ModalsProvider} from "@mantine/modals";
import {PermissionsProvider} from "@contexts/Permission.jsx";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import {theme} from './theme';

export const notificationAudio = new Audio('/sounds/notification.wav')
notificationAudio.load();

function AppWrapper() {
    return (
        <MantineProvider
            theme={theme}
            withGlobalStyles
            withNormalizeCSS
        >
            <Notifications position='top-center' zIndex={9999}/>
            <ModalsProvider
                modalProps={{
                    withCloseButton: false,
                    radius: 'lg',
                }}
            >
                <Suspense>
                    <App/>
                </Suspense>
            </ModalsProvider>
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
                <ErrorBoundary>
                    <ApiConfigProvider>
                        <PermissionsProvider>
                            <AuthProvider>
                                <DeviceProvider>
                                    <AppWrapper/>
                                </DeviceProvider>
                            </AuthProvider>
                        </PermissionsProvider>
                    </ApiConfigProvider>
                </ErrorBoundary>
            </DirectionProvider>
        </BrowserRouter>
    </StrictMode>
)
