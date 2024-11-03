import './App.css';
import {Route, Routes} from "react-router-dom";
import {Layout} from "./pages/layout.jsx";
import {Home} from "./pages/home.jsx";
import PageNotFound from "./pages/page-not-found.jsx";
import {Login} from "./pages/login.jsx";
import {Register} from "./pages/register.jsx";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout/>}>
                <Route index element={<Home/>}/>
            </Route>

            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>

            <Route path="*" element={<PageNotFound/>}/>
        </Routes>
    );
}

export default App;
