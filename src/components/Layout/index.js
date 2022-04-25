import { AppShell, Navbar, Header, Group, Title } from "@mantine/core";
import MainLinks from "./MainLinks";
import { Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <AppShell
            padding="md"
            navbar={
                <Navbar width={{ base: 200 }} height={500} p="xs">
                    <Navbar.Section grow mt="xs">
                        <MainLinks />
                    </Navbar.Section>
                    <Navbar.Section>{/* <User /> */}</Navbar.Section>
                </Navbar>
            }
            header={
                <Header height={60}>
                    <Group sx={{ height: "100%" }} px={20} position="left">
                        <Title order={4} align="left">
                            Vaccine Scheduling Portal
                        </Title>
                    </Group>
                </Header>
            }
            styles={(theme) => ({
                main: {
                    height: "90vh",
                    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
                },
            })}
        >
            <Outlet />
        </AppShell>
    );
};

export default Layout;
