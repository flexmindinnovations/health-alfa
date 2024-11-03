import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom";
import {ApiConfigProvider} from "./contexts/api-config.context.jsx";
import {AuthProvider} from "./contexts/auth.context.jsx";
import {ErrorBoundary} from "./components/error-boundary.jsx";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <ErrorBoundary>
                <ApiConfigProvider>
                    <AuthProvider>
                        <App/>
                    </AuthProvider>
                </ApiConfigProvider>
            </ErrorBoundary>
        </BrowserRouter>
    </StrictMode>,
)
