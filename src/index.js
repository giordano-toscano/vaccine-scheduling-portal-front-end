import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Router from "./Router";
import { NotificationsProvider } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import { ColorSchemeProvider, MantineProvider } from "@mantine/core";

ReactDOM.render(
    <MantineProvider>
        <ModalsProvider>
            <ColorSchemeProvider>
                <NotificationsProvider>
                    <Router />
                </NotificationsProvider>
            </ColorSchemeProvider>
        </ModalsProvider>
    </MantineProvider>,
    document.getElementById("root")
);
