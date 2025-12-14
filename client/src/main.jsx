import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";
import "./index.css";
import App from "./App.jsx";
import { SocketProvider } from "./context/SocketContext";
import { ThemeProvider } from "./context/ThemeContext";

createRoot(document.getElementById("root")).render(
  // <StrictMode>

  <SocketProvider>
    <ThemeProvider>
      <App />
      <Toaster position="top-center" closeButton />
    </ThemeProvider>
  </SocketProvider>

  // </StrictMode>,
);
