import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Table, Flex, Loader, Tooltip, ActionIcon, Chip } from "@mantine/core";
import { IconSend, IconCircleCheck } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useWhatsappNotifications } from "../hooks/useWhatsappNotifications";
import { MonthPickerInput } from "@mantine/dates";
import { getGroups, fetchGroup, getGroupPayments } from "../helpers/api";
import { getErrorMessage } from "../helpers/strings";
import { DEFAULT_DATE_FORMAT } from "../constants";
import dayjs from "dayjs";

function Groups() {
  const { id } = useParams();
  const { sendMessage } = useWhatsappNotifications();
  const [currentDate, setCurrentDate] = useState(dayjs(new Date()).startOf('month'));
  const [notificationInProgress, setNotificationInProgress] = useState({});
  const [notificationsSent, setNotificationsSent] = useState({});
  const [paymentsByStudent, setPaymentsByStudent] = useState([]);
  const [students, setStudents] = useState([]);
  const [group, setGroup] = useState([]);
  const [config, setConfig] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGroupPayments = async () => {
      try {
        const { data } = await getGroupPayments(id, {
          startDate: dayjs(currentDate).startOf('month').valueOf(),
          endDate: dayjs(currentDate).endOf('month').valueOf(),
        });
        const { payments, config, error } = data;

        if (error) {
          notifications.show(
            getErrorMessage(
              "Error cargando datos para esta fecha. Por favor intente de nuevo."
            )
          );
          return;
        }

        setPaymentsByStudent(payments.reduce((accum, item) => {
          accum[item.studentId] = item
          return accum
        }, []))

        setConfig(config)
      } catch {
        notifications.show(
          getErrorMessage(
            "Error cargando datos para esta fecha. Por favor intente de nuevo."
          )
        );
      } finally {
        setLoading(false);
      }
    };

    fetchGroupPayments()
  }, [id, currentDate])

  useEffect(() => {
    const fetchGroupById = async (groupId) => {
      try {
        const { data } = await fetchGroup(groupId);
        const { group, students: studentsData, error } = data;

        if (error) {
          notifications.show(
            getErrorMessage("Error al cargar el grupo. Refresque la página.")
          );
          return;
        }

        setStudents(studentsData);
        setGroup(group)
      } catch {
        notifications.show(
          getErrorMessage("Error al cargar el grupo. Refresque la página.")
        );
      } finally {
        setLoading(false);
      }
    };

    fetchGroupById(id);
  }, [id]);

  const rows = students.map((element) => {
    const payment = paymentsByStudent[element._id] || {}

    const concept = payment ? payment.type === 'Unico' ?
      dayjs(payment.startDate).format('MMMM YYYY') :
      `${dayjs(payment.startDate).format('MMMM YYYY')} - ${dayjs(payment.endDate).format('MMMM YYYY')}` : ''

    const status = paymentsByStudent[element._id] ? <Chip color="green" checked>Pagado</Chip> :
      dayjs().diff(currentDate, 'month') >= 1 ?
      <Chip color="red" checked>Pago atrasado</Chip> :
      <Chip color="yellow" checked>Pendiente de pago</Chip>

    const handleNotification = async (item) => {
      setNotificationInProgress({ ...notificationInProgress, [item._id]: true });

      try {
        await sendMessage(element.telephone, config.charge.replace(/_nombre_/gi, `${element.firstName} ${element.lastName}`))
        setNotificationsSent({ ...notificationsSent, [item._id]: 'success' })
      } catch {
        notifications.show(
          getErrorMessage("Error al enviar mensaje. Intente de nuevo.")
        );
      } finally {
        setNotificationInProgress({ ...notificationInProgress, [item._id]: false });
      }
    }

    return (
      <Table.Tr key={element._id} style={{ cursor: "pointer" }}>
        <Table.Td>
          {element.firstName} {element.lastName}
        </Table.Td>
        <Table.Td>
          {payment.date && dayjs(payment.date).format(DEFAULT_DATE_FORMAT)}
        </Table.Td>
        <Table.Td>{payment.startDate && concept}</Table.Td>
        <Table.Td>{status}</Table.Td>
        <Table.Td>
          <Flex gap={"sm"}>
            {notificationsSent[element._id] === "success" && (
              <Tooltip
                label="Enviado"
                position="left"
              >
                <ActionIcon
                  variant="subtle"
                  title="Enviada"
                  color="green"
                  radius="xl"
                >
                  <IconCircleCheck />
                </ActionIcon>
              </Tooltip>
            )}

            {!notificationsSent[element._id] && !paymentsByStudent[element._id] && <Tooltip
              label={`Enviar mensaje de cobro al ${element.telephone}`}
              position="left"
            >
              <ActionIcon
                variant="subtle"
                title="Enviar mensaje de cobro"
                radius="xl"
                loading={notificationInProgress[element._id]}
                onClick={() => {
                  handleNotification(element);
                }}
              >
                <IconSend />
              </ActionIcon>
            </Tooltip>}
          </Flex>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Flex direction="column">
      <Flex my="md" gap="md" direction={{ base: "column", md: "row" }}>
        <MonthPickerInput
          label="Elegir mes"
          value={currentDate}
          onChange={(value) => {
            setCurrentDate(value);
          }}
        />
      </Flex>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Nombre</Table.Th>
              <Table.Th>Fecha de pago</Table.Th>
              <Table.Th>Concepto</Table.Th>
              <Table.Th>Estado</Table.Th>
              <Table.Th>Acciones</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {currentDate.valueOf() >= group.startMonth && currentDate.valueOf() <= group.endMonth && students.length > 0 ? rows :
              <Table.Tr>
              <Table.Td colSpan="100%" ta="center">
                <Flex justify="center" w="100%">
                  Este mes el grupo no está activo
                </Flex>
              </Table.Td>
            </Table.Tr>
            }
            {loading && (
              <Table.Tr>
                <Table.Td colSpan="100%" ta="center">
                  <Flex justify="center" w="100%">
                    <Loader color="blue" type="bars" />
                  </Flex>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
    </Flex>
  );
}

export default Groups;
