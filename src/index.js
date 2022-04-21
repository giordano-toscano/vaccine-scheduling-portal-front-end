import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Router from "./Router";
import { ColorSchemeProvider, MantineProvider } from "@mantine/core";

ReactDOM.render(
    <MantineProvider>
        <ColorSchemeProvider>
            <Router />
        </ColorSchemeProvider>
    </MantineProvider>,
    document.getElementById("root")
);
