import {Outlet, useNavigate} from "react-router-dom";
import {HeaderWrapper} from "../components/header-wrapper";
import {useAuth} from "../contexts/auth.context.jsx";
import {useEffect} from "react";

export function Layout() {
    const {isAuthenticated} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
        }
    }, [isAuthenticated]);

    return <div className="layout">
        <HeaderWrapper/>
        <Outlet/>
    </div>
}