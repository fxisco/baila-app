import { useState, useEffect, useContext } from "react";
import { Table, Flex, Button, Loader, ActionIcon, Tooltip, Breadcrumbs, Anchor } from "@mantine/core";
import { IconPlus, IconX } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { getErrorMessage, getSuccessMessage } from "../helpers/strings";
import { getStudentPayments, deleteStudentPayment } from "../helpers/api";
import { useNavigate } from "react-router";
import { useParams } from "react-router";
import dayjs from 'dayjs';
import { DEFAULT_DATE_FORMAT } from "../constants";
import { ConfirmationContext } from "../providers/ConfirmationProvider";

function StudentPayments() {
  const navigate = useNavigate();
  const { open: openConfirmation } = useContext(ConfirmationContext);
  const { id } = useParams();
  const [deleteInProgress, setDeleteInProgress] = useState({});
  const [student, setStudent] = useState(null);
  const [groups, setGroups] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const fetchPayments = async () => {
      try {
        const { data } = await getStudentPayments(id);
        const { payments: paymentsData, groups: groupsData, student: studentData, error } = data;

        if (error) {
          notifications.show(getErrorMessage("Error cargando pagos. Por favor refresque la página."));
          return;
        }

        setPayments(paymentsData);
        setGroups(groupsData);
        setStudent(studentData);
      } catch {
        notifications.show(getErrorMessage("Error cargando pagos. Por favor refresque la página."));
      } finally {
        setLoading(false);
      }
    }

    fetchPayments();
  }, []);

  const rows = payments.map((element) => {
    const handleDeletion = async (item) => {
      const concept = item.type === 'Unico' ? dayjs(item.date).format('MMMM YYYY') : `${dayjs(item.startDate).format('MMMM YYYY')} - ${dayjs(item.endDate).format('MMMM YYYY')}`;
      const result = await openConfirmation({
        text: `Seguro que quieres eliminar el pago <b>${concept}</b>?`,
      });

      if (result) {
        setDeleteInProgress({ ...deleteInProgress, [item._id]: true });

        try {
          await deleteStudentPayment(item._id);
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
        onClick={() => navigate(`/estudiantes/${id}/pagos/formulario/${element._id}`)}
      >
        <Table.Td>{dayjs(element.date).format(DEFAULT_DATE_FORMAT)}</Table.Td>
        <Table.Td>{groups[element.groupId].name}</Table.Td>
        <Table.Td>{element.type}</Table.Td>
        <Table.Td>
          {
            element.type === 'Unico' ? dayjs(element.startDate).format('MMMM YYYY') : `${dayjs(element.startDate).format('MMMM YYYY')} - ${dayjs(element.endDate).format('MMMM YYYY')}`
          }
          </Table.Td>
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
    <Flex direction="column">
      <Flex justify="space-between" my="sm" w="100%">
        <Breadcrumbs>
          <Anchor
            onClick={() => navigate("/estudiantes")}
            underline="never"
          >
            Estudiantes
          </Anchor>
          {id && (
            <Anchor
              onClick={() => navigate(`/estudiantes/${id}`)}
              underline="never"
            >
              {student?.firstName} {student?.lastName}
            </Anchor>
          )}
          {<Anchor underline="never">Pagos</Anchor>}
        </Breadcrumbs>
      </Flex>
      <Flex my="md" gap="md" direction={{ base: "column", md: "row" }}>
        <Flex flex={1} align="end">
          <Button
            onClick={() => navigate(`/estudiantes/${id}/pagos/formulario`)}
            variant="outline"
            color="blue"
            leftSection={<IconPlus size={14} />}
          >
            Agregar pago
          </Button>
        </Flex>
        <Flex flex={1}></Flex>
      </Flex>
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Fecha pago</Table.Th>
            <Table.Th>Grupo</Table.Th>
            <Table.Th>Tipo</Table.Th>
            <Table.Th>Concepto</Table.Th>
            <Table.Th>Acciones</Table.Th>
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
          {payments.length > 0 && rows}
        </Table.Tbody>
      </Table>
    </Flex>
  );
}

export default StudentPayments;
