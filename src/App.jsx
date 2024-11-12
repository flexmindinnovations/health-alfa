import './App.css';
import { Route, Routes, Navigate } from "react-router-dom";
import { Layout } from "./pages/layout.jsx";
import { Home } from "./pages/dashboard/home.jsx";
import PageNotFound from "./pages/page-not-found.jsx";
import { Login } from "./pages/login.jsx";
import { Register } from "./pages/register.jsx";
import { AboutUS } from "./pages/dashboard/AboutUS.jsx";

function App() {
    return (
        <Routes>
            <Route path="/app" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="users" element={<AboutUS />} />
                <Route path="documents" element={<AboutUS />} />
                <Route path="medical-tests" element={<AboutUS />} />
                <Route path="health-conditions" element={<AboutUS />} />
                <Route path="medications" element={<AboutUS />} />
                <Route path="allergies" element={<AboutUS />} />
                <Route path="immunizations" element={<AboutUS />} />
                <Route path="orders" element={<AboutUS />} />
            </Route>

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path='/' element={<Navigate to="/app" />} />

            <Route path="*" element={<PageNotFound />} />
        </Routes>
    );
}

export default App;
