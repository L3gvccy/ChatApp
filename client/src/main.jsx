import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";
import "./index.css";
import App from "./App.jsx";
import { SocketProvider } from "./context/SocketContext";
import { ThemeProvider } from "./context/ThemeContext";

import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/uk";
import { NotificationProvider } from "./context/NotificationContext";

dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);

const supportedLocales = ["uk", "en"];
const browserLocale = navigator.language || "en";
const locale = browserLocale.split("-")[0];

dayjs.locale(supportedLocales.includes(locale) ? locale : "en");

console.log(dayjs.locale());

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <NotificationProvider>
    <SocketProvider>
      <ThemeProvider>
        <App />
        <Toaster position="top-center" closeButton />
      </ThemeProvider>
    </SocketProvider>
  </NotificationProvider>

  // </StrictMode>,
);
