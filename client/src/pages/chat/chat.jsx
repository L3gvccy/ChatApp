import { useAppStore } from "@/store";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Chat() {
  const { userInfo } = useAppStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (!userInfo.profileSetup) {
      toast.warning("Ви маєте заповнити профіль для продовження");
      navigate("/profile");
    }
  }, [userInfo, navigate]);

  return (
    <div>
      <p>Chat</p>
    </div>
  );
}
