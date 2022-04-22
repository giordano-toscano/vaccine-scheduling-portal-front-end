import { Table } from "@mantine/core";
import { useState, useEffect } from "react";

const Schedules = () => {
    const [schedules, setSchedules] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3333/api/schedules")
            .then((response) => response.json())
            .then((data) => setSchedules(data))
            .catch((error) => console.error(error));
    }, []);

    return (
        <div>
            <h1>Schedules</h1>
            <Table highlightOnHover striped>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>name</th>
                        <th>email </th>
                        <th>birthDate </th>
                        <th>schedulingDay </th>
                        <th>schedulingTime </th>
                        <th>wasAttended</th>
                    </tr>
                </thead>
                <tbody>
                    {schedules.map((user, index) => (
                        <tr key={index}>
                            <td>{index}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.birthDate}</td>
                            <td>{user.schedulingDay}</td>
                            <td>{user.schedulingTime}</td>
                            <td>{String(user.wasAttended)}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default Schedules;
