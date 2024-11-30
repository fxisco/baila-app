import { useState } from "react";
import { Table, ActionIcon, Flex, Tooltip, Text, TextInput, Button, Loader } from "@mantine/core";
import { IconPlus, IconUsersGroup, IconReceipt2, IconCircleCheck } from "@tabler/icons-react";
import dayjs from "dayjs";
import { useNavigate } from "react-router";
import { useDebouncedCallback } from '@mantine/hooks';
import { DEFAULT_DATE_FORMAT } from "../constants";
import { searchStudent } from '../helpers/api';

function Students() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const rows = users.map((element) => {
    const handleNavigation = (e, route) => {
      e.stopPropagation();
      navigate(route);
    }

    return (
      <Table.Tr key={element._id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/formulario/${element.id}`)}>
        <Table.Td>{element.firstName}</Table.Td>
        <Table.Td>{element.lastName}</Table.Td>
        <Table.Td>{element.telephone}</Table.Td>
        <Table.Td>{dayjs(element.birthday).format(DEFAULT_DATE_FORMAT)}</Table.Td>
        <Table.Td>
          <Flex gap={"sm"}>
            <Tooltip label="Grupos" position="left">
              <ActionIcon
                variant="subtle"
                title="Editar"
                color="blue"
                radius="xl"
                onClick={(e) => handleNavigation(e, `/estudiantes/${element.id}/grupos`)}
              >
                <IconUsersGroup />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Pagos" position="left">
              <ActionIcon
                variant="subtle"
                title="Pagos"
                color="green"
                radius="xl"
                onClick={(e) => handleNavigation(e, `/estudiantes/${element.id}/pagos`)}
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
                onClick={(e) => handleNavigation(e, `/estudiantes/${element.id}/asistencias`)}
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
            <Table.Th>Apellido</Table.Th>
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
    </Flex>
  );
}

export default Students;
