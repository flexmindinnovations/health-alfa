import {Outlet, useNavigate} from "react-router-dom";
import {HeaderWrapper} from "../components/header-wrapper";
import {useAuth} from "../contexts/auth.context.jsx";
import {Sidebar} from "../components/sidebar.jsx";
import {useState} from "react";

export function Layout() {
    const {isAuthenticated} = useAuth();
    const navigate = useNavigate();
    const [sidebarWidth, setSidebarWidth] = useState('8%');

    const toggleSidebar = (state) => {
        if (state) setSidebarWidth('20%');
        else setSidebarWidth('8%');
    }

    // useEffect(() => {
    //     if (!isAuthenticated) {
    //         navigate("/login");
    //     }
    // }, [isAuthenticated]);

    return <div className="layout h-full w-full grid grid-rows-[64px_1fr]" style={{gridTemplateColumns: `${sidebarWidth} 1fr`}}>
        <div className="header-wrapper row-start-1 w-full h-16 col-span-2">
            <HeaderWrapper onSidebarStateChange={(state) => toggleSidebar(state)}/>
        </div>
        <div className="left border border-solid border-0 bg-white border-r row-start-2 col-start-1">
            <Sidebar/>
        </div>
        <div className="right bg-white col-start-2 p-4">
            <Outlet/>
        </div>
    </div>
}