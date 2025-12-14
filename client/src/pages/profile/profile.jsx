import { useAppStore } from "@/store";
import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  IoArrowBack,
  IoLogOutOutline,
  IoTrash,
  IoAddOutline,
} from "react-icons/io5";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { colors, getColor } from "@/lib/utils";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import {
  DELETE_PROFILE_IMAGE,
  LOGOUT_ROUTE,
  UPDATE_PROFILE_ROUTE,
  UPLOAD_PROFILE_IMAGE,
} from "@/utils/constants";

export default function Profile() {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();
  const [firstName, setFirstName] = useState(userInfo.firstName || "");
  const [lastName, setLastName] = useState(userInfo.lastName || "");
  const [image, setImage] = useState(null);
  const [imagePublicId, setImagePublicId] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(userInfo.color || 0);
  const fileInputRef = useRef(null);

  const handleNavigate = () => {
    userInfo.profileSetup
      ? navigate("/chat")
      : toast.warning("Ви маєте заповнити профіль для продовження");
  };

  const validateProfileUpdate = () => {
    if (!firstName) {
      toast.error("Ім'я обов'язкове");
      return false;
    }
    if (!lastName) {
      toast.error("Прізвище обов'язкове");
      return false;
    }

    return true;
  };

  const saveChanges = async () => {
    if (validateProfileUpdate()) {
      await apiClient
        .post(
          UPDATE_PROFILE_ROUTE,
          { firstName, lastName, color: selectedColor },
          { withCredentials: true }
        )
        .then((res) => {
          if (res.status === 200) {
            setUserInfo(res.data.user);
            toast.success("Дані профілю успішно оновлено");
          }
        })
        .catch((err) => {
          const msg = err.response?.data;
          toast.error(msg);
        });
    }
  };

  const handleLogout = async () => {
    await apiClient
      .post(LOGOUT_ROUTE, {}, { withCredentials: true })
      .then((res) => {
        if (res.status === 200) {
          const msg = res.data;
          toast.success(msg);
          setUserInfo(null);
        }
      })
      .catch((err) => {
        const msg = err.response?.data;
        toast.error(msg);
      })
      .finally(() => {
        navigate("/auth");
      });
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    await apiClient
      .post(
        UPLOAD_PROFILE_IMAGE,
        { image: file },
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res.status === 201) {
          setUserInfo(res.data.user);
          toast.success("Фото профілю успішно оновлено");
        }
      })
      .catch((err) => {
        const msg = err.response?.data;
        toast.error(msg);
      });
  };

  const handleImageDelete = async () => {
    await apiClient
      .delete(DELETE_PROFILE_IMAGE, { withCredentials: true })
      .then((res) => {
        if (res.status === 200) {
          setUserInfo(res.data.user);
          toast.success("Фото профілю успішно видалено");
        }
      })
      .catch((err) => {
        const msg = err.response?.data;
        toast.error(msg);
      });
  };

  useEffect(() => {
    setImage(userInfo.image);
    setImagePublicId(userInfo.imagePublicId);
  }, [userInfo, navigate]);

  useEffect(() => {
    document.title = "QChat - Профіль";
  }, []);

  return (
    <div className="dark:bg-zinc-900 h-screen w-screen flex flex-col justify-center items-center gap-5">
      <div className="flex w-[90vw] justify-between">
        <IoArrowBack
          className="text-4xl text-zinc-700 hover:text-zinc-600 active:text-zinc-800 dark:text-zinc-300 dark:hover:text-zinc-100 dark:active:text-zinc-400 cursor-pointer"
          onClick={() => {
            handleNavigate();
          }}
        />
        <h2 className="text-zinc-800 dark:text-zinc-100 text-3xl font-semibold">
          Профіль
        </h2>
        <IoLogOutOutline
          className="text-4xl text-zinc-700 hover:text-zinc-600 active:text-zinc-800 dark:text-zinc-300 dark:hover:text-zinc-100 dark:active:text-zinc-400 cursor-pointer"
          onClick={handleLogout}
        />
      </div>

      <div className="dark:bg-zinc-800 rounded-3xl w-[90vw] max-w-[480px] h-[80vh] shadow-2xl p-6 flex items-center">
        <div className="w-full flex flex-col gap-10">
          <div className="flex items-center justify-center">
            <div
              className="h-24 w-24 relative"
              onMouseEnter={() => {
                setHovered(true);
              }}
              onMouseLeave={() => {
                setHovered(false);
              }}
            >
              <Avatar className="h-24 w-24 rounded-full overflow-hidden ">
                {image ? (
                  <AvatarImage
                    src={image}
                    alt="Фото профілю"
                    className="object-cover w-full h-full bg-black"
                  />
                ) : (
                  <div
                    className={`uppercase h-24 w-24 text-5xl rounded-full flex justify-center items-center ${getColor(
                      selectedColor
                    )}`}
                  >
                    {firstName
                      ? firstName.split("").shift()
                      : userInfo.email.split("").shift()}
                  </div>
                )}
              </Avatar>
              {hovered && (
                <div
                  className="absolute inset-0 w-24 text-4xl text-gray-100 flex justify-center items-center bg-black/50 rounded-full cursor-pointer"
                  onClick={image ? handleImageDelete : handleFileInputClick}
                >
                  {image ? <IoTrash /> : <IoAddOutline />}
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                name="profile-image"
                accept=".png, .jpg, .jpeg, .svg, .webp"
                onChange={handleImageUpload}
              />
            </div>
          </div>

          <div className="flex flex-col gap-5 w-full">
            <div className="flex justify-around">
              {colors.map((color, i) => (
                <div
                  className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-200 ${
                    i == selectedColor &&
                    "outline-3 outline-black/80 dark:outline-gray-100/60"
                  }`}
                  key={i}
                  onClick={() => {
                    setSelectedColor(i);
                  }}
                ></div>
              ))}
            </div>

            <Input
              placeholder="Email"
              type="email"
              disabled
              value={userInfo.email}
              className="p-6 rounded-lg bg-zinc-100 dark:bg-zinc-600 dark:text-white border-none"
            />
            <Input
              placeholder="Ім'я"
              type="text"
              value={firstName}
              className="p-6 rounded-lg  bg-zinc-100 text-zinc-700 dark:bg-zinc-600 dark:text-white dark:placeholder:text-gray-400 border-none"
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
            />
            <Input
              placeholder="Прізвище"
              type="text"
              value={lastName}
              className="p-6 rounded-lg bg-zinc-100 text-zinc-700 dark:bg-zinc-600 dark:text-white dark:placeholder:text-gray-400 border-none"
              onChange={(e) => {
                setLastName(e.target.value);
              }}
            />
            <Button
              className="p-6 rounded-lg bg-purple-700 hover:bg-purple-600 active:bg-purple-800 text-white border-none cursor-pointer"
              onClick={() => {
                saveChanges();
              }}
            >
              Зберегти зміни
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
