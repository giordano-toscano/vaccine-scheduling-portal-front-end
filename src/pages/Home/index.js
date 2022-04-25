import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Button } from "@mantine/core";

const Home = () => {
    const onCreateSchedule = () => {
        navigate("/schedules/new");
    };
    const navigate = useNavigate();
    return (
        <div>
            <h1>Home</h1>
            <h2>Welcome to the Vaccine Scheduling Portal ! You can start off by creating a schedule...</h2>
            <Outlet />
            <Button onClick={onCreateSchedule}>Create Schedule</Button>
        </div>
    );
};

export default Home;
