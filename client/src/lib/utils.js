import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import animationData from "@/assets/chatLottie.json";
import { useAppStore } from "@/store";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const colors = [
  "bg-purple-900 text-purple-300 border-3 border-purple-700",
  "bg-cyan-900 text-cyan-300 border-3 border-cyan-700",
  "bg-emerald-900 text-emerald-300 border-3 border-emerald-700",
  "bg-amber-900 text-amber-300 border-3 border-amber-700",
  "bg-rose-900 text-rose-300 border-3 border-rose-700",
];

export const getColor = (color) => {
  if (color >= 0 && color < colors.length) return colors[color];
  return colors[0];
};

export const animationDefaultOptions = {
  loop: true,
  autoplay: true,
  animationData,
};

export const getFileName = (fileUrl) => {
  return fileUrl.split("/").pop().split("?")[0];
};

export const initUreadCounts = (res) => {
  const { setUnreadCounts } = useAppStore.getState();
  setUnreadCounts(res);
};

export const AddUnreadCount = (id) => {
  const { unreadCounts, setUnreadCounts } = useAppStore.getState();

  const currentVal = unreadCounts[id] || 0;

  setUnreadCounts({
    ...unreadCounts,
    [id]: currentVal + 1,
  });
};

export const ResetUnreadCount = (id) => {
  const { unreadCounts, setUnreadCounts } = useAppStore.getState();

  setUnreadCounts({
    ...unreadCounts,
    [id]: 0,
  });
};

export const getUnreadCount = (id) => {
  const { unreadCounts } = useAppStore.getState();

  return unreadCounts[id] || 0;
};
