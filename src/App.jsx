import './App.css';
import { Route, Routes, Navigate } from "react-router-dom";
import { Layout } from "./pages/layout.jsx";
import { Home } from "./pages/home.jsx";
import PageNotFound from "./pages/page-not-found.jsx";
import { Login } from "./pages/login.jsx";
import { Register } from "./pages/register.jsx";
import { UserOrders } from "./pages/orders.jsx";

function App() {
    return (
        <Routes>
            <Route path="/app" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="users" element={<UserOrders />} />
                <Route path="documents" element={<UserOrders />} />
                <Route path="medical-tests" element={<UserOrders />} />
                <Route path="health-conditions" element={<UserOrders />} />
                <Route path="medications" element={<UserOrders />} />
                <Route path="allergies" element={<UserOrders />} />
                <Route path="immunizations" element={<UserOrders />} />
                <Route path="orders" element={<UserOrders />} />
            </Route>

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path='/' element={<Navigate to="/app" />} />

            <Route path="*" element={<PageNotFound />} />
        </Routes>
    );
}

export default App;
