import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";
import "./index.css";
import App from "./App.jsx";
import { SocketProvider } from "./context/SocketContext";
import { ThemeProvider } from "./context/ThemeContext";

import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/uk";

dayjs.extend(localizedFormat);

const supportedLocales = ["uk", "en"];
const browserLocale = navigator.language || "en";
const locale = browserLocale.split("-")[0];

dayjs.locale(supportedLocales.includes(locale) ? locale : "en");

console.log(dayjs.locale());

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
