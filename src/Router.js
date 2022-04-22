import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Registration from "./pages/Registration";
import Home from "./pages/Home";
import Schedules from "./pages/Schedules";

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route element={<Home />} index />
                    <Route path="/registration" element={<Registration />} />
                    <Route path="/schedules" element={<Schedules />} />
                    <Route path="*" element={<h1>Not found</h1>} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};
export default Router;
