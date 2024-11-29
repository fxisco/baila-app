import { useDisclosure } from "@mantine/hooks";
import { AppShell, Burger, Group, Title, NavLink } from "@mantine/core";
import { useLocation } from "react-router";
import { IconUser, IconUsersGroup, IconReceipt2, IconUserStar } from '@tabler/icons-react';

function App() {
  const [opened, { toggle }] = useDisclosure();
  let { pathname } = useLocation()

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
            active={pathname === "/"}
            leftSection={<IconUser />}
            fw="bolder"
          />
          <NavLink
            label="Grupos"
            active={pathname === "/grupos"}
            leftSection={<IconUsersGroup />}
            fw="bolder"
          />
          <NavLink
            label="Profesores"
            active={pathname === "/profesores"}
            leftSection={<IconUserStar />}
            fw="bolder"
          />
          <NavLink
            label="Servicios"
            active={pathname === "/servicios"}
            leftSection={<IconReceipt2 />}
            fw="bolder"
          />
        </AppShell.Navbar>
        <AppShell.Main></AppShell.Main>
      </AppShell>
    </>
  );
}

export default App;
