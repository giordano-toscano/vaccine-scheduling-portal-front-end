import { Input, InputWrapper, Radio, RadioGroup, Button, Select } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import { DatePicker } from "@mantine/dates";
import axios from "../../services/api";
import moment from "moment";
import { useState, useCallback } from "react";

const Schedule = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        email: "",
        birthDate: "",
        schedulingDay: "",
        schedulingTime: "",
        wasAttended: "no",
    });

    const onChange = (event) => {
        setForm((prevState) => ({
            ...prevState,
            [event.target.name]: event.target.value,
        }));
    };
    /*const changeDay = (event) => {
        setForm((prevState) => ({
            ...prevState,
            [event.target.value]: `${moment(form.schedulingDay).format("YYYY-MM-DD")}T${form.schedulingTime}:00.000Z`,
        }));
    };*/

    const onSubmit = useCallback(async () => {
        try {
            await axios.post("/schedules", form);
            showNotification({
                color: "green",
                title: "Success",
                message: "Schedule Created with Success",
            });
            navigate("/schedules");
        } catch (error) {
            showNotification({
                color: "red",
                title: "Error",
                message: error.message,
            });
        }
    }, [form, navigate]);

    console.log({ form });

    return (
        <div>
            <h1>Create Schedule</h1>

            <InputWrapper id="name" required label="Name" description="Full Name">
                <Input id="name" name="name" placeholder="John Doe" value={form.name} onChange={onChange} />
            </InputWrapper>

            <InputWrapper id="email" required label="Email" mt={16}>
                <Input id="email" name="email" placeholder="example@email.com" value={form.email} onChange={onChange} />
            </InputWrapper>

            <DatePicker
                placeholder="Pick Date"
                label="Birth Date"
                required
                clearable={false}
                value={form.birthDate}
                onChange={(value) => onChange({ target: { name: "birthDate", value } })}
                mt={16}
            />

            <DatePicker
                placeholder="Pick Date"
                label="Scheduling Day"
                required
                clearable={false}
                value={form.schedulingDay}
                //onDropdownClose={(value) => changeDay({ target: { name: "schedulingTime", value } })}
                onChange={(value) => onChange({ target: { name: "schedulingDay", value } })}
                mt={16}
            />

            <Select
                label="Scheduling Time"
                placeholder="Pick one"
                disabled={form.schedulingDay ? false : true}
                data={[
                    { value: `${moment(form.schedulingDay).format("YYYY-MM-DD")}T13:00:00.000Z`, label: "13:00" },
                    { value: `2022-05-26T14:00:00.000Z`, label: "14:00" },
                    { value: `2022-05-26T15:00:00.000Z`, label: "15:00" },
                    { value: `2022-05-26T16:00:00.000Z`, label: "16:00" },
                    { value: `2022-05-26T17:00:00.000Z`, label: "17:00" },
                    { value: `2022-05-26T18:00:00.000Z`, label: "18:00" },
                    { value: `2022-05-26T19:00:00.000Z`, label: "19:00" },
                    { value: `2022-05-26T20:00:00.000Z`, label: "20:00" },
                ]}
                onChange={(value) => onChange({ target: { name: "schedulingTime", value } })}
                mt={16}
            />

            <RadioGroup
                required
                label="Was Attended ?"
                description="Has this schedule been concluded ?"
                value={form.wasAttended}
                onChange={(value) => onChange({ target: { name: "wasAttended", value } })}
                mt={16}
            >
                <Radio value="yes" label="Yes" />
                <Radio value="no" label="No" />
            </RadioGroup>

            <Button onClick={onSubmit} mt={20}>
                Create Schedule
            </Button>
        </div>
    );
};
export default Schedule;
