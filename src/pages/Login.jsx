import { useState } from "react";
import {
  Button,
  Center,
  Paper,
  Flex,
  Title,
  PasswordInput,
  TextInput
} from "@mantine/core";

import { notifications } from "@mantine/notifications";

import { login } from "../helpers/api";
import { getErrorMessage } from "../helpers/strings";
import { useAuth } from "../hooks/useAuth.jsx";

function GetStarted() {
  const { logUser } = useAuth();
  const [progress, setProgress] = useState(false);
  const [form, setForm] = useState({
    username: '',
    password: '',
  });
  const isValid = form.username && form.password;

  const handleLogin = async () => {
    try {
      setProgress(true);
      const { data } = await login(form);
      const { user, error } = data;

      if (error) {
        notifications.show(getErrorMessage("Error con el usuario/contraseña. Intente de nuevo."))
        return;
      }

      logUser(user);
    } catch {
      notifications.show(getErrorMessage("Error autenticando usuario. Por favor intente de nuevo."))
    } finally {
      setProgress(false);
    }
  };

  return (
    <>
      <Center h="100vh" bg="var(--mantine-color-gray-light)">
        <Paper miw={{ base: "80%", md: 400 }} shadow="md" radius="lg" p="xl">
          <Title ta="center" order={2} mb={32}>
            Bienvenido
          </Title>
          <Flex justify="center" mb={32} direction="column">
          <Flex flex={1} gap="md" direction="column">
              <TextInput
                flex={1}
                label="Usuario"
                value={form.username}
                required
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
              <PasswordInput
                flex={1}
                label="Contraseña"
                value={form.password}
                required
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              {isValid && <Button loading={progress} color="green" onClick={handleLogin}>Entrar</Button>}
            </Flex>
          </Flex>
        </Paper>
      </Center>
    </>
  );
}

export default GetStarted;
