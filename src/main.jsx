import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import App from "./App.jsx";
import RegistrationForm from "./pages/RegistrationForm.jsx";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "dayjs/locale/es-do.js";
import dayjs from 'dayjs';
import { DatesProvider } from "@mantine/dates";
import { MantineProvider, createTheme } from "@mantine/core";
import Groups from "./pages/Groups";
import Services from "./pages/Services";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Teachers from "./pages/Teachers";
import Login from "./pages/Login";
import Students from "./pages/Students";
import StudentPayments from "./pages/StudentPayments";
import ServicesPayment from "./pages/ServicesPayment.jsx";
import StudentGroups from "./pages/StudentGroups";
import StudentAssists from "./pages/StudentAssists";
import StudentView from "./pages/StudentView";
import GroupAttendance from "./pages/GroupAttendance";
import TeacherView from "./pages/TeacherView";
import TeacherPayments from "./pages/TeacherPayments.jsx";
import TeacherPaymentForm from "./pages/TeacherPaymentForm.jsx";
import ServiceView from "./pages/ServiceView";
import GroupView from "./pages/GroupView";
import PasswordChange from "./pages/PasswordChange";
import { StudentsProvider } from "./providers/StudentsProvider";
import { ConfirmationProvider } from "./providers/ConfirmationProvider.jsx";
import { Notifications } from "@mantine/notifications";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "@mantine/notifications/styles.css";
import { AuthProvider } from "./hooks/useAuth";

dayjs.locale('es-do')

const theme = createTheme({});

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <MantineProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Notifications />
          <DatesProvider settings={{ locale: "es-do" }}>
            <Routes>
              <Route path="login" element={<Login />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <ConfirmationProvider>
                      <StudentsProvider>
                        <App />
                      </StudentsProvider>
                    </ConfirmationProvider>
                  </ProtectedRoute>
                }
              >
                <Route path="estudiantes" element={<Students />} />
                <Route path="profesores" element={<Teachers />} />
                <Route path="grupos" element={<Groups />} />
                <Route path="servicios" element={<Services />} />
                <Route
                  path="estudiantes/:id/pagos"
                  element={<StudentPayments />}
                />
                <Route
                  path="grupos/:id/asistencia"
                  element={<GroupAttendance />}
                />
                <Route
                  path="servicios/:id/pagos/:paymentId?"
                  element={<ServicesPayment />}
                />
                <Route
                  path="estudiantes/:id/grupos"
                  element={<StudentGroups />}
                />
                <Route
                  path="estudiantes/:id/asistencias"
                  element={<StudentAssists />}
                />
                <Route path="estudiantes/:id" element={<StudentView />} />
                <Route path="servicio/:id?" element={<ServiceView />} />
                <Route path="grupo/:id?" element={<GroupView />} />
                <Route path="profesor/:id?" element={<TeacherView />} />
                <Route path="profesores/:id/pagos" element={<TeacherPayments />} />
                <Route path="profesores/:id/pagos/formulario/:paymentId?" element={<TeacherPaymentForm />} />
                <Route path="cambio-password" element={<PasswordChange />} />
              </Route>
              <Route path="formulario" element={<RegistrationForm />} />
              <Route path="formulario/:id" element={<RegistrationForm />} />
            </Routes>
          </DatesProvider>
        </LocalizationProvider>
      </MantineProvider>
    </AuthProvider>
  </BrowserRouter>
);
