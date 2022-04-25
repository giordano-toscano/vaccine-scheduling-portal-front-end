import { Input, InputWrapper, Radio, RadioGroup, Button } from "@mantine/core";
import DatePicker from "react-datepicker";
import { parseISO, addHours, subHours, subDays, addDays } from "date-fns";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
import "react-datepicker/dist/react-datepicker.css";
import { showNotification } from "@mantine/notifications";
import { Form, Formik } from "formik";
import * as yup from "yup";
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

    const validationSchema = yup.object({
        name: yup
            .string()
            .required("No name provided")
            .min(3, "Name is too short. It should be at least 3 characters long")
            .matches(/^[a-zA-Z ]+$/, "Invalid name ! Please, try again ..."),
        email: yup.string().email("Invalid email ! Please, try again ...").required("No email provided"),
        birthDate: yup.date("Invalid birth date").max(new Date()).required("No birth date provided"),
        schedulingDay: yup
            .date("Invalid scheduling date")
            .min(new Date().toString(), "Não pode ser no passado !")
            .required("No scheduling date provided"),
        schedulingTime: yup.date("Invalid scheduling time").required("No scheduling time provided"),
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
                    showErrorNotification(error);
                    navigate("/schedules");
                });
        }
    }, [form, isNewSchedule, scheduleId, navigate]); //

    const onChange = (event) => {
        setForm((prevState) => ({
            ...prevState,
            [event.target.name]: event.target.value,
        }));
    };

    // This method makes the scheduiling day (dd/MM/yyyy) and the scheduling time (HH:mm) match the same date (dd/MM/yyyy:HH:mm)
    const dateAdjust = (event) => {
        try {
            const dateISO = splitISOString(form.schedulingDay)[0];
            const timeISO = form.schedulingTime ? splitISOString(form.schedulingTime)[1] : "00:00:00.000Z";
            const schedulingDateStringISO = `${dateISO}T${timeISO}`;
            let schedulingDate = parseISO(schedulingDateStringISO); // ISO String to Date
            schedulingDate = subDays(schedulingDate, 1);
            form.schedulingDay = schedulingDate;
            form.schedulingTime = form.schedulingTime ? schedulingDate : "";
        } catch (error) {
            showErrorNotification(error);
        }
    };

    function splitISOString(schedulingDate) {
        try {
            return schedulingDate.toISOString().split("T");
        } catch (error) {
            throw new Error("Scheduling Date is Missing");
        }
    }

    function showErrorNotification(error) {
        showNotification({
            color: "red",
            title: "Error",
            message: error.response?.data?.message || error.message,
        });
    }

    const onSubmit = useCallback(async () => {
        try {
            if (isNewSchedule) {
                form.schedulingTime = subHours(form.schedulingTime, 3);
                form.schedulingDay = form.schedulingTime;
            } else {
                if (form.schedulingTime) {
                    form.schedulingDay = addDays(form.schedulingDay, 1); // adds 3 hours to compensate
                    form.schedulingTime = subHours(form.schedulingDay, 3);
                    form.schedulingDay = form.schedulingTime;
                } else {
                    throw new Error("'Scheduling Time' is missing");
                }
            }

            const timePath = await axios.get(`/schedules/date/${form.schedulingDay}/${form.schedulingTime}`);
            let quantityinThisTime = timePath.data.item;
            const datePath = await axios.get(`/schedules/date/${form.schedulingDay}`);
            let quantityInThisDate = datePath.data.item;

            if (quantityinThisTime >= 2) throw new Error("You cannot create more than 2 entries for the same time !");

            if (quantityInThisDate >= 20) throw new Error("You cannot create more than 20 entries for the same time !");

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
        } catch (error) {
            showErrorNotification(error);
        }
        navigate("/schedules");
    }, [form, navigate, scheduleId, isNewSchedule]);

    return (
        <div>
            <h1>{pageTitle}</h1>

            <Formik initialValues={form} enableReinitialize validationSchema={validationSchema}>
                {({ handleBlur, errors, touched, values }) => {
                    return (
                        <Form>
                            <InputWrapper required id="name" label="Name" mt={16}>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="John Doe"
                                    value={form.name}
                                    onChange={onChange}
                                    onBlur={handleBlur}
                                />
                                {errors.name && touched.name ? (
                                    <div style={{ color: "red", fontSize: 12 }}>{errors.name}</div>
                                ) : null}
                            </InputWrapper>

                            <InputWrapper required id="email" label="Email" mt={16}>
                                <Input
                                    id="email"
                                    name="email"
                                    placeholder="example@email.com"
                                    value={form.email}
                                    onChange={onChange}
                                    onBlur={handleBlur}
                                />
                                {errors.email && touched.email ? (
                                    <div style={{ color: "red", fontSize: 12 }}>{errors.email}</div>
                                ) : null}
                            </InputWrapper>

                            <InputWrapper required id="birthDate" label="Birth Date" mt={16}>
                                <DatePicker
                                    placeholderText="Pick One"
                                    maxDate={new Date()}
                                    dateFormat={"dd/MM/yyyy"}
                                    timeFormat="00:00:00"
                                    value={form.birthDate}
                                    selected={form.birthDate ? Date.parse(form.birthDate) : new Date()}
                                    onChange={(date) => {
                                        setStartDate(date);
                                        getBirthDate(date);
                                    }}
                                />
                                {errors.birthDate && (
                                    <div style={{ color: "red", fontSize: 12 }}>{errors.birthDate}</div>
                                )}
                            </InputWrapper>

                            <InputWrapper required id="schedulingDay" label="Scheduling Day" mt={16}>
                                <DatePicker
                                    placeholderText="Pick One"
                                    //minDate={new Date()}
                                    dateFormat={"dd/MM/yyyy"}
                                    timeFormat="00:00:00"
                                    withPortal
                                    value={form.schedulingDay}
                                    selected={form.schedulingDay ? Date.parse(form.schedulingDay) : new Date()}
                                    onChange={(date) => {
                                        setStartDate(date);
                                        getSchedulingDay(date);
                                    }}
                                />
                                {errors.schedulingDay && (
                                    <div style={{ color: "red", fontSize: 12 }}>{errors.schedulingDay}</div>
                                )}
                            </InputWrapper>

                            <InputWrapper required id="schedulingTime" label="Scheduling Time" mt={16}>
                                <DatePicker
                                    id="schedulingTime"
                                    placeholderText={form.schedulingDay ? "Pick One" : "Choose a date first"}
                                    readOnly={form.schedulingDay ? false : true}
                                    showTimeSelect
                                    minTime={setHours(setMinutes(new Date(), 0), 6)}
                                    maxTime={setHours(setMinutes(new Date(), 0), 18)}
                                    showTimeSelectOnly
                                    timeIntervals={60}
                                    dateFormat="HH:00"
                                    timeFormat="HH:mm"
                                    autocomplete={false}
                                    withPortal
                                    value={form.schedulingTime}
                                    selected={form.schedulingTime ? Date.parse(form.schedulingTime) : new Date()}
                                    onChange={(date) => {
                                        setStartDate(date);
                                        getSchedulingTime(date);
                                        //((value) => dateAdjust({ target: { name: "schedulingDay", value } }))();
                                    }}
                                />
                                {errors.schedulingTime && (
                                    <div style={{ color: "red", fontSize: 12 }}>{errors.schedulingTime}</div>
                                )}
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

                            <Button
                                onClick={() => {
                                    dateAdjust();
                                    onSubmit();
                                }}
                                mt={20}
                            >
                                {pageTitle}
                            </Button>
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );
};
export default Schedule;
