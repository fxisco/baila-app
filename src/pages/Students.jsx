import { useContext } from "react";
import { StudentsContext } from "../providers/StudentsProvider";
import { Table, ActionIcon, Flex, Tooltip, Text, TextInput, Button } from "@mantine/core";
import { IconPlus, IconUsersGroup, IconReceipt2, IconCircleCheck } from "@tabler/icons-react";
import dayjs from "dayjs";
import { useNavigate} from "react-router";
import { DEFAULT_DATE_FORMAT } from "../constants";

function Students() {
  const navigate = useNavigate();
  const { setSearch, filteredUsers, studentSearch } = useContext(StudentsContext);

  const rows = filteredUsers.map((element) => {
    const handleNavigation = (e, route) => {
      e.stopPropagation();
      navigate(route);
    }

    return (
      <Table.Tr key={element.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/formulario/${element.id}`)}>
        <Table.Td>{element.name}</Table.Td>
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

  return (
    <Flex direction="column">
      <Flex my="md" gap="md" direction={{ base: 'column', md: 'row' }}>
        <TextInput
          label="Buscar por nombre"
          onChange={(e) => setSearch(e.target.value)}
          flex={1}
          value={studentSearch}
        />
        <Flex flex={1} align="end">
          <Button onClick={() => navigate('/formulario')} variant="outline" color="blue" leftSection={<IconPlus size={14} />}>Agregar usuario</Button>
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
          {filteredUsers.length > 0 ? rows :
            (
              <Table.Tr>
                <Table.Td colSpan="100%" ta="center">
                  <Text fw={700} size="sm" my="xl">
                    Ningún estudiante encontrado
                  </Text>
                </Table.Td>
              </Table.Tr>
            )
          }
        </Table.Tbody>
      </Table>
    </Flex>
  );
}

export default Students;
