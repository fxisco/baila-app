import { useState, useEffect, useContext } from "react";
import { Title, Table, ActionIcon, Flex,Checkbox, Tooltip, Text, TextInput, Button, Loader } from "@mantine/core";
import { IconPlus, IconReceipt2, IconCircleCheck, IconCircleCheckFilled, IconCancel, IconRefresh } from "@tabler/icons-react";
import dayjs from "dayjs";
import { ConfirmationContext } from "../providers/ConfirmationProvider";
import { useNavigate } from "react-router";
import { useWhatsappNotifications } from "../hooks/useWhatsappNotifications";
import { useDebouncedCallback } from '@mantine/hooks';
import { DEFAULT_DATE_FORMAT } from "../constants";
import { notifications } from "@mantine/notifications";
import { searchStudent, fetchRecents, updateStudent, deleteStudent } from '../helpers/api';
import { getSuccessMessage, getErrorMessage } from "../helpers/strings";

function Students() {
  const navigate = useNavigate();
  const { open: openConfirmation } = useContext(ConfirmationContext);
  const { sendMessage } = useWhatsappNotifications();
  const [users, setUsers] = useState([]);
  const [recents, setRecents] = useState([]);
  const [updateInProgress, setUpdateInProgress] = useState({});
  const [deleteInProgress, setDeleteInProgress] = useState({});
  const [welcomeMsg, setWelcomeMsg] = useState('');
  const [sendWelcomeMessage, setSendWelcomeMessage] = useState({});
  const [loadingRecents, setLoadingRecents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchRecentsData = async () => {
    try {
      setLoadingRecents(true);
      const { data } = await fetchRecents();
      setRecents(data.result || []);
      setWelcomeMsg(data.config.welcome || '');
    } catch (error) {
      console.log("::ERROR", error);
    } finally {
      setLoadingRecents(false);
    }
  }

  useEffect(() => {
    fetchRecentsData();
  }, [])

  const rows = users.map((element) => {
    const handleNavigation = (e, route) => {
      e.stopPropagation();
      navigate(route);
    }

    return (
      <Table.Tr key={element._id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/estudiantes/${element._id}`)}>
        <Table.Td>{element.firstName}</Table.Td>
        <Table.Td>{element.lastName}</Table.Td>
        <Table.Td>{element.telephone}</Table.Td>
        <Table.Td>{dayjs(element.birthday).format(DEFAULT_DATE_FORMAT)}</Table.Td>
        <Table.Td>
          <Flex gap={"sm"}>
            <Tooltip label="Pagos" position="left">
              <ActionIcon
                variant="subtle"
                title="Pagos"
                color="green"
                radius="xl"
                onClick={(e) => handleNavigation(e, `/estudiantes/${element._id}/pagos`)}
              >
                <IconReceipt2 />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Asistencias" position="left">
              <ActionIcon
                variant="subtle"
                title="Asistencias"
                color="purple"
                radius="xl"
                onClick={(e) => handleNavigation(e, `/estudiantes/${element._id}/asistencias`)}
              >
                <IconCircleCheck />
              </ActionIcon>
            </Tooltip>
          </Flex>
        </Table.Td>
      </Table.Tr>
    );
  });

  const handleSearch = useDebouncedCallback(async (value) => {
    try {
      const { data } = await searchStudent(value.trim());

      setUsers(data.results);
    } catch (error) {
      console.log("::ERROR", error);
    } finally {
      setLoading(false);
    }
  }, 300);

  const handleSearchInput = (e) => {
    if (search.length === 0) {
      setUsers([]);
    }

    const value = e.target.value;

    setSearch(value);

    if (value.length === 0) {
      setUsers([]);
      return;
    }

    setLoading(true);
    handleSearch(e.target.value);
  }

  const recentRows = recents.map((element) => {
    const acceptForm = async () => {
      setUpdateInProgress({ ...updateInProgress, [element._id]: true });

      try {
        const { data } = await updateStudent(element._id, {...element, accepted});
        const { error } = data;

        if (error) {
          notifications.show(getErrorMessage("Error al aceptar el estudiante. Por favor intente de nuevo."))
        } else {
          notifications.show(getSuccessMessage("Estudiante aceptado correctamente."));

          if (sendWelcomeMessage[element._id]) {
            await sendMessage(element.telephone, welcomeMsg.replace(/_nombre_/gi, `${element.firstName} ${element.lastName}`));
          }

          setRecents(recents.filter((u) => u._id !== element._id));
        }
      } catch {
        notifications.show(getErrorMessage("Error al aceptar el estudiante. Por favor intente de nuevo."))
      }
      finally {
        setUpdateInProgress({ ...updateInProgress, [element._id]: false });
      }
    }

    const denyForm = async () => {
      const result = await openConfirmation({
        text: `Seguro que quieres rechazar el formulario de <b>${element.firstName} ${element.lastName}</b>?`,
      });

      if (result) {
        setDeleteInProgress({ ...deleteInProgress, [element._id]: true });

        try {
          const { data } = await deleteStudent(element._id);
          const { error } = data;

          if (error) {
            notifications.show(getErrorMessage("Error al rechazar el estudiante. Por favor intente de nuevo."))
          } else {
            notifications.show(getSuccessMessage("Formulario rechazado correctamente."));
            setRecents(recents.filter((u) => u._id !== element._id));
          }
        } catch {
          notifications.show(getErrorMessage("Error al rechazar el estudiante. Por favor intente de nuevo."))
        }
        finally {
          setDeleteInProgress({ ...deleteInProgress, [element._id]: false });
        }
      }
    }

    return (
      <Table.Tr
        key={element._id}
        style={{ cursor: "pointer" }}
        onClick={() => navigate(`/estudiantes/${element._id}`)}
      >
        <Table.Td>{element.firstName} {element.lastName}</Table.Td>
        <Table.Td>{element.telephone}</Table.Td>
        <Table.Td>
          {element.telephone &&
            <Checkbox
              checked={sendWelcomeMessage[element._id]}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => {
                setSendWelcomeMessage({ ...sendWelcomeMessage, [element._id]: e.currentTarget.checked })
              }}
            />
          }
        </Table.Td>
        <Table.Td>
          <Tooltip label="Aceptar formulario" position="left">
            <ActionIcon
              variant="subtle"
              title="Aceptar formulario"
              color="green"
              radius="xl"
              loading={!!updateInProgress[element._id]}
              onClick={(e) => {
                e.stopPropagation();
                acceptForm()
              }}
            >
              <IconCircleCheckFilled />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Rechazar formulario" position="left">
            <ActionIcon
              variant="subtle"
              title="Rechazar formulario"
              color="red"
              radius="xl"
              onClick={(e) => {
                e.stopPropagation()
                denyForm()
              }}
            >
              <IconCancel />
            </ActionIcon>
          </Tooltip>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Flex direction="column">
      <Flex my="md" gap="md" direction={{ base: "column", md: "row" }}>
        <TextInput
          label="Buscar por nombre"
          onChange={handleSearchInput}
          flex={1}
          value={search}
        />
        <Flex flex={1} align="end">
          <Button
            onClick={() => navigate("/formulario")}
            variant="outline"
            color="blue"
            leftSection={<IconPlus size={14} />}
          >
            Agregar usuario
          </Button>
        </Flex>
      </Flex>
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Nombre</Table.Th>
            <Table.Th>Apellidos</Table.Th>
            <Table.Th>Telefono</Table.Th>
            <Table.Th>Fecha de nacimiento</Table.Th>
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
          {search.length > 0 && users.length > 0 && rows}
          {(search.length === 0 || users.length === 0) && !loading && (
            <Table.Tr>
              <Table.Td colSpan="100%" ta="center">
                <Text fw={700} size="sm" my="xl">
                  Ningún estudiante encontrado
                </Text>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
      <Flex justify="space-between" my="md" w="100%">
        <Flex align="center">
          <Title order={5} mx="md">Formularios nuevos</Title>
          <Tooltip label="Refrescar" position="right">
            <ActionIcon
              variant="subtle"
              title="Refrescar"
              color="green"
              loading={loadingRecents}
              radius="xl"
              onClick={fetchRecentsData}
            >
              <IconRefresh />
            </ActionIcon>
          </Tooltip>
        </Flex>
      </Flex>
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Nombre</Table.Th>
            <Table.Th>Teléfono</Table.Th>
            <Table.Th>Enviar mensaje bienvenida</Table.Th>
            <Table.Th>Acciones</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {loadingRecents && (
            <Table.Tr>
              <Table.Td colSpan="100%" ta="center">
                <Flex justify="center" w="100%">
                  <Loader color="blue" type="bars" />
                </Flex>
              </Table.Td>
            </Table.Tr>
          )}
          {recentRows.length > 0 && recentRows}
        </Table.Tbody>
      </Table>

    </Flex>
  );
}

export default Students;
