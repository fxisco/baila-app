import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Flex, TextInput, Skeleton, Button, Switch, Fieldset, Title } from "@mantine/core";
import { useNavigate } from "react-router";
import { normalizeString } from "../helpers/strings";
import { createTeacher, fetchTeacher, updateTeacher } from "../helpers/api";
import { notifications } from "@mantine/notifications";
import { getSuccessMessage, getErrorMessage } from "../helpers/strings";

function TeacherView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(false);
  const [temporaryPassword, setTemporaryPassword] = useState(false);
  const [originalTeacher, setOriginalTeacher] = useState(null);
  const isDirty = JSON.stringify(teacher) !== JSON.stringify(originalTeacher);
  const isFormValid = teacher?.firstName && teacher?.lastName &&  teacher?.telephone;

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchTeacherById = async (teacherId) => {
      try {
        const { data } = await fetchTeacher(teacherId);
        const { result, error } = data;
        const fetchedTeacher = error ? null : result;

        setOriginalTeacher(fetchedTeacher);
        setTeacher(fetchedTeacher);
      } catch {
        notifications.show(getErrorMessage("Error al cargar el profesor. Refresque la página."))
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherById(id);
  }, []);

  const handleCreation = async () => {
    setLoading(true);
    const randomstring = Math.random().toString(36).slice(-8);
    const newTeacher = {
      ...teacher,
      groups: teacher.groups ? teacher.groups : [],
      p: randomstring.toLowerCase()
    }

    try {
      const { data } = await createTeacher(newTeacher);
      const { error, userAlreadyExits } = data;

      if (userAlreadyExits) {
        notifications.show(getErrorMessage("El usuario de profesor ya existe. Por favor verifique la información."))
        return
      }

      if (error) {
        notifications.show(getErrorMessage("Error al crear el profesor. Por favor intente de nuevo."))
      } else {
        setOriginalTeacher(teacher);
        notifications.show(getSuccessMessage("Profesor creado correctamente."));
      }
    } catch {
      notifications.show(getErrorMessage("Error al crear el profesor. Por favor intente de nuevo."))
    } finally {
      setLoading(false);
    }
  }

  const handleUpdate = async () => {
    setLoading(true);

    try {
      const { data } = await updateTeacher(id, teacher);
      const { error, userAlreadyExits } = data;

      if (userAlreadyExits) {
        notifications.show(getErrorMessage("El usuario ha sido modificado por uno que ya existe. Por favor verifique la información."))
        return
      }

      if (error) {
        notifications.show(getErrorMessage("Error al actualizar el profesor. Por favor intente de nuevo."))
      } else {
        setOriginalTeacher(teacher);
        notifications.show(getSuccessMessage("Profesor actualizado correctamente."));
      }
    } catch {
      notifications.show(getErrorMessage("Error al actualizar el profesor. Por favor intente de nuevo."))
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
              <Skeleton visible={loading && !teacher} flex={1}>
                <Switch
                  checked={teacher?.active}
                  size="xl"
                  label={teacher?.active ? "Activado" : "Desactivado"}
                  onChange={(e) => {
                    setTeacher({
                      ...teacher,
                      active: e.currentTarget.checked,
                    });
                  }}
                />
              </Skeleton>
              <Flex flex={1}></Flex>
            </Flex>
          </Flex>
          <Flex justify="space-between" my="sm" w="100%">
            <Flex flex={1} gap="md" direction={{ base: "column", md: "row" }}>
              <Skeleton visible={loading && !teacher} flex={1}>
                <TextInput
                  label="Nombre/s"
                  value={teacher?.firstName}
                  required
                  onChange={(e) =>
                    setTeacher({
                      ...teacher,
                      firstName: normalizeString(e.target.value),
                    })
                  }
                />
              </Skeleton>
              <Skeleton visible={loading && !teacher} flex={1}>
                <TextInput
                  label="Apellido/s"
                  value={teacher?.lastName}
                  required
                  onChange={(e) =>
                    setTeacher({
                      ...teacher,
                      lastName: normalizeString(e.target.value),
                    })
                  }
                />
              </Skeleton>
            </Flex>
          </Flex>
          <Flex justify="space-between" my="sm" w="100%">
            <Flex flex={1} gap="md" direction={{ base: "column", md: "row" }}>
              <Skeleton visible={loading && !teacher} flex={1}>
                <TextInput
                  label="Whatsapp"
                  value={teacher?.telephone}
                  onChange={(e) =>
                    setTeacher({
                      ...teacher,
                      telephone: e.target.value.replace(/[^0-9\-]/g, ""),
                    })
                  }
                />
              </Skeleton>
              <Skeleton visible={loading && !teacher} flex={1}>
                <TextInput
                  label="Nombre de usuario"
                  value={teacher?.username}
                  onChange={(e) =>
                    setTeacher({
                      ...teacher,
                      username: normalizeString(e.target.value),
                    })
                  }
                />
              </Skeleton>
            </Flex>
          </Flex>
          <Flex justify="space-between" my="sm" w="100%">
            <Flex flex={1} gap="md" direction={{ base: "column", md: "row" }}>
              <Flex flex={1}>
                {teacher?.p && (
                  <Skeleton visible={loading && !teacher} flex={1}>
                    <Fieldset legend="Contraseña temporal" disabled pt={0} pb="xs">
                      <Title order={3}>{teacher?.p}</Title>
                    </Fieldset>
                  </Skeleton>
                )}
              </Flex>
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

export default TeacherView;
