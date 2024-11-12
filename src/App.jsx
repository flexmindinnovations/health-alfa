import './App.css';
import { Route, Routes, Navigate } from "react-router-dom";
import { Layout } from "./pages/layout.jsx";
import { Home } from "./pages/dashboard/home.jsx";
import PageNotFound from "./pages/page-not-found.jsx";
import { Login } from "./pages/login.jsx";
import { Register } from "./pages/register.jsx";

function App() {
    return (
        <Routes>
            <Route path="/app" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="users" element={<Home />} />
                <Route path="documents" element={<Home />} />
                <Route path="medical-tests" element={<Home />} />
                <Route path="health-conditions" element={<Home />} />
                <Route path="medications" element={<Home />} />
                <Route path="allergies" element={<Home />} />
                <Route path="immunizations" element={<Home />} />
                <Route path="orders" element={<Home />} />
            </Route>

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path='/' element={<Navigate to="/app" />} />

            <Route path="*" element={<PageNotFound />} />
        </Routes>
    );
}

export default App;
