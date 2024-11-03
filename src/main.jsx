import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom";
import {ApiConfigProvider} from "./contexts/api-config.context.jsx";
import {AuthProvider} from "./contexts/auth.context.jsx";
import {ErrorBoundary} from "./components/error-boundary.jsx";
import {NextUIProvider} from "@nextui-org/react";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <NextUIProvider className="!h-full">
                <ErrorBoundary>
                    <ApiConfigProvider>
                        <AuthProvider>
                            <App/>
                        </AuthProvider>
                    </ApiConfigProvider>
                </ErrorBoundary>
            </NextUIProvider>
        </BrowserRouter>
    </StrictMode>,
)
