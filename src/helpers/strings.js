export const normalizeString = (string) => {
  return string.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export const getSuccessMessage = (message) => {
  return {
    title: "Éxito",
    message,
    color: "green",
    autoClose: 5000,
  };
}

export const getErrorMessage = (message) => {
  return {
    title: "Error",
    message,
    color: "red",
    autoClose: 5000,
  };
}