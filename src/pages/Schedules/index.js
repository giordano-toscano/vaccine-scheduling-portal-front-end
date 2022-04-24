import { showNotification } from "@mantine/notifications";
import { Pencil, Trash } from "tabler-icons-react";
import { useNavigate } from "react-router-dom";
import { Table, Button } from "@mantine/core";
import { useState, useEffect } from "react";
import axios from "../../services/api";
import moment from "moment";
import { parseISO, addHours } from "date-fns";

const Schedules = () => {
    const navigate = useNavigate();
    const [schedules, setSchedules] = useState([]);

    useEffect(() => {
        axios
            .get("/schedules")
            .then((response) => setSchedules(response.data))
            .catch((error) => console.error(error));
    }, []);

    const onCreateSchedule = () => {
        navigate("new");
    };
    const onRemoveSchedule = async (id) => {
        try {
            await axios.delete(`/schedules/${id}`);
            setSchedules(schedules.filter((schedule) => schedule._id !== id));
            showNotification({ color: "green", title: "Success", message: "Schedule Removed with Success" });
        } catch (error) {
            console.error(error);
            showNotification({ color: "red", title: "Error", message: error.response.data.message || error.message }); //Failed to remove the schedule
        }
    };

    const sortSchedules = () => {
        schedules.sort((a, b) => {
            return (
                new Date(a.schedulingDate) - new Date(b.schedulingDate) ||
                new Date(a.schedulingTime) - new Date(b.schedulingTime)
            );
        });
    };

    return (
        <div>
            <h1>Schedules ({schedules.length})</h1>
            <Button onClick={onCreateSchedule}>Create Schedule</Button>
            <>
                {sortSchedules()}
                <Table highlightOnHover horizontalSpacing="xl" mt={12} striped>
                    <thead>
                        <tr>
                            <th>Nº</th>
                            <th>Name</th>
                            <th>Email </th>
                            <th>Birth Date </th>
                            <th>Scheduling Day</th>
                            <th>Scheduling Time</th>
                            <th>Was Attended ?</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {schedules.map((schedule, index) => (
                            <tr key={index}>
                                <td>{index}</td>
                                <td>{schedule.name}</td>
                                <td>{schedule.email}</td>
                                <td>{moment(schedule.birthDate).format("DD/MM/YYYY")}</td>
                                <td>{moment(schedule.schedulingDay).format("DD/MM/YYYY")}</td>
                                <td>{moment(addHours(parseISO(schedule.schedulingTime), 3)).format("HH:00")}</td>
                                <td>{schedule.wasAttended === "yes" ? "Yes" : "No"}</td>
                                <td>
                                    <Button
                                        mb={8}
                                        fullWidth={true}
                                        leftIcon={<Pencil />}
                                        size="sm"
                                        onClick={() => navigate(schedule._id)}
                                        variant="filled"
                                        color="grey"
                                    >
                                        Edit schedule
                                    </Button>

                                    <Button
                                        fullWidth={true}
                                        leftIcon={<Trash />}
                                        size="sm"
                                        mb={8}
                                        onClick={() => onRemoveSchedule(schedule._id)}
                                        variant="filled"
                                        color="red"
                                    >
                                        Remove schedule
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </>
        </div>
    );
};

export default Schedules;
