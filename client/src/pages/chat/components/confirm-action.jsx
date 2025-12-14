import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { useState } from "react";

const ConfirmAction = (props) => {
  const { open, setOpen, onConfirm, text } = props;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="dark:bg-zinc-900 border-0 dark:text-zinc-100 w-[90vw] max-w-[340px] min-h-0 flex flex-col gap-5 p-4">
        <DialogHeader>
          <DialogTitle>
            <div className="text-center text-lg font-semibold">
              Підтвердження
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="text-center">{text}</div>
        <div className="flex justify-center items-center gap-4">
          <button
            className="bg-green-700 hover:bg-green-600 active:bg-green-800 text-white px-4 py-2 rounded-lg transition-all duration-300"
            onClick={async () => {
              await onConfirm();
              setOpen(false);
            }}
          >
            Підтвердити
          </button>
          <button
            className="bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white px-4 py-2 rounded-lg transition-all duration-300"
            onClick={() => {
              setOpen(false);
            }}
          >
            Скасувати
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmAction;
