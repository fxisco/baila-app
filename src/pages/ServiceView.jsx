import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { useParams } from "react-router";
import { Flex, Text, TextInput, Skeleton, Button, Table, Loader, Tooltip, ActionIcon } from "@mantine/core";
import { useNavigate } from "react-router";
import { IconX } from "@tabler/icons-react";

import { normalizeString } from "../helpers/strings";
import { createService, fetchService, updateService } from "../helpers/api";
import { notifications } from "@mantine/notifications";
import { DEFAULT_DATE_FORMAT } from "../constants";
import { getSuccessMessage, getErrorMessage } from "../helpers/strings";

const currency = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
});

function ServiceView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [payments, setPayments] = useState(null);
  const [loading, setLoading] = useState(false);
  const [originalService, setOriginalService] = useState(null);
  const isDirty = JSON.stringify(service) !== JSON.stringify(originalService);
  const isFormValid = service?.name;

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchServiceById = async (serviceId) => {
      try {
        const { data } = await fetchService(serviceId);
        const { service: serviceData, payments: paymentsData, error } = data;
        const fetchedGroup = error ? null : serviceData;

        setOriginalService(fetchedGroup);
        setService(fetchedGroup);
        setPayments(paymentsData)
      } catch {
        notifications.show(getErrorMessage("Error al cargar el servicio. Refresque la página."))
      } finally {
        setLoading(false);
      }
    };

    fetchServiceById(id);
  }, []);

  const handleCreation = async () => {
    setLoading(true);

    try {
      const { data } = await createService(service);
      const { error } = data;

      if (error) {
        notifications.show(getErrorMessage("Error al crear el servicio. Por favor intente de nuevo."))
      } else {
        setOriginalService(service);
        notifications.show(getSuccessMessage("Servicio creado correctamente."));
        navigate('/servicios');
      }
    } catch {
      notifications.show(getErrorMessage("Error al crear el servicio. Por favor intente de nuevo."))
    } finally {
      setLoading(false);
    }
  }

  const handleUpdate = async () => {
    setLoading(true);

    try {
      const { data } = await updateService(id, service);
      const { error } = data;

      if (error) {
        notifications.show(getErrorMessage("Error al actualizar el servicio. Por favor intente de nuevo."))
      } else {
        setOriginalService(service);
        notifications.show(getSuccessMessage("Servicio actualizado correctamente."));
      }
    } catch {
      notifications.show(getErrorMessage("Error al actualizar el servicio. Por favor intente de nuevo."))
    } finally {
      setLoading(false);
    }
  }

  const rows = (payments || []).map((element) => {
    return (
      <Table.Tr
        key={element._id}
        style={{ cursor: "pointer" }}
        onClick={() => navigate(`/servicio/${element._id}`)}
      >
        <Table.Td>{element.description}</Table.Td>
        <Table.Td>{dayjs(element.date).format(DEFAULT_DATE_FORMAT)}</Table.Td>
        <Table.Td>{currency.format(element.amount)}</Table.Td>
        <Table.Td>
          <Tooltip label="Eliminar pago" position="left">
            <ActionIcon
              variant="subtle"
              title="Eliminar pago"
              color="red"
              radius="xl"
              // onClick={(e) => handleNavigation(e, `/servicios/${element._id}/pagos`)}
            >
              <IconX />
            </ActionIcon>
          </Tooltip>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <>
      <Flex
        direction="column"
        align="center"
        justify="center"
        mt={{ md: "xl" }}
      >
        <Flex
          maw={800}
          w="100%"
          justify="center"
          align="center"
          direction="column"
        >
          <Flex justify="space-between" my="sm" w="100%" direction="column">
            <Flex flex={1} gap="md" direction={{ base: "column", md: "row" }}>
              <Skeleton visible={loading && !service} flex={1}>
                <TextInput
                  label="Nombre de servicio"
                  value={service?.name}
                  required
                  onChange={(e) =>
                    setService({
                      ...service,
                      name: normalizeString(e.target.value),
                    })
                  }
                />
              </Skeleton>
              <Flex flex={1}></Flex>
            </Flex>
            <Flex flex={1} mt="md" gap="md" direction={{ base: "column", md: "row" }}>
              {id && <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Descripción</Table.Th>
                    <Table.Th>Fecha</Table.Th>
                    <Table.Th>Monto</Table.Th>
                    <Table.Th>Acción</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {loading && (
                    <Table.Tr>
                      <Table.Td colSpan="100%" ta="center">
                        <Flex justify="center" w="100%">
                          <Loader color="blue" type="bars" />
                        </Flex>
                      </Table.Td>
                    </Table.Tr>
                  )}
                  {rows.length > 0 && rows}
                  {rows.length === 0 && !loading && (
                      <Table.Tr>
                        <Table.Td colSpan="100%" ta="center">
                          <Text fw={700} size="sm" my="xl">
                            Ningún pago encontrado
                          </Text>
                        </Table.Td>
                      </Table.Tr>
                    )}
                </Table.Tbody>
              </Table>}
            </Flex>
          </Flex>
          {isFormValid && isDirty && (
            <Flex justify="center" my="sm" flex={1} align="center">
              <Button
                color="green"
                loading={loading}
                disabled={loading}
                onClick={id ? handleUpdate : handleCreation}
              >
                {id ? "Actualizar" : "Guardar"}
              </Button>
            </Flex>
          )}
        </Flex>
      </Flex>
    </>
  );
}

export default ServiceView;
