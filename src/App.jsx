import { useDisclosure } from "@mantine/hooks";
import { AppShell, Burger, Group, Title, NavLink } from "@mantine/core";
import { useLocation, useNavigate, Outlet } from "react-router";
import { IconUser, IconUsersGroup, IconReceipt2, IconUserStar } from '@tabler/icons-react';

function App() {
  const [opened, { toggle, close }] = useDisclosure();
  let { pathname } = useLocation();
  const rootPath = pathname.split("/")[1];
  const navigate = useNavigate();

  const handleNavigation = (route) => {
    close();
    navigate(route);
  }

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
            <Title order={3}>Escuela Salsa Santiago</Title>
          </Group>
        </AppShell.Header>
        <AppShell.Navbar p="md">
          <NavLink
            label="Estudiantes"
            active={rootPath === "estudiantes"}
            leftSection={<IconUser />}
            onClick={() => handleNavigation("/estudiantes")}
            fw="bolder"
          />
          <NavLink
            label="Grupos"
            active={rootPath === "grupos"}
            leftSection={<IconUsersGroup />}
            onClick={() => handleNavigation("/grupos")}
            fw="bolder"
          />
          <NavLink
            label="Profesores"
            active={rootPath === "profesores"}
            leftSection={<IconUserStar />}
            onClick={() => handleNavigation("/profesores")}
            fw="bolder"
          />
          <NavLink
            label="Servicios"
            active={rootPath === "servicios"}
            onClick={() => handleNavigation("/servicios")}
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
