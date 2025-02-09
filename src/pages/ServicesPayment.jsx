
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import {
  Flex,
  TextInput,
  Skeleton,
  Button,
  Title,
  Breadcrumbs,
  Anchor,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router";
import { DatePickerInput } from '@mantine/dates';
import { getSuccessMessage, getErrorMessage } from "../helpers/strings";
import { createServicePayment, fetchPayment, updatePayment, fetchService } from "../helpers/api";

function ServicesPayment() {
  const { id, paymentId } = useParams();
  const [payment, setPayment] = useState(null);
  const [service, setService] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [originalPayment, setOriginalPayment] = useState(null);
  const isDirty = JSON.stringify(payment) !== JSON.stringify(originalPayment);
  const isFormValid = payment?.description && payment?.date && payment?.amount;

  useEffect(() => {
    const fetchServiceById = async (serviceId) => {
      try {
        const { data } = await fetchService(serviceId);
        const { service: serviceData, error } = data;
        const fetchedService = error ? null : serviceData;

        setService(fetchedService);
      } catch {
        notifications.show(getErrorMessage("Error al cargar el pago de servicio. Refresque la página."))
      }
    };

    fetchServiceById(id)

    if (!paymentId) {
      setLoading(false);
      return;
    }

    const fetchItem = async (paymentId) => {
      try {
        const { data } = await fetchPayment(paymentId);
        const { result: paymentData, error } = data;
        const fetchedPayment = error ? null : paymentData;

        setOriginalPayment(fetchedPayment);
        setPayment(fetchedPayment);
      } catch {
        notifications.show(getErrorMessage("Error al cargar el pago de servicio. Refresque la página."))
      } finally {
        setLoading(false);
      }
    };

    fetchItem(paymentId);
  }, [])

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
        navigate(`/servicio/${id}`);
      }
    } catch {
      notifications.show(getErrorMessage("Error al crear pago de servicio. Por favor intente de nuevo."))
    } finally {
      setLoading(false);
    }
  }

  const handleUpdate = async () => {
    setLoading(true);

    try {
      const { data } = await updatePayment(paymentId, payment);
      const { error } = data;

      if (error) {
        notifications.show(getErrorMessage("Error al actualizar pago de servicio. Por favor intente de nuevo."))
      } else {
        setOriginalPayment(payment);
        notifications.show(getSuccessMessage("Pago de servicio actualizado correctamente."));
      }
    } catch {
      notifications.show(getErrorMessage("Error al actualizar pago de servicio. Por favor intente de nuevo."))
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
            <Breadcrumbs>
              <Anchor onClick={() => navigate("/servicios")} underline="never">
                  Servicios
              </Anchor>
              {service && <Anchor onClick={() => navigate(`/servicio/${id}`)} underline="never">
                {service?.name}
              </Anchor>}
              {<Anchor underline="never" >
                Pagos
              </Anchor>}
            </Breadcrumbs>
          </Flex>
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

export default ServicesPayment;
