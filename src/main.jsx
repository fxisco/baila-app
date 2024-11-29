import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import './index.css'
import App from './App.jsx'
import '@mantine/core/styles.css';

import { MantineProvider, createTheme } from '@mantine/core';

const theme = createTheme({});

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <MantineProvider theme={theme}>
      <Routes>
        <Route path="/" element={<App />} />
      </Routes>
    </MantineProvider>
  </BrowserRouter>
)
