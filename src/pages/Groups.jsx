import { useState, useEffect } from "react";
import { Table, Flex, Button, Loader, List, Badge, SegmentedControl } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router";
import { getGroups } from "../helpers/api";
import { getErrorMessage } from "../helpers/strings";
import { DAYS, DEFAULT_TIME_FORMAT } from "../constants";
import dayjs from 'dayjs';

function Groups() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [groupsType, setGroupsType] = useState('Activos');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setGroups([]);

    const fetchGroups = async () => {
      try {
        const { data } = await getGroups({ active: groupsType === 'Activos' });
        const { result, error } = data;

        if (error) {
          notifications.show(getErrorMessage("Error cargando grupos. Por favor refresque la página."));
          return;
        }

        setGroups(result);
      } catch {
        notifications.show(getErrorMessage("Error cargando grupos. Por favor refresque la página."));
      } finally {
        setLoading(false);
      }
    }

    fetchGroups();
  }, [groupsType]);

  const rows = groups.map((element) => {
    return (
      <Table.Tr
        key={element._id}
        style={{ cursor: "pointer" }}
        onClick={() => navigate(`/grupo/${element._id}`)}
      >
        <Table.Td>{element.name}</Table.Td>
        <Table.Td>
          <List spacing="xs" size="sm" center>
            {Object.entries(element?.schedules || {}).map(([id, schedule]) => (
              <List.Item key={id}>
                {DAYS[id]}: {dayjs(schedule.start).format(DEFAULT_TIME_FORMAT)} -{" "}
                {dayjs(schedule.end).format(DEFAULT_TIME_FORMAT)}
              </List.Item>
            ))}
          </List>
        </Table.Td>
        <Table.Td>
          <Flex gap="xs" direction="column">
            {element.teachers.map((teacher) => (
              <Badge key={`${element._id}-${teacher}`} variant="light">{teacher}</Badge>
            ))}
          </Flex>
        </Table.Td>
        <Table.Td></Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Flex direction="column">
      <Flex my="md" gap="md" direction={{ base: "column", md: "row" }}>
        <Flex flex={1} align="end">
          <Button
            onClick={() => navigate("/grupo")}
            variant="outline"
            color="blue"
            leftSection={<IconPlus size={14} />}
          >
            Agregar grupo
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
            <Table.Th>Horario</Table.Th>
            <Table.Th>Profesor</Table.Th>
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
          {groups.length > 0 && rows}
        </Table.Tbody>
      </Table>
    </Flex>
  );
}

export default Groups;
