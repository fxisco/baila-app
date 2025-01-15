import { useState, useEffect } from "react";
import { Table, Flex, Button, Loader, ActionIcon, Tooltip, SegmentedControl, Badge } from "@mantine/core";
import { IconPlus, IconReceipt2 } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { getErrorMessage } from "../helpers/strings";
import { getTeachers } from "../helpers/api";
import { useNavigate } from "react-router";

function Teachers() {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [groupsType, setGroupsType] = useState('Activos');

  useEffect(() => {
    setLoading(true);
    setTeachers([]);

    const fetchTeachers = async () => {
      try {
        const { data } = await getTeachers({ active: groupsType === 'Activos' });
        const { result, error } = data;

        if (error) {
          notifications.show(getErrorMessage("Error cargando servicios. Por favor refresque la página."));
          return;
        }

        setTeachers(result);
      } catch {
        notifications.show(getErrorMessage("Error cargando servicios. Por favor refresque la página."));
      } finally {
        setLoading(false);
      }
    }

    fetchTeachers();
  }, [groupsType]);

  const handleNavigation = (e, route) => {
    e.stopPropagation();
    navigate(route);
  }

  const rows = teachers.map((element) => {
    return (
      <Table.Tr
        key={element._id}
        style={{ cursor: "pointer" }}
        onClick={() => navigate(`/profesor/${element._id}`)}
      >
        <Table.Td>{`${element.firstName} ${element.lastName}`}</Table.Td>
        <Table.Td>{element.username}</Table.Td>
        <Table.Td>
          <Flex gap="xs" direction="column">
            {element.groups.map((group) => (
              <Badge key={`${element._id}-${group}`} variant="light">{group}</Badge>
            ))}
          </Flex>
        </Table.Td>
        <Table.Td>
          <Tooltip label="Pagos" position="left">
            <ActionIcon
              variant="subtle"
              title="Pagos"
              color="green"
              radius="xl"
              onClick={(e) => handleNavigation(e, `/profesores/${element.id}/pagos`)}
            >
              <IconReceipt2 />
            </ActionIcon>
          </Tooltip>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Flex direction="column">
      <Flex my="md" gap="md" direction={{ base: "column", md: "row" }}>
        <Flex flex={1} align="end">
          <Button
            onClick={() => navigate("/profesor")}
            variant="outline"
            color="blue"
            leftSection={<IconPlus size={14} />}
          >
            Agregar profesor
          </Button>
        </Flex>
        <Flex flex={1}></Flex>
      </Flex>
      <Flex my="md" gap="md" direction={{ base: "column", md: "row" }}>
        <Flex flex={1} align="end">
        <SegmentedControl
          value={groupsType}
          onChange={setGroupsType}
          data={['Activos', 'Desactivados']}
        />
        </Flex>
        <Flex flex={1}></Flex>
      </Flex>
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Nombre</Table.Th>
            <Table.Th>Usuario</Table.Th>
            <Table.Th>Grupos</Table.Th>
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
          {teachers.length > 0 && rows}
        </Table.Tbody>
      </Table>
    </Flex>
  );
}

export default Teachers;
