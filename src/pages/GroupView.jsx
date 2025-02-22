import { useState, useEffect } from "react";
import { useParams } from "react-router";
import dayjs from 'dayjs';
import {
  Flex,
  TextInput,
  Skeleton,
  Button,
  MultiSelect,
  Checkbox,
  Group,
  Title,
  Switch,
  Autocomplete,
  Pill,
  Breadcrumbs,
  Anchor
} from "@mantine/core";
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { useNavigate } from "react-router";
import { normalizeString } from "../helpers/strings";
import { useDebouncedCallback } from '@mantine/hooks';
import { DAYS } from "../constants";
import { createGroup, fetchGroup, updateGroup, getTeachers, searchStudent } from "../helpers/api";
import { notifications } from "@mantine/notifications";
import { getSuccessMessage, getErrorMessage } from "../helpers/strings";

function GroupView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [teachers, setTeachers] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState({});
  const [selectedUser, setSelectedUsers] = useState([]);

  const [originalGroup, setOriginalGroup] = useState(null);
  const isDirty = JSON.stringify(group) !== JSON.stringify(originalGroup);
  const formattedTeachers = Object.keys(teachers).map((id) => ({ value: teachers[id]._id, label: `${teachers[id].firstName} ${teachers[id].lastName}` }))
  const hasSchedules = group?.schedules && Object.keys(group.schedules).length > 0;
  const allSchedulesFilled = Object.values(group?.schedules || {}).every(({ start, end }) => start && end);
  const isFormValid = group?.name && allSchedulesFilled && hasSchedules;

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const { data } = await getTeachers();
        const { result, error } = data;

        if (error) {
          notifications.show(
            getErrorMessage(
              "Error cargando datos. Por favor refresque la página."
            )
          );
          return;
        }

        setTeachers(result.reduce((accum, item) => {
          accum[item._id] = item;
          return accum;
        }, {}));
      } catch {
        notifications.show(
          getErrorMessage(
            "Error cargando datos. Por favor refresque la página."
          )
        );
      }
    };

    fetchTeachers()

    if (!id) {
      setLoading(false);
      return;
    }

    const fetchGroupById = async (groupId) => {
      try {
        const { data } = await fetchGroup(groupId);
        const { group: groupData, students, error } = data;
        const fetchedGroup = error ? null : groupData;

        setOriginalGroup(fetchedGroup);
        setGroup(fetchedGroup);
        setSelectedUsers(students);
      } catch {
        notifications.show(getErrorMessage("Error al cargar el grupo. Refresque la página."))
      } finally {
        setLoading(false);
      }
    };

    fetchGroupById(id);
  }, []);

  const handleCreation = async () => {
    setLoading(true);

    try {
      const { data } = await createGroup(group);
      const { error } = data;

      if (error) {
        notifications.show(getErrorMessage("Error al crear el grupo. Por favor intente de nuevo."))
      } else {
        setOriginalGroup(group);
        notifications.show(getSuccessMessage("Grupo creado correctamente."));
        navigate('/grupos');
      }
    } catch {
      notifications.show(getErrorMessage("Error al crear el grupo. Por favor intente de nuevo."))
    } finally {
      setLoading(false);
    }
  }

  const handleUpdate = async () => {
    setLoading(true);

    try {
      const { data } = await updateGroup(id, group);
      const { error } = data;

      if (error) {
        notifications.show(getErrorMessage("Error al actualizar el grupo. Por favor intente de nuevo."))
      } else {
        setOriginalGroup(group);
        notifications.show(getSuccessMessage("Grupo actualizado correctamente."));
      }
    } catch {
      notifications.show(getErrorMessage("Error al actualizar el grupo. Por favor intente de nuevo."))
    } finally {
      setLoading(false);
    }
  }

  const handleScheduleChange = (value) => {
    if (group?.schedules?.[value]) {
      const { [value]: _, ...newSchedules } = group.schedules;

      return setGroup({ ...group, schedules: newSchedules });
    }

    setGroup({ ...group, schedules: {
      ...group?.schedules,
      [value]: {
        start: null,
        end:  null
      }
    }})
  }

  const handleSearch = useDebouncedCallback(async (value) => {
    try {
      const { data } = await searchStudent(value.trim());

      setUsers(data.results.reduce((accum, item) => {
        accum[item._id] = item;
        return accum;
      }
      , {}));
    } catch {
      notifications.show(getErrorMessage("Error al buscar estudiante. Por favor intente de nuevo."))
    } finally {
      setLoading(false);
    }
  }, 300);

  const handleSearchInput = (value) => {
    if (search.length === 0) {
      setUsers([]);
    }

    setSearch(value);

    if (value.length === 0) {
      setUsers([]);
      return;
    }

    handleSearch(value);
  }

  return (
    <>
      <Flex
        direction="column"
        align="center"
        justify="center"
        mt={{ md: "xl" }}
        mb={{ md: 128 }}
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
              <Anchor onClick={() => navigate("/grupos")} underline="never">
                  Grupos
              </Anchor>
              {id && <Anchor underline="never">
                {originalGroup?.name}
              </Anchor>}
            </Breadcrumbs>
          </Flex>
          <Flex justify="space-between" my="sm" w="100%">
            <Flex flex={1} gap="md" direction={{ base: "column", md: "row" }}>
              <Skeleton visible={loading && !group} flex={1}>
                <Switch
                  checked={group?.active}
                  size="xl"
                  label={group?.active ? "Activado" : "Desactivado"}
                  onChange={(e) => {
                    setGroup({
                      ...group,
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
              <Skeleton visible={loading && !group} flex={1}>
                <TextInput
                  label="Nombre de grupo"
                  value={group?.name}
                  required
                  onChange={(e) =>
                    setGroup({
                      ...group,
                      name: normalizeString(e.target.value),
                    })
                  }
                />
              </Skeleton>
              <Skeleton visible={loading && !group} flex={1}>
                <MultiSelect
                  required
                  data={formattedTeachers}
                  label="Profesor/es"
                  onChange={(value) =>
                    setGroup({
                      ...group,
                      teachers: value,
                    })
                  }
                  value={group?.teachers || []}
                />
              </Skeleton>
            </Flex>
          </Flex>
          <Flex justify="space-between" my="sm" w="100%" direction="column">
            <Skeleton visible={loading && !group} flex={1}>
              <Title order={4}>Días de la semana</Title>
              <Group mt="xs">
                <Checkbox
                  checked={Boolean(group?.schedules?.[0])}
                  onChange={() => handleScheduleChange(0)}
                  label="Lunes"
                />
                <Checkbox
                  checked={Boolean(group?.schedules?.[1])}
                  onChange={() => handleScheduleChange(1)}
                  label="Martes"
                />
                <Checkbox
                  checked={Boolean(group?.schedules?.[2])}
                  onChange={() => handleScheduleChange(2)}
                  label="Miércoles"
                />
                <Checkbox
                  checked={Boolean(group?.schedules?.[3])}
                  onChange={() => handleScheduleChange(3)}
                  label="Jueves"
                />
                <Checkbox
                  checked={Boolean(group?.schedules?.[4])}
                  onChange={() => handleScheduleChange(4)}
                  label="Viernes"
                />
                <Checkbox
                  checked={Boolean(group?.schedules?.[5])}
                  onChange={() => handleScheduleChange(5)}
                  label="Sábado"
                />
                <Checkbox
                  checked={Boolean(group?.schedules?.[6])}
                  onChange={() => handleScheduleChange(6)}
                  label="Domingo"
                />
              </Group>
            </Skeleton>
          </Flex>
          <Flex
            justify="space-between"
            my="sm"
            w="100%"
            direction="column"
            gap="md"
          >
            {Object.entries(group?.schedules || {}).map(([id, schedule]) => (
              <Flex key={id} flex={1} gap="md" direction="column">
                <Title order={4}>{DAYS[id]}</Title>
                <Flex key={id} flex={1} gap="md">
                  <TimePicker
                    value={schedule.start ? dayjs(schedule.start) : null}
                    label="Hora inicio"
                    onChange={(value) =>
                      setGroup({
                        ...group,
                        schedules: {
                          ...group.schedules,
                          [id]: {
                            ...group.schedules[id],
                            start: value.$d.getTime(),
                          },
                        },
                      })
                    }
                  />
                  <TimePicker
                    label="Hora fin"
                    value={schedule.end ? dayjs(schedule.end) : null}
                    onChange={(value) =>
                      setGroup({
                        ...group,
                        schedules: {
                          ...group.schedules,
                          [id]: {
                            ...group.schedules[id],
                            end: value.$d.getTime(),
                          },
                        },
                      })
                    }
                  />
                </Flex>
              </Flex>
            ))}
          </Flex>
          <Skeleton visible={loading} flex={1}>
            <Flex justify="space-between" my="sm" w="100%" direction="column">
              <Title order={4} mb={16}>
                Estudiantes
              </Title>
              <Autocomplete
                label="Buscar nombre"
                onChange={handleSearchInput}
                flex={1}
                value={search}
                comboboxProps={{
                  onOptionSubmit: (val) => {
                    setGroup({
                      ...group,
                      students: [...group.students, val].sort(),
                    })
                    setSelectedUsers([...selectedUser, users[val]]);
                    setSearch("");
                    setUsers({});
                  },
                }}
                data={Object.keys(users).map((key) => ({
                  value: users[key]._id,
                  label: `${users[key].firstName} ${users[key].lastName}`,
                })).filter((option) => !selectedUser.find((item)=> item._id === option.value))}
              />
              <Flex gap="md" mt={16} direction="column">
                {selectedUser.length > 0 && selectedUser
                  .sort(((a, b) => {
                    const nameA = `${a.firstName} ${a.lastName}`
                    const nameB = `${b.firstName} ${b.lastName}`
                    if (nameA > nameB) return 1;
                    if (nameA < nameB) return -1;
                    return 0;
                  }))
                  .map((student) => (
                  <div key={student._id}>
                    <Pill
                      withRemoveButton
                      size="lg"
                      onRemove={
                        () => {
                          setGroup({
                            ...group,
                            students: group.students.filter((id) => id !== student._id).sort(),
                          });
                          setSelectedUsers(selectedUser.filter((item) => item._id !== student._id));
                        }
                      }
                    >{`${student.firstName} ${student.lastName}`}</Pill>
                  </div>
                ))}
              </Flex>
            </Flex>
          </Skeleton>
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

export default GroupView;
