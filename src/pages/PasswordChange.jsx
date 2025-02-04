import { useState } from "react";
import { Flex, Button, PasswordInput } from "@mantine/core";
import { changePassword } from "../helpers/api";
import { notifications } from "@mantine/notifications";
import { getSuccessMessage, getErrorMessage } from "../helpers/strings";

function PasswordChange() {
  const [form, setForm] = useState({
    oldPassword: '',
    newPassword: '',
    repeatNewPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const samePassword = form?.newPassword === form?.repeatNewPassword;
  const isFormValid = form?.oldPassword && form?.newPassword &&  form?.repeatNewPassword && !samePassword;

  const handleChangePassword = async () => {
    setLoading(true);
    try {
      const { data } =  await changePassword(form);
      const { error } = data;

      if (error) {
        notifications.show(getErrorMessage("Error al cambiar contraseña. Intente de nuevo."))
        return;
      }

      notifications.showNotification(getSuccessMessage("Contraseña cambiada con éxito."));
    } catch {
      notifications.showNotification(getErrorMessage("Error al cambiar contraseña. Intente de nuevo."));
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
          maw={500}
          w="100%"
          justify="center"
          align="center"
          direction="column"
        >
          <Flex justify="space-between" my="sm" w="100%">
            <Flex flex={1} gap="md" direction="column">
              <PasswordInput
                flex={1}
                label="Constraseña vieja"
                value={form?.oldPassword}
                required
                onChange={(e) =>
                  setForm({
                    ...form,
                    oldPassword: e.target.value,
                  })
                }
              />
              <PasswordInput
                flex={1}
                label="Constraseña nueva"
                error={
                  form.newPassword.length > 0 &&
                  form.repeatNewPassword.length > 0 &&
                  !samePassword
                    ? "Contraseñas no coinciden"
                    : form?.newPassword === form?.oldPassword &&
                      form?.oldPassword.length > 0
                    ? "Contraseña nueva no puede ser igual a la vieja"
                    : null
                }
                value={form?.newPassword}
                required
                onChange={(e) =>
                  setForm({
                    ...form,
                    newPassword: e.target.value,
                  })
                }
              />
              <PasswordInput
                flex={1}
                label="Repetir contraseña nueva"
                value={form?.repeatNewPassword}
                required
                onChange={(e) =>
                  setForm({
                    ...form,
                    repeatNewPassword: e.target.value,
                  })
                }
              />
            </Flex>
          </Flex>
          <Flex justify="center" my="sm" flex={1} align="center">
            {isFormValid && (
              <Button
                color="green"
                loading={loading}
                disabled={loading}
                onClick={handleChangePassword}
              >
                Cambiar password
              </Button>
            )}
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}

export default PasswordChange;
