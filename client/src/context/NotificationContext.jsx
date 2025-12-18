import Notifications from "@/components/Notifications";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n._id !== id));
  };

  const addNotification = useCallback((message) => {
    setNotifications((prev) => [...prev, message]);

    setTimeout(() => {
      removeNotification(message._id.toString());
    }, 5000);
  }, []);

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      <Notifications
        notifications={notifications}
        remove={removeNotification}
      />
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
