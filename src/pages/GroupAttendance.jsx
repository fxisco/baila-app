import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { getDaysArray } from '../helpers/dates';
import dayjs from 'dayjs';
import {
  Flex,
  Button,
  Table,
  Breadcrumbs,
  Anchor,
  Text,
  Loader,
  Skeleton,
  Checkbox
} from "@mantine/core";
import { MonthPickerInput } from '@mantine/dates';
import { useNavigate } from "react-router";
import { updateAttendance, fetchGroupAttendance } from "../helpers/api";
import { notifications } from "@mantine/notifications";
import { getSuccessMessage, getErrorMessage } from "../helpers/strings";

const formatAttendance = (attendance) => {
  return {
    days: Object.keys(attendance).sort(),
    present: Object.keys(attendance).reduce((accum, key) => {
      const present = Object.keys(attendance[key]).map((val) => `${key}:${val}`).sort()
      accum.push(...present)
      return accum
    }, [])
  };
}

function GroupAttendance() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [month, setMonth] = useState(dayjs().startOf('month'));
  const currentMonth = dayjs(month).format('YYYY-MM');
  const nextMonth = dayjs(month).add(1, 'month').toDate();
  const [originalAttendance, setOriginalAttendance] = useState({});
  const days = getDaysArray(month, nextMonth);
  const daysArray = days.slice(0, days.length - 1)
  const isDirty = JSON.stringify(formatAttendance(attendance)) !== JSON.stringify(formatAttendance(originalAttendance));

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchGroupById = async (groupId) => {
      try {
        const { data } = await fetchGroupAttendance(groupId, { month: currentMonth });
        const { group: groupData, students, attendance, error } = data;
        const fetchedGroup = error ? null : groupData;

        setGroup(fetchedGroup);
        setStudents(students);
        setOriginalAttendance(attendance || {});
        setAttendance(attendance || {});
      } catch {
        notifications.show(getErrorMessage("Error al cargar el grupo. Refresque la página."))
      } finally {
        setLoading(false);
      }
    };

    fetchGroupById(id);
  }, [currentMonth]);

  const handleUpdate = async () => {
    setLoadingUpdate(true);

    const update = {
      attendance,
      month: currentMonth
    }

    try {
      const { data } = await updateAttendance(id, update);
      const { error } = data;

      if (error) {
        notifications.show(getErrorMessage("Error al actualizar el asistencia del grupo. Por favor intente de nuevo."))
      } else {
        setOriginalAttendance(attendance);
        notifications.show(getSuccessMessage("Asistencia actualizada correctamente."));
      }
    } catch {
      notifications.show(getErrorMessage("Error al actualizar la asistencia del grupo. Por favor intente de nuevo."))
    } finally {
      setLoadingUpdate(false);
    }
  }

  const handleDateCheck = (student, checkedDate, checked) => {
    setAttendance((prev) => {
      let newAttendance = { ...prev };

      if (newAttendance[checkedDate]?.[student._id]) {
        const { [student._id]: _, ...rest } = newAttendance[checkedDate]
        return {
          ...newAttendance,
          [checkedDate]: rest
        }
      } else {
        newAttendance[checkedDate] = {
          ...newAttendance[checkedDate],
          [student._id]: checked
        }
      }

      return newAttendance
    })
  }

  const rows = students.map((element, i) => {

    return (
      <Table.Tr key={element._id}>
        <Table.Td miw="200px">{element.firstName} {element.lastName}</Table.Td>
        {daysArray.map((currentDate) => {
          const formattedDate = dayjs(currentDate).format('YYYY-MM-DD')
          const value = attendance[formattedDate]?.[element._id]
          return (
            <Table.Td key={`${dayjs(currentDate).toISOString()}-${i}`}>
              <Checkbox checked={value} onChange={(event) => handleDateCheck(element, formattedDate, event.currentTarget.checked)} />
            </Table.Td>
          )
        })}
      </Table.Tr>
    );
  });

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
          maw={1000}
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
              {id && <Anchor onClick={() => navigate(`/grupo/${group?._id}`)} underline="never">
                {group?.name}
              </Anchor>}
              <Anchor underline="never" >
                Asistencias
              </Anchor>
            </Breadcrumbs>
          </Flex>
          <Flex width="100%" justify="center" my="sm" w="100%">
            <Flex gap="md" direction={{ base: "column", md: "row" }}>
              <Skeleton visible={loading} flex={1}>
                <MonthPickerInput
                  label="Mes"
                  placeholder="Elija un mes"
                  value={month}
                  onChange={setMonth}
                />
              </Skeleton>
            </Flex>
          </Flex>
        </Flex>
        <Flex
          maw={1000}
          w="100%"
          justify="center"
          align="center"
          direction="column"
          style={{ overflowX: "scroll" }}
        >
          <Flex width="100%" my="sm" w="100%">
            <Table striped highlightOnHover verticalSpacing="md" withColumnBorders horizontalSpacing="md">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Nombre</Table.Th>
                  {daysArray.map((currentDate, index) => {
                    return (
                      <Table.Th key={`${dayjs(currentDate).toISOString()}-${index}`}>{dayjs(currentDate).format("dd	DD")}</Table.Th>
                    )
                  })}
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
                {group?.students.length > 0 && rows}
                {(group?.students.length === 0) && !loading && (
                  <Table.Tr>
                    <Table.Td colSpan="100%" ta="center">
                      <Text fw={700} size="sm" my="xl">
                        Ningún estudiante en el grupo
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>
          </Flex>
        </Flex>
        {isDirty && (
          <Flex justify="center" my="sm" flex={1} align="center">
            <Button
              color="green"
              loading={loading || loadingUpdate}
              disabled={loading || loadingUpdate}
              onClick={handleUpdate}
            >
              Actualizar
            </Button>
          </Flex>
        )}
      </Flex>
    </>
  );
}

export default GroupAttendance;
