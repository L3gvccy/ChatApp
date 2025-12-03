import React, { useEffect } from "react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { LOGIN_ROUTE, REGISTER_ROUTE } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";

export default function Auth() {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const validateRegister = () => {
    if (!email.length) {
      toast.error("Електронна пошта обов'язкова");
      return false;
    }
    if (!password.length) {
      toast.error("Пароль обов'язковий");
      return false;
    }
    if (password.length < 8) {
      toast.error("Довжина паролю має бути більшою за 8 символів");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Паролі не співпадають");
      return false;
    }

    return true;
  };

  const validateLogin = () => {
    if (!email.length) {
      toast.error("Електронна пошта обов'язкова");
      return false;
    }
    if (!password.length) {
      toast.error("Пароль обов'язковий");
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    if (!validateLogin()) return;
    await apiClient
      .post(LOGIN_ROUTE, { email, password }, { withCredentials: true })
      .then((res) => {
        if (res.status === 200) {
          setUserInfo(res.data.user);
          res.data.user.profileSetup ? navigate("/chat") : navigate("/profile");
        }
      })
      .catch((err) => {
        const msg = err.response?.data;
        toast.error(msg);
      })
      .finally(() => {
        userInfo.profileSetup ? navigate("/chat") : navigate("/profile");
      });
  };

  const handleRegister = async () => {
    if (!validateRegister()) return;

    await apiClient
      .post(REGISTER_ROUTE, { email, password }, { withCredentials: true })
      .then((res) => {
        if (res.status === 201) {
          toast.success("Ви успішно зареєструвались!");
        }
      })
      .catch((err) => {
        const status = err.response?.status;

        if (status === 409) {
          toast.error("Користувач з такою поштою вже зареєстрован");
        }
      });
  };

  useEffect(() => {
    document.title = "QChat - Авторизація";
  }, []);

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl rounded-3xl w-[90vw] max-w-[640px] grid">
        <div className="flex flex-col gap-10 items-center justify-center">
          <div className="flex flex-col items-center justify-center w-full gap-6">
            <h1 className="text-4xl font-semibold">Вітаємо у QChat!</h1>
            <img
              src="/logo.png"
              alt="logo"
              className="max-w-32 hidden md:block"
            />
            <p className="w-3/4 text-center">
              Увійдіть або зареєструйтесь, щоб скористатись нашим чатом!
            </p>
            <Tabs defaultValue="login" className="w-3/4 flex flex-col h-full">
              <TabsList className="bg-transparent rounded-none w-full">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-0 border-b-2 rounded-none w-full data-[state=active]:font-semibold data-[state=active]:border-b-purple-700 p-3 transition-all duration-300"
                >
                  Вхід
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:font-semibold data-[state=active]:border-b-purple-700 p-3 transition-all duration-300"
                >
                  Реєстрація
                </TabsTrigger>
              </TabsList>
              <div className="flex-1 flex items-center justify-center">
                <TabsContent value="login" className="flex flex-col gap-3">
                  <Input
                    placeholder="Email"
                    type="email"
                    className="rounded-xl p-3"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Input
                    placeholder="Пароль"
                    type="password"
                    className="rounded-xl p-3"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button
                    className="rounded-xl p-3 bg-purple-700 hover:bg-purple-600 active:bg-purple-800 cursor-pointer"
                    onClick={handleLogin}
                  >
                    Увійти
                  </Button>
                </TabsContent>
                <TabsContent value="register" className="flex flex-col gap-3">
                  <Input
                    placeholder="Email"
                    type="email"
                    className="rounded-xl p-3"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Input
                    placeholder="Пароль"
                    type="password"
                    className="rounded-xl p-3"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Input
                    placeholder="Повтор паролю"
                    type="password"
                    className="rounded-xl p-3"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <Button
                    className="rounded-xl p-3 bg-purple-700 hover:bg-purple-600 active:bg-purple-800 cursor-pointer"
                    onClick={handleRegister}
                  >
                    Зареєструватись
                  </Button>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
