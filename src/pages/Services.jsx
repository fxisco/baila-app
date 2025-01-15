import { useState, useEffect } from "react";
import { Table, Flex, Button, Loader, ActionIcon, Tooltip } from "@mantine/core";
import { IconPlus, IconReceipt2 } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { getErrorMessage } from "../helpers/strings";
import { getServices } from "../helpers/api";
import { useNavigate } from "react-router";

function Services() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setServices([]);

    const fetchServices = async () => {
      try {
        const { data } = await getServices();
        const { result, error } = data;

        if (error) {
          notifications.show(getErrorMessage("Error cargando servicios. Por favor refresque la página."));
          return;
        }

        setServices(result);
      } catch {
        notifications.show(getErrorMessage("Error cargando servicios. Por favor refresque la página."));
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, []);

  const handleNavigation = (e, route) => {
    e.stopPropagation();
    navigate(route);
  }

  const rows = services.map((element) => {
    return (
      <Table.Tr
        key={element._id}
        style={{ cursor: "pointer" }}
        onClick={() => navigate(`/servicio/${element._id}`)}
      >
        <Table.Td>{element.name}</Table.Td>
        <Table.Td>
          <Tooltip label="Registrar pago" position="left">
            <ActionIcon
              variant="subtle"
              title="Registrar pago"
              color="green"
              radius="xl"
              onClick={(e) => handleNavigation(e, `/servicios/${element._id}/pagos`)}
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
            onClick={() => navigate("/servicio")}
            variant="outline"
            color="blue"
            leftSection={<IconPlus size={14} />}
          >
            Agregar servicio
          </Button>
        </Flex>
        <Flex flex={1}></Flex>
      </Flex>
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Nombre</Table.Th>
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
          {services.length > 0 && rows}
        </Table.Tbody>
      </Table>
    </Flex>
  );
}

export default Services;
