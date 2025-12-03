import React, { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IoAddOutline } from "react-icons/io5";
import { Input } from "@/components/ui/input";
import { animationDefaultOptions } from "@/lib/utils";
import Lottie from "react-lottie";

const NewDM = () => {
  const [newDMModalOpen, setNewDMModalOpen] = useState(false);
  const [searchContacts, setSearchContacts] = useState("");
  return (
    <div>
      <Tooltip>
        <TooltipTrigger
          className="text-xl text-gray-400/90 cursor-pointer hover:text-gray-300 active:text-gray-500"
          onClick={() => {
            setNewDMModalOpen(true);
          }}
        >
          <IoAddOutline />
        </TooltipTrigger>
        <TooltipContent>Новий особистий чат</TooltipContent>
      </Tooltip>
      <Dialog open={newDMModalOpen} onOpenChange={setNewDMModalOpen}>
        <DialogContent className="bg-zinc-900 border-0 text-zinc-100 w-[90vw] max-w-[420px] h-[420px] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-center">
              Новий особистий чат
            </DialogTitle>
          </DialogHeader>
          <div>
            <Input
              placeholder="Пошук контактів"
              className="border-none outline-none bg-zinc-800 text-zinc-300 placeholder:text-zinc-400 p-4 my-2 focus-visible:ring-0"
              onChange={(e) => {
                setSearchContacts(e.target.value);
              }}
            />
          </div>
          <div className="flex-1 md:bg-zinc-900 md:flex flex-col justify-center items-center hidden duration-1000 transition-all">
            {searchContacts.length > 0 ? (
              <></>
            ) : (
              <>
                <Lottie
                  isClickToPauseDisabled={true}
                  height={120}
                  width={120}
                  options={animationDefaultOptions}
                />
                <div className="text-center roboto-condensed-500">
                  <p className="text-purple-500 text-2xl my-2">Привіт!</p>
                  <p className="text-xl">Знайди контакт, щоб почати розмову!</p>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewDM;
