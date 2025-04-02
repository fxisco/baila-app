import { useState, useEffect } from "react";
import { Flex, Button, Text, Textarea, Alert, Paper, Title } from "@mantine/core";
import { IconInfoCircle } from '@tabler/icons-react';
import { updateConfig, fetchConfig } from "../helpers/api";
import { notifications } from "@mantine/notifications";
import { getSuccessMessage, getErrorMessage } from "../helpers/strings";

const DEFAULT_STATE = {
  welcome: '',
  charge: '',
}

function Configuration() {
  const [form, setForm] = useState(DEFAULT_STATE);
  const [originaForm, setOriginalForm] = useState(DEFAULT_STATE);
  const [loading, setLoading] = useState(false);
  const isDirty = JSON.stringify(form) !== JSON.stringify(originaForm);
  const isFormValid = form?.welcome && form?.charge;

  useEffect(() => {
    const fetchConfiguration = async () => {
      try {
        setLoading(true);
        const { data } = await fetchConfig();

        setForm({
          welcome: data.result.welcome,
          charge: data.result.charge,
        });
      } catch (error) {
        console.log("::ERROR", error);
      } finally {
        setLoading(false);
      }
    }

    fetchConfiguration()
  }, []);

  const handleUpdate = async () => {
    setLoading(true);

    try {
      const { data } = await updateConfig(form);
      const { error } = data;

      if (error) {
        notifications.show(getErrorMessage("Error al actualizar configuraciones. Por favor intente de nuevo."))
      } else {
        setOriginalForm(form);
        notifications.show(getSuccessMessage("Configuraciones actulizadas correctamente."));
      }
    } catch {
      notifications.show(getErrorMessage("Error al actualizar configuraciones. Por favor intente de nuevo."))
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      <Flex
        direction="column"
        align="center"
        justify="center"
        mt={{ md: "xl" }}
      >
        <Flex
          maw={500}
          w="100%"
          justify="center"
          align="center"
          direction="column"
        >
          <Flex justify="space-between" my="sm" w="100%">
            <Flex flex={1} gap="md" direction="column">
              <Alert variant="light" color="lime" title="Importante" icon={<IconInfoCircle />}>
                Para incluir nombre en el mensaje, utilice la palabra _nombre_ en el mensaje.
                <br /><br />Ejemplo: Hola _nombre_, bienvenido a la plataforma.
                <br />
                El mensaje dirá: Hola Juan, bienvenido a la plataforma.
              </Alert>
              <Textarea
                label="Mensaje de bienvenida"
                autosize
                minRows={2}
                value={form.welcome}
                onChange={(e) =>
                  setForm({
                    ...form,
                    welcome: e.target.value,
                  })
                }
              />
              {form.welcome &&
              <Flex direction="column" gap="sm">
                <Title order={6}>Vista previa mensaje bienvenida</Title>
                <Paper shadow="xs" p="md">
                  <Text>{form.welcome.replace(/_nombre_/gi, 'Juan')}</Text>
                </Paper>
              </Flex>
              }

              <Textarea
                label="Mensaje de cobro"
                value={form.charge}
                autosize
                minRows={2}
                onChange={(e) =>
                  setForm({
                    ...form,
                    charge: e.target.value,
                  })
                }
              />
              {form.charge &&
              <Flex direction="column" gap="sm">
                <Title order={6}>Vista previa mensaje cobro</Title>
                <Paper shadow="xs" p="md">
                  <Text>{form.charge.replace(/_nombre_/gi, 'Juan')}</Text>
                </Paper>
              </Flex>
              }
            </Flex>
          </Flex>
          <Flex justify="center" my="sm" flex={1} align="center">
            {isFormValid && isDirty && (
              <Button
                color="green"
                loading={loading}
                disabled={loading}
                onClick={handleUpdate}
              >
                Actualizar
              </Button>
            )}
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}

export default Configuration;
