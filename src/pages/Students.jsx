import { useContext } from "react";
import { StudentsContext } from "../providers/StudentsProvider";
import { Table, ActionIcon, Flex, Tooltip, Text } from "@mantine/core";
import { IconUsersGroup, IconReceipt2, IconCircleCheck } from "@tabler/icons-react";
import dayjs from "dayjs";
import { DEFAULT_DATE_FORMAT } from "../constants";

function Students() {
  const { users } = useContext(StudentsContext);

  const rows = Object.keys(users).map((key) => {
    const element = users[key];
    return (
      <Table.Tr key={element.id}>
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
              >
                <IconReceipt2 />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Asistencia" position="left">
              <ActionIcon
                variant="subtle"
                title="Asistencia"
                color="purple"
                radius="xl"
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
          <Table.Tr>
            <Table.Td colSpan="100%" ta="center">
              <Text fw={700} size="sm" my="xl">
                Ningún estudiante encontrado
              </Text>
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </Flex>
  );
}

export default Students;
