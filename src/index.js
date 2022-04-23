import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Router from "./Router";
import { NotificationsProvider } from "@mantine/notifications";
import { ColorSchemeProvider, MantineProvider } from "@mantine/core";

ReactDOM.render(
    <MantineProvider>
        <ColorSchemeProvider>
            <NotificationsProvider>
                <Router />
            </NotificationsProvider>
        </ColorSchemeProvider>
    </MantineProvider>,
    document.getElementById("root")
);
