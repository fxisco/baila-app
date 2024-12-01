import { useState } from "react";
import { Table, ActionIcon, Flex, Tooltip, Text, TextInput, Button, Loader } from "@mantine/core";
import { IconPlus, IconReceipt2, IconCircleCheck } from "@tabler/icons-react";
import dayjs from "dayjs";
import { useNavigate } from "react-router";
import { useDebouncedCallback } from '@mantine/hooks';
import { DEFAULT_DATE_FORMAT } from "../constants";
import { searchStudent } from '../helpers/api';

function Groups() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);

  const rows = groups.map((element) => {
    return (
      <Table.Tr key={element._id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/grupo/${element._id}`)}>
        <Table.Td>{groups.name}</Table.Td>
        <Table.Td></Table.Td>
        <Table.Td></Table.Td>
        <Table.Td></Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Flex direction="column">
      <Flex my="md" gap="md" direction={{ base: "column", md: "row" }}>
        <Flex flex={1} align="end">
          <Button
            onClick={() => navigate("/formulario-grupo")}
            variant="outline"
            color="blue"
            leftSection={<IconPlus size={14} />}
          >
            Agregar grupo
          </Button>
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
