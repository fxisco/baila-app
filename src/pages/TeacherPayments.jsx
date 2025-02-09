import { useState, useEffect, useContext } from "react";
import dayjs from "dayjs";
import { useParams } from "react-router";
import { Flex, Text, Button, Table, Loader, Tooltip, ActionIcon } from "@mantine/core";
import { useNavigate } from "react-router";
import { IconX, IconPlus } from "@tabler/icons-react";

import { ConfirmationContext } from "../providers/ConfirmationProvider";
import { deleteTeacherPayment, getTeacherPayments } from "../helpers/api";
import { notifications } from "@mantine/notifications";
import { DEFAULT_DATE_FORMAT } from "../constants";
import { getSuccessMessage, getErrorMessage } from "../helpers/strings";
import { useAuth } from "../hooks/useAuth.jsx";

const currency = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
});

function TearcherPayment() {
  const { handleAuthError } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const { open: openConfirmation } = useContext(ConfirmationContext);
  const [teacher, setTeacher] = useState(null);
  const [payments, setPayments] = useState(null);
  const [deleteInProgress, setDeleteInProgress] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchTeachersPayments = async (teacherId) => {
      try {
        const { data } = await getTeacherPayments(teacherId);
        const { result, error } = data;
        const payload = error ? null : result;

        if (error) {
          notifications.show(getErrorMessage("Error al crear pagos de profesor. Por favor intente de nuevo."));
          return;
        }

        setTeacher(payload.teacher);
        setPayments(payload.payments);
      } catch (e) {
        handleAuthError(e);
        notifications.show(getErrorMessage("Error al cargar el profesor. Refresque la página."))
      } finally {
        setLoading(false);
      }
    };

    fetchTeachersPayments(id);
  }, []);


  const rows = (payments || []).map((element) => {
    const handleDeletion = async (item) => {
      const result = await openConfirmation({
        text: `Seguro que quieres eliminar el pago <b>${item.description}</b> de fecha <b>${dayjs(item.date).format(DEFAULT_DATE_FORMAT)}</b>?`,
      });

      if (result) {
        setDeleteInProgress({ ...deleteInProgress, [item._id]: true });

        try {
          await deleteTeacherPayment(item._id);
          setPayments(payments.filter((p) => p._id !== item._id));
          notifications.show(getSuccessMessage("Pago eliminado correctamente."));
        } catch {
          notifications.show(getErrorMessage("Error al eliminar el pago. Por favor intente de nuevo."))
        } finally {
          setDeleteInProgress({ ...deleteInProgress, [item._id]: false });
        }
      }
    }

    return (
      <Table.Tr
        key={element._id}
        style={{ cursor: "pointer" }}
        onClick={() => navigate(`/profesores/${id}/pagos/formulario/${element._id}`)}
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
              loading={!!deleteInProgress[element._id]}
              onClick={(e) => {
                e.stopPropagation();
                handleDeletion(element)
              }}
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
            <Flex my="sm" flex={1} justify="start">
              <Text size="xl" weight={700}>
                Pagos de <b>{teacher?.firstName} {teacher?.lastName}</b>
              </Text>
            </Flex>
            <Flex my="sm" flex={1} justify="start">
              <Button
                onClick={() => navigate(`/profesores/${id}/pagos/formulario`)}
                variant="outline"
                color="blue"
                leftSection={<IconPlus size={14} />}
              >
                Agregar pago
              </Button>
            </Flex>
            <Flex
              flex={1}
              mt="md"
              gap="md"
              direction={{ base: "column", md: "row" }}
            >
              {id && (
                <Table striped highlightOnHover>
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
                </Table>
              )}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}

export default TearcherPayment;
