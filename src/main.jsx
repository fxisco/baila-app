import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import App from './App.jsx'
import RegistrationForm from './pages/RegistrationForm.jsx'
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import 'dayjs/locale/es-do.js';
import { DatesProvider } from '@mantine/dates';
import { MantineProvider, createTheme } from '@mantine/core';
import Groups from "./pages/Groups";
import Services from "./pages/Services";
import Teachers from "./pages/Teachers";
import Students from "./pages/Students";
import { StudentsProvider } from "./providers/StudentsProvider";

const theme = createTheme({});

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <MantineProvider theme={theme}>
      <DatesProvider settings={{ locale: 'es-do' }}>
        <Routes>
          <Route path="/dashboard" element={
              <StudentsProvider>
                <App />
              </StudentsProvider>
            }>
            <Route index element={<Students />} />
            <Route path="grupos" element={<Groups />} />
            <Route path="profesores" element={<Teachers />} />
            <Route path="servicios" element={<Services />} />
          </Route>
          <Route path="formulario" element={<RegistrationForm />} />
        </Routes>
      </DatesProvider>
    </MantineProvider>
  </BrowserRouter>
)
