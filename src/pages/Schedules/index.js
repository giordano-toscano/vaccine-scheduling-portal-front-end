import { showNotification } from "@mantine/notifications";
import { Table, Button, Text, Code } from "@mantine/core";
import { Pencil, Trash } from "tabler-icons-react";
import { useNavigate } from "react-router-dom";
import { parseISO, addHours, addDays } from "date-fns";
import { useModals } from "@mantine/modals"; //
import { useState, useEffect } from "react";
import axios from "../../services/api";
import moment from "moment";

const Schedules = () => {
    const modals = useModals();
    const navigate = useNavigate();
    const [schedules, setSchedules] = useState([]);

    useEffect(() => {
        axios
            .get("/schedules")
            .then((response) => setSchedules(response.data))
            .catch((error) => console.error(error));
    }, []);

    const openConfirmModal = (id) =>
        modals.openConfirmModal({
            title: "Please confirm your action",
            children: <Text size="sm">Are you sure you want to remove this schedule?</Text>,
            labels: { confirm: "Confirm", cancel: "Cancel" },
            onCancel: () => {},
            onConfirm: () => onRemoveSchedule(id),
        });

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
                            <th>ID</th>
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
                                <td>
                                    <Code>{schedule._id}</Code>
                                </td>
                                <td>{schedule.name}</td>
                                <td>{schedule.email}</td>
                                <td>{moment(schedule.birthDate).format("DD/MM/YYYY")}</td>
                                <td>{moment(addDays(parseISO(schedule.schedulingDay), 1)).format("DD/MM/YYYY")}</td>
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
                                        variant="filled"
                                        color="red"
                                        onClick={() => openConfirmModal(schedule._id)}
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
