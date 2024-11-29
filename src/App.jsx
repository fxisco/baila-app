import { AppShell, Burger, Group, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

function App() {
  const [opened, { toggle }] = useDisclosure();

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

        </AppShell.Navbar>
        <AppShell.Main></AppShell.Main>
      </AppShell>
    </>
  );
}

export default App;
