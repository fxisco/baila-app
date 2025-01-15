
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Flex, TextInput, Skeleton, Button, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router";
import { DatePickerInput } from '@mantine/dates';
import { getSuccessMessage, getErrorMessage } from "../helpers/strings";
import { createServicePayment } from "../helpers/api";

function ServicesPayment() {
  const { id, paymentId } = useParams();
  const [payment, setPayment] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [originalPayment, setOriginalPayment] = useState(null);
  const isDirty = JSON.stringify(payment) !== JSON.stringify(originalPayment);
  const isFormValid = payment?.description && payment?.date && payment?.amount;

  const handleCreation = async () => {
    setLoading(true);

    try {
      const { data } = await createServicePayment(id, payment);
      const { error } = data;

      if (error) {
        notifications.show(getErrorMessage("Error al crear pago de servicio. Por favor intente de nuevo."))
      } else {
        setOriginalPayment(payment);
        notifications.show(getSuccessMessage("Pago de servicio creado correctamente."));
        navigate('/servicios');
      }
    } catch {
      notifications.show(getErrorMessage("Error al crear pago de servicio. Por favor intente de nuevo."))
    } finally {
      setLoading(false);
    }
  }

  const handleUpdate = async () => {}

  return (
    <>
      <Flex
        direction="column"
        align="center"
        justify="center"
        mt={{ md: "xl" }}
      >
        <Title align="start" order={4}>Pago de servicio</Title>
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
              <Skeleton visible={loading} flex={1}>
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
              <Skeleton visible={loading} flex={1}>
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
                loading={loadingUpdate}
                disabled={loadingUpdate}
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

export default ServicesPayment;
