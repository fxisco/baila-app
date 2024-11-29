import { useDisclosure } from "@mantine/hooks";
import { AppShell, Burger, Group, Title, NavLink } from "@mantine/core";
import { useLocation, useNavigate, Outlet } from "react-router";
import { IconUser, IconUsersGroup, IconReceipt2, IconUserStar } from '@tabler/icons-react';

function App() {
  const [opened, { toggle }] = useDisclosure();
  let { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <>
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 300,
          breakpoint: "sm",
          collapsed: { mobile: !opened },
        }}
        padding="md"
      >
        <AppShell.Header color="blue">
          <Group h="100%" px="md">
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <Title order={3}>Baila app</Title>
          </Group>
        </AppShell.Header>
        <AppShell.Navbar p="md">
          <NavLink
            label="Estudiantes"
            active={pathname === "/dashboard"}
            leftSection={<IconUser />}
            onClick={() => navigate("/dashboard")}
            fw="bolder"
          />
          <NavLink
            label="Grupos"
            active={pathname === "/dashboard/grupos"}
            leftSection={<IconUsersGroup />}
            onClick={() => navigate("/dashboard/grupos")}
            fw="bolder"
          />
          <NavLink
            label="Profesores"
            active={pathname === "/dashboard/profesores"}
            leftSection={<IconUserStar />}
            onClick={() => navigate("/dashboard/profesores")}
            fw="bolder"
          />
          <NavLink
            label="Servicios"
            active={pathname === "/dashboard/servicios"}
            onClick={() => navigate("/dashboard/servicios")}
            leftSection={<IconReceipt2 />}
            fw="bolder"
          />
        </AppShell.Navbar>
        <AppShell.Main>
          <Outlet />
        </AppShell.Main>
      </AppShell>
    </>
  );
}

export default App;
