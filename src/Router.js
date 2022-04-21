import Home from "./pages/Home";
import Registration from "./pages/Registration";
import Schedules from "./pages/Schedules";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

const Router = () => {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/registration" element={<Registration />} />
                    <Route path="/schedules" element={<Schedules />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
};
export default Router;
