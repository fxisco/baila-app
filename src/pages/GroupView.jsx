import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Flex, TextInput, Skeleton, Button, MultiSelect, Checkbox, Group, Title } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { normalizeString } from "../helpers/strings";
import { DAYS } from "../constants";
import { updateStudent } from "../helpers/api";
import { notifications } from "@mantine/notifications";
import { getSuccessMessage, getErrorMessage } from "../helpers/strings";
import { name } from "dayjs/locale/es-do";

function GroupView() {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [teachers, setTeachers] = useState([
    { id: '1', firstName: 'Juan', lastName: 'Pérez' },
    { id: '2', firstName: 'María', lastName: 'Gómez' },
  ]);
  const [loading, setLoading] = useState(true);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [originalGroup, setOriginalGroup] = useState(null);
  const isDirty = JSON.stringify(group) !== JSON.stringify(originalGroup);
  const formattedTeachers = teachers.map((teacher) => ({ value: teacher.id, label: `${teacher.firstName} ${teacher.lastName}` }))
  const isFormValid = group?.name && group?.teachers?.length > 0;
  const schedules = group?.schedules || [];

  useEffect(() => {
    if (!id) setLoading(false);
  }, []);

  const handleUpdate = async () => {
    console.log("::GROUP", group)
  //   setLoadingUpdate(true);
  //   try {
  //     const { data } = await updateStudent(id, user);
  //     const { error } = data;

  //     if (error) {
  //       notifications.show(getErrorMessage("Error al actualizr el estudiante. Por favor intente de nuevo."))
  //     } else {
  //       setOriginalGroup(user);
  //       notifications.show(getSuccessMessage("Estudiante actualizado correctamente."));
  //     }
  //   } catch {
  //     notifications.show(getErrorMessage("Error al actualizr el estudiante. Por favor intente de nuevo."))
  //   } finally {
  //     setLoadingUpdate(false);
  //   }
  }

  const handleScheduleChange = (value) => {
    if (group?.schedules[value]) {
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
              <Skeleton visible={loading} flex={1}>
              <MultiSelect
                required
                data={formattedTeachers}
                label="Profesor/es"
                onChange={
                  (value) => setGroup({ ...group, teachers: value.map((id) => ({
                    id,
                    firstName: teachers.find((teacher) => teacher.id === id).firstName,
                    lastName: teachers.find((teacher) => teacher.id === id).lastName
                  }))})
                }
                value={(group?.teachers || []).map((({ id }) => id))}
              />
              </Skeleton>
            </Flex>
          </Flex>
          <Flex justify="space-between" my="sm" w="100%" direction="column">
            <Title order={4}>Días de la semana</Title>
            <Group mt="xs">
              <Checkbox checked={Boolean(group?.schedules[0])} onChange={() => handleScheduleChange(0)} label="Lunes" />
              <Checkbox checked={Boolean(group?.schedules[1])} onChange={() => handleScheduleChange(1)} label="Martes" />
              <Checkbox checked={Boolean(group?.schedules[2])} onChange={() => handleScheduleChange(2)} label="Miércoles" />
              <Checkbox checked={Boolean(group?.schedules[3])} onChange={() => handleScheduleChange(3)} label="Jueves" />
              <Checkbox checked={Boolean(group?.schedules[4])} onChange={() => handleScheduleChange(4)} label="Viernes" />
              <Checkbox checked={Boolean(group?.schedules[5])} onChange={() => handleScheduleChange(5)} label="Sábado" />
              <Checkbox checked={Boolean(group?.schedules[6])} onChange={() => handleScheduleChange(6)} label="Domingo" />
            </Group>

          </Flex>
          <Flex justify="space-between" my="sm" w="100%" direction="column" gap="md">
            {Object.entries(group?.schedules || {}).map(([id, schedule]) => (
              <Flex key={id} flex={1} gap="md" direction="column" mx="md">
                <Title order={4}>{DAYS[id]}</Title>
                <Flex key={id} flex={1} gap="md">
                  <DatePickerInput
                    flex={1}
                    label="Hora de inicio"
                    required
                    value={schedule.start ? new Date(schedule.start) : null}
                    maxDate={new Date()}
                    onChange={(value) => setGroup({ ...group, schedules: {
                      ...group.schedules,
                      [id]: {
                        ...group.schedules[id],
                        start: value.getTime()
                      }
                    } })}
                  />
                  <DatePickerInput
                    flex={1}
                    label="Hora de fin"
                    required
                    value={schedule.end ? new Date(schedule.end) : null}
                    maxDate={new Date()}
                    onChange={(value) => setGroup({ ...group, schedules: {
                      ...group.schedules,
                      [id]: {
                        ...group.schedules[id],
                        end: value.getTime()
                      }
                    } })}
                  />
                </Flex>
              </Flex>
            ))}
          </Flex>
          {isFormValid && isDirty && <Flex justify="center" my="sm" flex={1} align="center">
            <Button color="green" loading={loadingUpdate} disabled={loadingUpdate} onClick={handleUpdate}>Actualizar</Button>
          </Flex>}
        </Flex>
      </Flex>
    </>
  );
}

export default GroupView;
