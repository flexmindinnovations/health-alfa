import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom";
import {ApiConfigProvider} from "./contexts/api-config.context.jsx";
import {AuthProvider} from "./contexts/auth.context.jsx";
import {ErrorBoundary} from "./components/error-boundary.jsx";
import {NextUIProvider} from "@nextui-org/react";
import {DeviceProvider} from "./hooks/device-detector.jsx";
import {createTheme, MantineProvider} from "@mantine/core";
import '@mantine/core/styles.css'

const theme = createTheme({
    fontFamily: `${"Poppins"}, 'sans-serif'`,
    headings: {fontFamily: `${"Poppins"}, 'sans-serif'`}
})

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <NextUIProvider className="!h-full">
                <MantineProvider theme={theme}>
                    <ErrorBoundary>
                        <ApiConfigProvider>
                            <AuthProvider>
                                <DeviceProvider>
                                    <App/>
                                </DeviceProvider>
                            </AuthProvider>
                        </ApiConfigProvider>
                    </ErrorBoundary>
                </MantineProvider>
            </NextUIProvider>
        </BrowserRouter>
    </StrictMode>,
)
