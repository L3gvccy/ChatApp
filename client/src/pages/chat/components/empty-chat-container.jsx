import React from "react";
import Lottie from "react-lottie";
import { animationDefaultOptions } from "@/lib/utils";

const EmptyChatContainer = () => {
  return (
    <div className="flex-1 md:bg-zinc-900 md:flex flex-col justify-center items-center hidden duration-1000 transition-all">
      <Lottie
        isClickToPauseDisabled={true}
        height={200}
        width={200}
        options={animationDefaultOptions}
      />
      <div className="text-center roboto-condensed-500">
        <p className="text-purple-500 text-4xl my-5">Привіт!</p>
        <p className="text-2xl">
          Раді бачити тебе у <span className="text-purple-500">QChat!</span>
        </p>
      </div>
    </div>
  );
};

export default EmptyChatContainer;
