import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import App from "./App.jsx";
import RegistrationForm from "./pages/RegistrationForm.jsx";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "dayjs/locale/es-do.js";
import { DatesProvider } from "@mantine/dates";
import { MantineProvider, createTheme } from "@mantine/core";
import Groups from "./pages/Groups";
import Services from "./pages/Services";
import Teachers from "./pages/Teachers";
import Students from "./pages/Students";
import StudentPayments from "./pages/StudentPayments";
import ServicesPayment from "./pages/ServicesPayment.jsx";
import StudentGroups from "./pages/StudentGroups";
import StudentAssists from "./pages/StudentAssists";
import StudentView from "./pages/StudentView";
import TeacherView from "./pages/TeacherView";
import ServiceView from "./pages/ServiceView";
import GroupView from "./pages/GroupView";
import { StudentsProvider } from "./providers/StudentsProvider";
import { ConfirmationProvider } from "./providers/ConfirmationProvider.jsx";
import { Notifications } from "@mantine/notifications";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "@mantine/notifications/styles.css";

const theme = createTheme({});

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <MantineProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Notifications />
        <DatesProvider settings={{ locale: "es-do" }}>
          <Routes>
            <Route
              element={
                <ConfirmationProvider>
                  <StudentsProvider>
                    <App />
                  </StudentsProvider>
                </ConfirmationProvider>
              }
            >
              <Route path="profesores" element={<Teachers />} />
              <Route path="grupos" element={<Groups />} />
              <Route path="servicios" element={<Services />} />
              <Route path="estudiantes" element={<Students />} />
              <Route
                path="estudiantes/:id/pagos"
                element={<StudentPayments />}
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
            </Route>
            <Route path="formulario" element={<RegistrationForm />} />
            <Route path="formulario/:id" element={<RegistrationForm />} />
          </Routes>
        </DatesProvider>
      </LocalizationProvider>
    </MantineProvider>
  </BrowserRouter>
);
