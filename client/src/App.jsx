import React, { useEffect } from "react";
import { useState } from "react";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import Auth from "./pages/auth/auth";
import Chat from "./pages/chat/chat";
import Profile from "./pages/profile/profile";
import { useAppStore } from "./store";
import { PropagateLoader } from "react-spinners";
import { apiClient } from "./lib/api-client";
import { GET_USER_INFO } from "./utils/constants";

const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth" />;
};
const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to="/chat" /> : children;
};

function App() {
  const { userInfo, setUserInfo } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      await apiClient
        .get(GET_USER_INFO, { withCredentials: true })
        .then((res) => {
          if (res.status === 200) {
            setUserInfo(res.data.user);
          } else {
            setUserInfo(undefined);
          }
        })
        .catch((err) => {
          setUserInfo(undefined);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    if (!userInfo) {
      getUserData();
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen w-screen justify-center items-center dark:bg-zinc-900">
        <PropagateLoader color="#7e22ce" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth"
          element={
            <AuthRoute>
              <Auth />
            </AuthRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
