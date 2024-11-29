import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import './index.css'
import App from './App.jsx'
import RegistrationForm from './pages/RegistrationForm.jsx'
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import 'dayjs/locale/es-do.js';
import { DatesProvider } from '@mantine/dates';

import { MantineProvider, createTheme } from '@mantine/core';

const theme = createTheme({});

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <MantineProvider theme={theme}>
      <DatesProvider settings={{ locale: 'es-do' }}>
        <Routes>
          <Route index element={<App />} />
          <Route path="formulario" element={<RegistrationForm />} />
        </Routes>
      </DatesProvider>
    </MantineProvider>
  </BrowserRouter>
)
