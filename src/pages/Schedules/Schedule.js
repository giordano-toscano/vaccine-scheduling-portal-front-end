import { Input, InputWrapper, Radio, RadioGroup, Button } from "@mantine/core";
import DatePicker from "react-datepicker";
import { parseISO, addHours, subHours } from "date-fns";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
import "react-datepicker/dist/react-datepicker.css";
import { showNotification } from "@mantine/notifications";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../services/api";
//import moment from "moment";
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
                        message: error.response.data.message || error.message,
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

    const dateAdjust = (event) => {
        console.log(form.schedulingDay);
        let schedulingDayStringISO = form.schedulingDay.toISOString();
        const [dateISO] = schedulingDayStringISO.split("T");

        if (form.schedulingTime) {
            let schedulingDateStringISO = form.schedulingTime.toISOString();
            const [, timeISO] = schedulingDateStringISO.split("T");
            schedulingDateStringISO = `${dateISO}T${timeISO}`;
            let schedulingDate = parseISO(schedulingDateStringISO); // ISO String to Date
            form.schedulingDay = subHours(schedulingDate, 0); // adds 3 hours to compensate
            form.schedulingTime = form.schedulingDay;
            console.log("Final com time: " + form.schedulingTime);
        } else {
            schedulingDayStringISO = `${dateISO}T00:00:00.000Z`;
            let schedulingDayDate = parseISO(schedulingDayStringISO); // ISO String to Date
            form.schedulingDay = addHours(schedulingDayDate, 3); // adds 3 hours to compensate
            console.log("Final sem time: " + form.schedulingDay);
        }
    };

    const onSubmit = useCallback(async () => {
        console.log("Scheduling Day: " + form.schedulingDay);
        if (form.schedulingTime) {
            console.log("Scheduling Time: " + form.schedulingTime);
        }

        /*const arrayDayMonthYear = form.schedulingDay.split("/"); // 0 1 2
        const arrayHourMinutes = form.schedulingTime.split(":"); //0 1
        const dateString = `${arrayDayMonthYear[2]}-${arrayDayMonthYear[1]}-${arrayDayMonthYear[0]}T${arrayHourMinutes[0]}:${arrayHourMinutes[1]}:00.000Z`;
        const valorString = new Date(dateString).toString();
        console.log(valorString);*/

        //console.log(form.schedulingTime instanceof Date);
        //console.log(`${form.schedulingDay}${form.schedulingTime}`); //2022-04-24T21:00:00.699Z
        form.schedulingDay = subHours(form.schedulingDay, 3); // adds 3 hours to compensate
        form.schedulingTime = form.schedulingDay;
        try {
            if (isNewSchedule) {
                await axios.post("/schedules", form);
            } else {
                await axios.put(`/schedules/${scheduleId}`, form);
            }
            //console.log(form.schedulingTime);
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
                message: error.response.data.message || error.message,
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
                onClick={(date) => {
                    dateAdjust(date);
                    onSubmit(date);
                }}
                mt={20}
            >
                {pageTitle}
            </Button>
        </div>
    );
};
export default Schedule;
