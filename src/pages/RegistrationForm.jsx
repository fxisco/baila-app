import { useState } from "react";
import {
  Flex,
  Card,
  Image,
  Text,
  Button,
  Group,
  TextInput,
  Alert
} from "@mantine/core";
import { IconInfoCircle, IconReload } from '@tabler/icons-react';
import { DatePickerInput } from '@mantine/dates';
import { createStudent } from '../helpers/api';
import { normalizeString } from '../helpers/strings';
import banner from '../assets/banner.png';

export default function RegistrationForm() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    birthdate: '',
    telephone: '',
  });

  const [state, setState] = useState('form');
  const [inProgress, setInProgress] = useState(false);

  const isFormValid = form.firstName && form.lastName && form.birthdate;

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
        firstName: '',
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
          <Card.Section>
            <div
              style={{ backgroundImage: `url(${banner})`, backgroundSize: "cover", width: "100%", height: "200px" }}
              alt="Inscríbete ahora" ></div>
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
                  value={form.firstName}
                  required
                  onChange={(e) => setForm({ ...form, firstName: normalizeString(e.target.value) })}
                />
                <TextInput
                  flex={1}
                  label="Apellido"
                  value={form.lastName}
                  required
                  onChange={(e) => setForm({ ...form, lastName: normalizeString(e.target.value) })}
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
