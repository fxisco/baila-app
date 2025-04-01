import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useNavigate } from "react-router";
import { Flex, TextInput, Skeleton, Button, MultiSelect, Breadcrumbs, Anchor } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { normalizeString } from "../helpers/strings";
import { fetchStudent, updateStudent, getGroups } from "../helpers/api";
import { notifications } from "@mantine/notifications";
import { getSuccessMessage, getErrorMessage } from "../helpers/strings";

function StudentView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [originalStudent, setOriginalStudent] = useState(null);
  const isDirty = JSON.stringify(student) !== JSON.stringify(originalStudent);
  const activeStudentGroups = (student?.groups || []).filter((group) => groups.find(({ _id }) => _id === group));
  const inactiveStudentGroups = (student?.groups || []).filter((group) => !groups.find(({ _id }) => _id === group));
  const isFormValid = student?.firstName && student?.lastName && student?.birthdate;

  useEffect(() => {
    const fetchStudentById = async (studentId) => {
      try {
        const { data } = await fetchStudent(studentId);
        const { result, error } = data;
        const fetchedUser = error ? null : result;

        setOriginalStudent(fetchedUser);
        setStudent(fetchedUser);
      } catch {
        notifications.show(getErrorMessage("Error al cargar el estudiante. Refresque la página."))
      } finally {
        setLoading(false);
      }
    };

    const fetchGroups = async () => {
      try {
        const { data } = await getGroups({ active: true });
        const { result, error } = data;

        if (error) {
          notifications.show(getErrorMessage("Error cargando grupos. Por favor refresque la página."));
          return;
        }

        setGroups(result);
      } catch {
        notifications.show(getErrorMessage("Error cargando grupos. Por favor refresque la página."));
      } finally {
        setLoadingGroups(false);
      }
    }

    fetchStudentById(id);
    fetchGroups();
  }, []);

  const handleUpdate = async () => {
    setLoadingUpdate(true);
    try {
      const { data } = await updateStudent(id, student);
      const { error } = data;

      if (error) {
        notifications.show(getErrorMessage("Error al actualizr el estudiante. Por favor intente de nuevo."))
      } else {
        setOriginalStudent(student);
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
            <Breadcrumbs>
              <Anchor onClick={() => navigate("/estudiantes")} underline="never">
                Estudiantes
              </Anchor>
              {id && <Anchor underline="never">
                {student?.firstName} {student?.lastName}
              </Anchor>}
            </Breadcrumbs>
          </Flex>
          <Flex justify="space-between" my="sm" w="100%">
            <Flex flex={1} gap="md" direction={{ base: "column", md: "row" }}>
              <Skeleton visible={loading} flex={1}>
                <TextInput
                  label="Nombre"
                  value={student?.firstName}
                  required
                  onChange={(e) =>
                    setStudent({
                      ...student,
                      firstName: normalizeString(e.target.value),
                    })
                  }
                />
              </Skeleton>
              <Skeleton visible={loading} flex={1}>
                <TextInput
                  label="Apellidos"
                  value={student?.lastName}
                  required
                  onChange={(e) =>
                    setStudent({
                      ...student,
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
                  value={student?.birthdate ? new Date(student?.birthdate) : null}
                  maxDate={new Date()}
                  onChange={(value) =>
                    setStudent({ ...student, birthdate: value.getTime() })
                  }
                />
              </Skeleton>
              <Skeleton visible={loading} flex={1}>
                <TextInput
                  label="Whatsapp"
                  value={student?.telephone}
                  onChange={(e) =>
                    setStudent({
                      ...student,
                      telephone: e.target.value.replace(/[^0-9\-]/g, ""),
                    })
                  }
                />
              </Skeleton>
            </Flex>
          </Flex>
          <Flex justify="space-between" my="sm" w="100%">
            <Flex flex={1} gap="md" direction={{ base: "column", md: "row" }}>
              <Skeleton visible={loadingGroups} flex={1}>
                <MultiSelect
                  label="Grupos activos"
                  placeholder="Escoger grupo"
                  data={(groups || []).map((group) => ({ value: group._id, label: group.name }))}
                  clearable
                  value={activeStudentGroups || []}
                  onChange={(value) =>
                    setStudent({
                      ...student,
                      groups: [
                        ...value,
                        ...inactiveStudentGroups
                      ],
                    })
                  }
                  styles={{
                    pill: {
                      background: 'var(--mantine-color-blue-filled)',
                      color: 'white',
                    },
                  }}
                />
              </Skeleton>
              <Flex flex={1}></Flex>
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
