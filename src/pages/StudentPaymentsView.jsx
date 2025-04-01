import { useEffect, useState } from "react";
import { useParams } from "react-router";
import dayjs from 'dayjs';
import {
  Flex,
  TextInput,
  Skeleton,
  Button,
  Select,
  Breadcrumbs,
  Anchor,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { MonthPickerInput } from '@mantine/dates';
import { useNavigate } from "react-router";
import { DatePickerInput } from "@mantine/dates";
import { getSuccessMessage, getErrorMessage } from "../helpers/strings";
import {
  createStudentPayment,
  updateStudentPayment,
  fetchStudentPayment,
} from "../helpers/api";

function StudentPaymentsView() {
  const { id, paymentId } = useParams();
  const [student, setStudent] = useState(null);
  const [payment, setPayment] = useState(null);
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [originalPayment, setOriginalPayment] = useState(null);
  const isDirty = JSON.stringify(payment) !== JSON.stringify(originalPayment);
  const isFormValid =
    payment?.date &&
    payment?.groupId &&
    payment?.amount &&
    payment?.type &&
    payment?.startDate &&
    payment?.endDate;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await fetchStudentPayment(id, { paymentId });
        const { student, groups, payment } = data;

        setLoading(false);
        setStudent(student);
        setGroups(groups || []);
        setPayment(payment || {});
        setOriginalPayment(payment || {});
      } catch {
        notifications.show(
          getErrorMessage("Error al cargar el pago. Refresque la página.")
        );
      }
    };

    fetchData();
  }, []);

  const handleCreation = async () => {
    setLoading(true);

    try {
      const { data } = await createStudentPayment(id, payment);
      const { error } = data;

      if (error) {
        notifications.show(getErrorMessage("Error al crear pago de estudiante. Por favor intente de nuevo."))
      } else {
        setOriginalPayment(payment);
        notifications.show(getSuccessMessage("Pago de estudiante creado correctamente."));
        navigate(`/estudiantes/${id}/pagos`);
      }
    } catch {
      notifications.show(getErrorMessage("Error al crear pago de estudiante. Por favor intente de nuevo."))
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);

    try {
      const { data } = await updateStudentPayment(id, paymentId, payment);
      const { error } = data;

      if (error) {
        notifications.show(getErrorMessage("Error al actualizar pago de estudiante. Por favor intente de nuevo."))
      } else {
        setOriginalPayment(payment);
        notifications.show(getSuccessMessage("Pago de estudiante actualizado correctamente."));
      }
    } catch {
      notifications.show(getErrorMessage("Error al actualizar pago de estudiante. Por favor intente de nuevo."))
    } finally {
      setLoading(false);
    }
  };

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
              <Anchor
                onClick={() => navigate("/estudiantes")}
                underline="never"
              >
                Estudiantes
              </Anchor>
              {id && (
                <Anchor
                  onClick={() => navigate(`/estudiantes/${id}`)}
                  underline="never"
                >
                  {student?.firstName} {student?.lastName}
                </Anchor>
              )}
              <Anchor onClick={() => navigate(`/estudiantes/${id}/pagos`)} underline="never">Pagos</Anchor>
              {<Anchor underline="never">Formulario</Anchor>}
            </Breadcrumbs>
          </Flex>
          <Flex justify="space-between" my="sm" w="100%">
            <Flex flex={1} gap="md" direction={{ base: "column", md: "row" }}>
              <Skeleton visible={loading && !payment} flex={1}>
                <DatePickerInput
                  flex={1}
                  label="Día de pago"
                  required
                  value={payment?.date ? new Date(payment.date) : null}
                  maxDate={new Date()}
                  onChange={(value) =>
                    setPayment({ ...payment, date: value.getTime() })
                  }
                />
              </Skeleton>
              <Skeleton visible={loading && !payment} flex={1}>
                <Select
                  required
                  label="Grupo"
                  data={groups.map((x) => ({ value: x._id, label: x.name }))}
                  value={payment?.groupId || ""}
                  onChange={(value) =>
                    setPayment({
                      ...payment,
                      groupId: value,
                    })
                  }
                />
              </Skeleton>
              <Skeleton visible={loading && !payment} flex={1}>
                <TextInput
                  label="Monto"
                  value={payment?.amount}
                  required
                  onChange={(e) => {
                    const value = e.currentTarget.value.replace(/[^0-9]/g, "");

                    setPayment({
                      ...payment,
                      amount: value,
                    });
                  }}
                />
              </Skeleton>
            </Flex>
          </Flex>
          <Flex justify="space-between" my="sm" w="100%">
            <Flex flex={1} gap="md" direction={{ base: "column", md: "row" }}>
              <Skeleton visible={loading && !payment} flex={1}>
                <Select
                  label="Tipo de pago"
                  value={payment?.type || ""}
                  onChange={(value) => {
                    setPayment({
                      ...payment,
                      type: value,
                      startDate: null,
                      endDate: null
                    });
                  }}
                  data={["Unico", "Rango"]}
                />
              </Skeleton>
              <Skeleton visible={loading && !payment} flex={1}>
                {payment?.type && (
                  <MonthPickerInput
                    label={payment?.type === "Unico" ? "Mes" : "Mes Inicio"}
                    value={payment?.startDate ? new Date(payment.startDate) : null}
                    onChange={(value) => {
                      const nextMonth = dayjs(value).add(1, 'month').toDate();
                      setPayment({
                        ...payment,
                        startDate: value.valueOf(),
                        endDate:
                          payment?.type === "Unico"
                            ? nextMonth.valueOf()
                            : null,
                      });
                    }}
                  />
                )}
              </Skeleton>
              <Skeleton visible={loading && !payment} flex={1}>
                {payment?.type === "Rango" && (
                  <MonthPickerInput
                    label="Mes Final"
                    minDate={dayjs(payment?.startDate).add(1, 'month')}
                    value={payment?.endDate ? new Date(payment.endDate) : null}
                    onChange={(value) => {
                      setPayment({ ...payment, endDate: value.valueOf() })
                    }}
                  />
                )}
              </Skeleton>
            </Flex>
          </Flex>
          {isFormValid && isDirty && (
            <Flex justify="center" my="sm" flex={1} align="center">
              <Button
                color="green"
                loading={loading}
                disabled={loading}
                onClick={paymentId ? handleUpdate : handleCreation}
              >
                {paymentId ? "Actualizar" : "Guardar"}
              </Button>
            </Flex>
          )}
        </Flex>
      </Flex>
    </>
  );
}

export default StudentPaymentsView;
