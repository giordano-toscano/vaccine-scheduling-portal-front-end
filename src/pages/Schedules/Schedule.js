import { Input, InputWrapper, Radio, RadioGroup, Button } from "@mantine/core";
import DatePicker from "react-datepicker";
import { parseISO, addHours, subHours } from "date-fns";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
import "react-datepicker/dist/react-datepicker.css";
import { showNotification } from "@mantine/notifications";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../services/api";
import { useState, useCallback, useEffect } from "react";

const Schedule = () => {
    const navigate = useNavigate();
    const { scheduleId } = useParams();
    const [form, setForm] = useState({
        name: "",
        email: "",
        birthDate: "",
        schedulingDay: "",
        schedulingTime: "",
        wasAttended: "no",
    });
    const isNewSchedule = scheduleId === "new";
    const pageTitle = isNewSchedule ? "Create Schedule" : "Edit Schedule";

    const getBirthDate = (date) => {
        form.birthDate = date;
    };

    const getSchedulingDay = (date) => {
        form.schedulingDay = date;
    };

    const getSchedulingTime = (date) => {
        form.schedulingTime = date;
    };

    const [, setStartDate] = useState(new Date());

    useEffect(() => {
        if (!isNewSchedule) {
            axios
                .get(`/schedules/${scheduleId}`)
                .then((response) => {
                    const { _id, createdAt, updatedAt, __v, ...data } = response.data;
                    setForm({
                        ...data,
                        birthDate: parseISO(response.data.birthDate),
                        schedulingDay: parseISO(response.data.schedulingDay),
                        schedulingTime: addHours(parseISO(response.data.schedulingTime), 3),
                    });
                })
                .catch((error) => {
                    showNotification({
                        color: "red",
                        title: "Error",
                        message: error.response?.data?.message || error.message,
                    });
                    navigate("/schedules");
                });
        }
    }, [isNewSchedule, scheduleId, navigate]);

    const onChange = (event) => {
        setForm((prevState) => ({
            ...prevState,
            [event.target.name]: event.target.value,
        }));
    };

    //this method makes the scheduiling day (dd/MM/yyyy) and the scheduling time (HH:mm) match the same date (dd/MM/yyyy:HH:mm)
    const dateAdjust = (event) => {
        try {
            console.log("DAY: " + form.schedulingDay);
            console.log("TIME: " + form.schedulingTime);
            const dateISO = splitISOString(form.schedulingDay)[0];
            const timeISO = form.schedulingTime ? splitISOString(form.schedulingTime)[1] : "00:00:00.000Z";
            console.log("TIMEISO: " + timeISO);
            const schedulingDateStringISO = `${dateISO}T${timeISO}`;
            const schedulingDate = parseISO(schedulingDateStringISO); // ISO String to Date
            form.schedulingDay = form.schedulingTime ? schedulingDate : addHours(form.schedulingDay, 3);
            form.schedulingTime = form.schedulingTime ? schedulingDate : "";
            console.log("TIME TESTT: " + form.schedulingTime);
            console.log(
                form.schedulingTime ? "Final com time: " + form.schedulingTime : "Final sem time: " + form.schedulingDay
            );
        } catch (error) {
            showNotification({
                color: "red",
                title: "Error",
                message: error.response?.data?.message || error.message,
            });
        }
    };
    function splitISOString(schedulingDate) {
        try {
            return schedulingDate.toISOString().split("T");
        } catch (error) {
            throw new Error("Scheduling Date is Missing");
        }
    }

    const onSubmit = useCallback(async () => {
        try {
            if (form.schedulingTime) {
                console.log("Scheduling Time: " + form.schedulingTime);
                form.schedulingDay = subHours(form.schedulingDay, 3); // adds 3 hours to compensate
                form.schedulingTime = form.schedulingDay;
            } else {
                throw new Error("'Scheduling Time' is missing");
            }

            if (isNewSchedule) {
                await axios.post("/schedules", form);
            } else {
                await axios.put(`/schedules/${scheduleId}`, form);
            }
            showNotification({
                color: "green",
                title: "Success",
                message: `Schedule ${isNewSchedule ? "Created" : "Updated"} with Success`,
            });
            navigate("/schedules");
        } catch (error) {
            showNotification({
                color: "red",
                title: "Error",
                message: error.response?.data?.message || error.message,
            });
        }
    }, [form, navigate, scheduleId, isNewSchedule]);

    // console.log({ form });

    // console.log({ value: form.birthDate instanceof Date });
    //console.log({ value: form.birthDate });

    /*const [startDate, setStartDate] = useState(new Date());

    let handleColor = (time) => {
        return time.getHours() > 12 ? "text-success" : "text-error";
    };*/

    return (
        <div>
            <h1>{pageTitle}</h1>

            <InputWrapper required id="name" label="Name" mt={16}>
                <Input id="name" name="name" placeholder="John Doe" value={form.name} onChange={onChange} />
            </InputWrapper>

            <InputWrapper required id="email" label="Email" mt={16}>
                <Input id="email" name="email" placeholder="example@email.com" value={form.email} onChange={onChange} />
            </InputWrapper>

            <InputWrapper required id="birthDate" label="Birth Date" mt={16}>
                <DatePicker
                    placeholderText="Pick One"
                    maxDate={new Date()}
                    dateFormat={"dd/MM/yyyy"}
                    timeFormat="00:00:00"
                    //withPortal
                    value={form.birthDate}
                    selected={form.birthDate ? Date.parse(form.birthDate) : new Date()}
                    onChange={(date) => {
                        setStartDate(date);
                        getBirthDate(date);
                    }}
                />
            </InputWrapper>

            <InputWrapper required id="schedulingDay" label="Scheduling Day" mt={16}>
                <DatePicker
                    placeholderText="Pick One"
                    minDate={new Date()}
                    dateFormat={"dd/MM/yyyy"}
                    timeFormat="00:00:00"
                    //withPortal
                    value={form.schedulingDay}
                    selected={form.schedulingDay ? Date.parse(form.schedulingDay) : new Date()}
                    onChange={(date) => {
                        setStartDate(date);
                        getSchedulingDay(date);
                        //((value) => dateAdjust({ target: { name: "schedulingDay", value } }))();
                    }}
                />
            </InputWrapper>

            <InputWrapper required id="schedulingTime" label="Scheduling Time" mt={16}>
                <DatePicker
                    id="schedulingTime"
                    placeholderText={form.schedulingDay ? "Pick One" : "Escolha uma data primeiro"}
                    readOnly={form.schedulingDay ? false : true}
                    showTimeSelect
                    minTime={setHours(setMinutes(new Date(), 0), 6)}
                    maxTime={setHours(setMinutes(new Date(), 0), 18)}
                    showTimeSelectOnly
                    timeIntervals={60}
                    dateFormat="HH:00"
                    timeFormat="HH:00"
                    autcomplete="off"
                    withPortal
                    value={form.schedulingTime}
                    selected={form.schedulingTime ? Date.parse(form.schedulingTime) : new Date()}
                    onChange={(date) => {
                        setStartDate(date);
                        getSchedulingTime(date);
                        //((value) => dateAdjust({ target: { name: "schedulingDay", value } }))();
                    }}
                    //locale="pt-BR"
                />
            </InputWrapper>

            <RadioGroup
                required
                label="Was Attended ?"
                description="Has this schedule been concluded ?"
                value={form.wasAttended}
                onChange={(value) => onChange({ target: { name: "wasAttended", value } })}
                mt={16}
            >
                <Radio value="yes" label="Yes" disabled={isNewSchedule} />
                <Radio value="no" label="No" disabled={isNewSchedule} />
            </RadioGroup>

            {/* <DatePicker
                showTimeSelect
                minTime={setHours(setMinutes(new Date(), 0), 6)}
                maxTime={setHours(setMinutes(new Date(), 0), 18)}
                timeIntervals={60}
                dateFormat="dd/MM/yyyy HH:00"
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                timeClassName={handleColor}
            /> */}

            <Button
                onClick={() => {
                    dateAdjust();
                    onSubmit();
                }}
                mt={20}
            >
                {pageTitle}
            </Button>
        </div>
    );
};
export default Schedule;
