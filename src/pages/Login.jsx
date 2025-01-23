import { useContext, useEffect, useState } from "react";

import {
  Button,
  Center,
  Text,
  Paper,
  Flex,
  Title,
  Anchor,
  Alert,
  Loader,
  PasswordInput,
  TextInput
} from "@mantine/core";

import { IconInfoCircle } from "@tabler/icons-react";

function GetStarted() {
  const [form, setForm] = useState({
    user: '',
    password: '',
  });
  const isValid = form.user && form.password;

  const [error, setError] = useState('');

  const handleError = ({ data = {} } = {}) => {

  };

  const handleOnSuccess = async (provider, payload) => {
    setError("");


  };

  return (
    <>
      <Center h="100vh" bg="var(--mantine-color-gray-light)">
        <Paper miw={{ base: "80%", md: 400 }} shadow="md" radius="lg" p="xl">
          <Title ta="center" order={2} mb={32}>
            Bienvenido
          </Title>
          {error && (
            <Alert
              mb={32}
              variant="light"
              color="red"
              title="Alerta"
              icon={<IconInfoCircle />}
            >
              {error}
            </Alert>
          )}
          <Flex justify="center" mb={32} direction="column">
          <Flex flex={1} gap="md" direction="column">
              <TextInput
                flex={1}
                label="Usuario"
                value={form.user}
                required
                onChange={(e) => setForm({ ...form, user: e.target.value })}
              />
              <PasswordInput
                flex={1}
                label="Contraseña"
                value={form.password}
                required
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              {isValid && <Button color="green">Entrar</Button>}
            </Flex>
          </Flex>
        </Paper>
      </Center>
    </>
  );
}

export default GetStarted;
