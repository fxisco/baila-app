import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Flex, TextInput, Skeleton, Button } from "@mantine/core";
import { useNavigate } from "react-router";
import { normalizeString } from "../helpers/strings";
import { createService, fetchService, updateService } from "../helpers/api";
import { notifications } from "@mantine/notifications";
import { getSuccessMessage, getErrorMessage } from "../helpers/strings";

function ServiceView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(false);
  const [originalService, setOriginalService] = useState(null);
  const isDirty = JSON.stringify(service) !== JSON.stringify(originalService);
  const isFormValid = service?.name;

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchServiceById = async (serviceId) => {
      try {
        const { data } = await fetchService(serviceId);
        const { result, error } = data;
        const fetchedGroup = error ? null : result;

        setOriginalService(fetchedGroup);
        setService(fetchedGroup);
      } catch {
        notifications.show(getErrorMessage("Error al cargar el servicio. Refresque la página."))
      } finally {
        setLoading(false);
      }
    };

    fetchServiceById(id);
  }, []);

  const handleCreation = async () => {
    setLoading(true);

    try {
      const { data } = await createService(service);
      const { error } = data;

      if (error) {
        notifications.show(getErrorMessage("Error al crear el servicio. Por favor intente de nuevo."))
      } else {
        setOriginalService(service);
        notifications.show(getSuccessMessage("Servicio creado correctamente."));
        navigate('/servicios');
      }
    } catch {
      notifications.show(getErrorMessage("Error al crear el servicio. Por favor intente de nuevo."))
    } finally {
      setLoading(false);
    }
  }

  const handleUpdate = async () => {
    setLoading(true);

    try {
      const { data } = await updateService(id, service);
      const { error } = data;

      if (error) {
        notifications.show(getErrorMessage("Error al actualizar el servicio. Por favor intente de nuevo."))
      } else {
        setOriginalService(service);
        notifications.show(getSuccessMessage("Servicio actualizado correctamente."));
      }
    } catch {
      notifications.show(getErrorMessage("Error al actualizar el servicio. Por favor intente de nuevo."))
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Flex
        direction="column"
        align="center"
        justify="center"
        mt={{ md: "xl" }}
      >
        <Flex
          maw={800}
          w="100%"
          justify="center"
          align="center"
          direction="column"
        >
          <Flex justify="space-between" my="sm" w="100%">
            <Flex flex={1} gap="md" direction={{ base: "column", md: "row" }}>
              <Skeleton visible={loading && !service} flex={1}>
                <TextInput
                  label="Nombre de grupo"
                  value={service?.name}
                  required
                  onChange={(e) =>
                    setService({
                      ...service,
                      name: normalizeString(e.target.value),
                    })
                  }
                />
              </Skeleton>
              <Flex flex={1}></Flex>
            </Flex>
          </Flex>
          {isFormValid && isDirty && (
            <Flex justify="center" my="sm" flex={1} align="center">
              <Button
                color="green"
                loading={loading}
                disabled={loading}
                onClick={id ? handleUpdate : handleCreation}
              >
                {id ? "Actualizar" : "Guardar"}
              </Button>
            </Flex>
          )}
        </Flex>
      </Flex>
    </>
  );
}

export default ServiceView;
