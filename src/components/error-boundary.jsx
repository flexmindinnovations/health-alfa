import {useEffect, useState} from "react";

export function ErrorBoundary({children}) {
    const [hasError, setHasError] = useState(false);

    const handleError = (error, errorInfo) => {
        console.error("Error caught by Error Boundary:", error, errorInfo);
        setHasError(true);
    };

    const errorHandler = (event) => {
        const error = new Error(event.error.message);
        const errorInfo = {componentStack: event.error.stack}; // Optional: more info
        handleError(error, errorInfo);
    };

    useEffect(() => {
        window.addEventListener('error', errorHandler);
        return () => {
            window.removeEventListener('error', errorHandler);
        };
    }, []);

    if (hasError) {
        return <h1>Something went wrong.</h1>;
    }


    return children;
}