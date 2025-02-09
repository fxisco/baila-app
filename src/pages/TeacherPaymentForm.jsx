
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Flex, TextInput, Skeleton, Button, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router";
import { DatePickerInput } from '@mantine/dates';
import { getSuccessMessage, getErrorMessage } from "../helpers/strings";
import { createTeacherPayment, getTeacherPayment, updateTeacherPayment } from "../helpers/api";
import { useAuth } from "../hooks/useAuth.jsx";

function TeacherPaymentForm() {
  const { handleAuthError } = useAuth();
  const { id, paymentId } = useParams();
  const [payment, setPayment] = useState(null);
  const [teacher, setTeacher] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [originalPayment, setOriginalPayment] = useState(null);
  const isDirty = JSON.stringify(payment) !== JSON.stringify(originalPayment);
  const isFormValid = payment?.description && payment?.date && payment?.amount;

  useEffect(() => {
    const fetchItem = async (paymentId) => {
      try {
        const { data } = await getTeacherPayment(id, { paymentId: paymentId });
        const { teacher, payment, error } = data;

        if (error) {
          notifications.show(getErrorMessage("Error al crear pago del profesor. Por favor intente de nuevo."));
          return;
        }

        setTeacher(teacher);

        if (payment) {
          setOriginalPayment(payment);
          setPayment(payment);
        }
      } catch (e) {
        handleAuthError(e)
        notifications.show(getErrorMessage("Error al cargar el pago del profesor. Refresque la página."))
      } finally {
        setLoading(false);
      }
    };

    fetchItem(paymentId);
  }, [])

  const handleCreation = async () => {
    setLoading(true);

    try {
      const { data } = await createTeacherPayment(id, payment);
      const { error } = data;

      if (error) {
        notifications.show(getErrorMessage("Error al crear pago de profesor. Por favor intente de nuevo."))
      } else {
        setOriginalPayment(payment);
        notifications.show(getSuccessMessage("Pago de profesor creado correctamente."));
        navigate(`/profesores/${id}/pagos`);
      }
    } catch (e) {
      handleAuthError(e);
      notifications.show(getErrorMessage("Error al crear pago de profesor. Por favor intente de nuevo."))
    } finally {
      setLoading(false);
    }
  }

  const handleUpdate = async () => {
    setLoading(true);

    try {
      const { data } = await updateTeacherPayment(paymentId, payment);
      const { error } = data;

      if (error) {
        notifications.show(getErrorMessage("Error al actualizar pago de profesor. Por favor intente de nuevo."))
      } else {
        setOriginalPayment(payment);
        notifications.show(getSuccessMessage("Pago de profesor actualizado correctamente."));
      }
    } catch (e) {
      handleAuthError(e);
      notifications.show(getErrorMessage("Error al actualizar pago de profesor. Por favor intente de nuevo."))
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
        {teacher && <Title align="start" order={4}>Pago de: <b>{teacher.firstName} {teacher.lastName}</b></Title>}
        <Flex
          maw={800}
          w="100%"
          justify="center"
          align="center"
          direction="column"
        >
          <Flex justify="space-between" my="sm" w="100%">
            <Flex flex={1} gap="md" direction={{ base: "column", md: "row" }}>
              <Skeleton visible={loading && !payment} flex={1}>
                <TextInput
                  label="Concepto"
                  value={payment?.description}
                  required
                  onChange={(e) =>
                    setPayment({
                      ...payment,
                      description: e.target.value,
                    })
                  }
                />
              </Skeleton>
              <Skeleton visible={loading && !payment} flex={1}>
                <DatePickerInput
                  flex={1}
                  label="Fecha de pago"
                  required
                  value={payment?.date ? new Date(payment.date) : null}
                  maxDate={new Date()}
                  onChange={(value) =>
                    setPayment({ ...payment, date: value.getTime() })
                  }
                />
              </Skeleton>
              <Skeleton visible={loading && !payment} flex={1}>
                <TextInput
                  label="Cantidad"
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

export default TeacherPaymentForm;
