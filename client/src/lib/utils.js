import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import animationData from "@/assets/chatLottie.json";

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
