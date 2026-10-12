import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ToastProvider } from './context/ToastContext';
import { AppDataProvider } from './context/AppDataContext';
import { RouterProvider } from './context/RouterContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ToastProvider>
      <AppDataProvider>
        <RouterProvider>
          <App />
        </RouterProvider>
      </AppDataProvider>
    </ToastProvider>
  </React.StrictMode>,
);
