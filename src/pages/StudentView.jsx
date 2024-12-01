import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Flex, TextInput, Skeleton, Button } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { normalizeString } from "../helpers/strings";
import { fetchStudent, updateStudent } from "../helpers/api";
import { notifications } from "@mantine/notifications";
import { getSuccessMessage, getErrorMessage } from "../helpers/strings";

function StudentView() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [originalUser, setOriginalUser] = useState(null);
  const isDirty = JSON.stringify(user) !== JSON.stringify(originalUser);
  const isFormValid = user?.firstName && user?.lastName && user?.birthdate;

  useEffect(() => {
    const fetchStudentById = async (studentId) => {
      try {
        const { data } = await fetchStudent(studentId);
        const { result, error } = data;
        const fetchedUser = error ? null : result;

        setOriginalUser(fetchedUser);
        setUser(fetchedUser);
      } catch (error) {
        notifications.show(getErrorMessage("Error al cargar el estudiante. Refresque la página."))
      } finally {
        setLoading(false);
      }
    };

    fetchStudentById(id);
  }, []);

  const handleUpdate = async () => {
    setLoadingUpdate(true);
    try {
      const { data } = await updateStudent(id, user);
      const { error } = data;

      if (error) {
        notifications.show(getErrorMessage("Error al actualizr el estudiante. Por favor intente de nuevo."))
      } else {
        setOriginalUser(user);
        notifications.show(getSuccessMessage("Estudiante actualizado correctamente."));
      }
    } catch {
      notifications.show(getErrorMessage("Error al actualizr el estudiante. Por favor intente de nuevo."))
    } finally {
      setLoadingUpdate(false);
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
              <Skeleton visible={loading} flex={1}>
                <TextInput
                  label="Nombre"
                  value={user?.firstName}
                  required
                  onChange={(e) =>
                    setUser({
                      ...user,
                      firstName: normalizeString(e.target.value),
                    })
                  }
                />
              </Skeleton>
              <Skeleton visible={loading} flex={1}>
                <TextInput
                  label="Apellidos"
                  value={user?.lastName}
                  required
                  onChange={(e) =>
                    setUser({
                      ...user,
                      lastName: normalizeString(e.target.value),
                    })
                  }
                />
              </Skeleton>
            </Flex>
          </Flex>
          <Flex justify="space-between" my="sm" w="100%">
            <Flex flex={1} gap="md" direction={{ base: "column", md: "row" }}>
              <Skeleton visible={loading} flex={1}>
                <DatePickerInput
                  label="Fecha de nacimiento"
                  required
                  value={user?.birthdate ? new Date(user?.birthdate) : null}
                  maxDate={new Date()}
                  onChange={(value) =>
                    setUser({ ...user, birthdate: value.getTime() })
                  }
                />
              </Skeleton>
              <Skeleton visible={loading} flex={1}>
                <TextInput
                  label="Whatsapp"
                  value={user?.telephone}
                  onChange={(e) =>
                    setUser({
                      ...user,
                      telephone: e.target.value.replace(/[^0-9\-]/g, ""),
                    })
                  }
                />
              </Skeleton>
            </Flex>
          </Flex>
          {isFormValid && isDirty && <Flex justify="center" my="sm" flex={1} align="center">
            <Button color="green" loading={loadingUpdate} disabled={loadingUpdate} onClick={handleUpdate}>Actualizar</Button>
          </Flex>}
        </Flex>
      </Flex>
    </>
  );
}

export default StudentView;
