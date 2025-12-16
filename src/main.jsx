import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthWrapper } from "./context/auth.wrapper.jsx";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import AppRouter from './appRouter.jsx';
import './styles/global.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      {(() => {
        if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
          // eslint-disable-next-line no-console
          console.warn("VITE_GOOGLE_CLIENT_ID is not set. Google login will not work until you set it and restart the dev server.");
        }
      })()}
      <AuthWrapper >
        <AppRouter />
        <ToastContainer position="top-right" newestOnTop />
      </AuthWrapper>
    </GoogleOAuthProvider>
  </StrictMode>,
)
