import { showNotification } from "@mantine/notifications";
import { Pencil, Trash } from "tabler-icons-react";
import { useNavigate } from "react-router-dom";
import { Table, Button } from "@mantine/core";
import { useState, useEffect } from "react";
import axios from "../../services/api";
import moment from "moment";

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
            showNotification({ color: "red", title: "Error", message: error.response.data.message }); //Failed to remove the schedule
        }
    };

    return (
        <div>
            <h1>Schedules ({schedules.length})</h1>
            <Button onClick={onCreateSchedule}>Create Schedule</Button>
            <Table highlightOnHover mt={12} striped>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email </th>
                        <th>Birth Date </th>
                        <th>Day</th>
                        <th>Time</th>
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
                            <td>{moment(schedule.schedulingTime).format("HH:mm")}</td>
                            <td>{schedule.wasAttended ? "Yes" : "No"}</td>
                            <td>
                                <Button leftIcon={<Pencil />} variant="white" color="grey">
                                    Edit user
                                </Button>

                                <Button
                                    leftIcon={<Trash />}
                                    ml={16}
                                    onClick={() => onRemoveSchedule(schedule._id)}
                                    variant="white"
                                    color="red"
                                >
                                    Remove user
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default Schedules;
