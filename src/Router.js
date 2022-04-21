import Home from "./pages/Home";
import Registration from "./pages/Registration";
import Schedules from "./pages/Schedules";

import { BrowserRouter, Routes, Route } from "react-router-dom";

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/registration" element={<Registration />} />
                <Route path="/schedules" element={<Schedules />} />
            </Routes>
        </BrowserRouter>
    );
};
export default Router;
