import { useState, useEffect } from "react";
import {
  Title,
  Flex,
  Card,
  Image,
  Text,
  Badge,
  Button,
  Group,
  TextInput,
  Alert
} from "@mantine/core";
import { IconInfoCircle, IconReload } from '@tabler/icons-react';
import { DatePickerInput } from '@mantine/dates';
import { createStudent } from '../helpers/api';

export default function RegistrationForm() {
  const [form, setForm] = useState({
    name: '',
    lastName: '',
    birthdate: '',
    telephone: '',
  });

  const [state, setState] = useState('form');
  const [inProgress, setInProgress] = useState(false);

  const isFormValid = form.name && form.lastName && form.birthdate;

  const handleSubmit = async () => {
    setInProgress(true);

    try {
      await createStudent(form);
      setState('success');
    } catch {
      setState('error');
    } finally {
      setInProgress(false);
      setForm({
        name: '',
        lastName: '',
        birthdate: '',
        telephone: '',
      });
    }
  }

  return (
    <Flex direction="column" align="center" justify="center" mt={{ md: "xl" }}>
      <Flex maw={1080} w="100%" justify="center" align="center" direction="column">
        <Card shadow="sm" padding="lg" radius="md" withBorder w={{ base: "100%", md: "80%" }}>
          <Card.Section component="a" href="https://mantine.dev/">
            <Image
              src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"
              height={160}
              alt="Norway"
            />
          </Card.Section>

          <Group justify="space-between" my="md">
            <Text fw={500}>Formulario registro de estudiante</Text>
          </Group>
          {state === 'error' &&
            <Flex align="center" my="md" gap="md" direction="column">
              <Alert variant="filled" color="red" radius="md" title="Error al agregar usuario. Por favor intente de nuevo." icon={<IconInfoCircle />} />
              <Button variant="outline" w="fit-content" color="blue" onClick={() => setState('form')} leftSection={<IconReload size={14} />}>Intentar de nuevo</Button>
            </Flex>
          }
          {(state === 'form') && <>
            <Flex justify="space-between" my="sm" flex={1}>
              <Flex flex={1} gap="md" direction={{ base: 'column', md: 'row' }}>
                <TextInput
                  flex={1}
                  label="Nombre"
                  value={form.name}
                  required
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <TextInput
                  flex={1}
                  label="Apellido"
                  value={form.lastName}
                  required
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                />
              </Flex>
            </Flex>
            <Flex justify="space-between" my="sm" flex={1}>
              <Flex flex={1} gap="md" direction={{ base: 'column', md: 'row' }}>
                <DatePickerInput
                  flex={1}
                  label="Fecha de nacimiento"
                  required
                  value={form.birthdate ? new Date(form.birthdate) : null}
                  maxDate={new Date()}
                  onChange={(value) => setForm({ ...form, birthdate: value.getTime() })}
                />
                <TextInput
                  flex={1}
                  label="Whatsapp"
                  value={form.telephone}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      telephone: e.target.value.replace(/[^0-9\-]/g, "")
                    })
                  }
                />
              </Flex>
            </Flex>
            {isFormValid && <Flex justify="center" my="sm" flex={1} align="center">
              <Button loading={inProgress} color="green" onClick={handleSubmit}>Guardar</Button>
            </Flex>}
          </>}
          {state === 'success' &&
            <Flex justify="center" my="md">
              <Alert variant="filled" color="green" radius="md" title="Estudiante agregado de manera exitosa" icon={<IconInfoCircle />} />
            </Flex>
          }
        </Card>
      </Flex>
    </Flex>
  );
}
