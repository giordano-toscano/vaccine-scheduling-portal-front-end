import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Layout from "./components/Layout";
import Registrations from "./pages/Registration";
import Home from "./pages/Home";
import Schedules from "./pages/Schedules";
import Schedule from "./pages/Schedules/Schedule";

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route element={<Home />} index />
                    <Route path="/registration" element={<Registrations />} />
                    <Route path="/schedules" element={<Outlet />}>
                        <Route element={<Schedules />} index />
                        <Route element={<Schedule />} path=":scheduleId" />
                    </Route>
                    <Route path="*" element={<h1>Not found</h1>} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};
export default Router;
