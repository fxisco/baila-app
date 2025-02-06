import { createContext, useMemo, useContext } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { useNavigate } from "react-router";
import { notifications } from "@mantine/notifications";
import { getSuccessMessage, getErrorMessage } from "../helpers/strings";

const AuthContext = createContext();

const AUTH_ERROR_UNAUTHORIZED = 401;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage("user", null);
  const navigate = useNavigate();

  const logUser = async (data) => {
    setUser(data);
    navigate("/estudiantes");
  };

  const logout = () => {
    setUser(null);
    navigate("/", { replace: true });
  };

  const handleAuthError = (e) => {
    if (e.response.status === AUTH_ERROR_UNAUTHORIZED) {
      logout();
    }
  };

  const value = useMemo(
    () => ({
      user,
      logUser,
      logout,
      handleAuthError
    }),
    [user]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};