"use client"

import { Dialog } from "@ark-ui/react";
import { useEffect, useState } from "react";
import IconPlus from "../icons/icon-plus";



interface Props {
    open: boolean;
    msg: string;
    type: "success" | "error" | "info"
    onClose: () => void;
}

export default function BlogToast({ open, onClose, msg, type }: Props) {
    const [isOpen, setOpen] = useState(false);

    useEffect(() => {
        setOpen(open);
    }, [open]);



    /**
     * 关闭
     */
    const handleClose = () => {
        onClose();
    };
    /**
     * 获取文本颜色
     * @param type
     */
    const getTextColor = (type: string) => {
        switch (type) {
            case "success":
                return "text-green-500";
            case "error":
                return "text-red-500";
            default:
                return "text-gray-500";
        }
    }


    return <Dialog.Root open={isOpen}>
        <Dialog.Backdrop
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            onClick={handleClose}
        />
        <Dialog.Positioner className="fixed inset-0 flex items-center justify-center p-4 z-[100]">
            <Dialog.Content className="bg-white rounded-lg shadow-xl w-full max-w-xs p-6 relative">
                <Dialog.Title className="text-lg font-semibold mb-2">
                    <div className="flex items-center gap-2">提示</div>
                </Dialog.Title>

                <Dialog.Description>
                    <div className={`form mt-4 ${getTextColor(type)}`}>
                        {msg}
                    </div>
                    <div className={"flex mt-6 justify-end"}>
                       <button className={"theme-bg px-4 py-1 text-white rounded-sm"} onClick={handleClose}>知道了</button>
                    </div>
                </Dialog.Description>

                {/* 关闭按钮 */}
                <Dialog.CloseTrigger
                    className="close-btn absolute top-3 right-3 w-8 h-8"
                    onClick={handleClose}
                >
            <span className="rotate-45 text-sm cursor-pointer flex items-center justify-center">
              <IconPlus color="#999999" width={26} height={26} />
            </span>
                </Dialog.CloseTrigger>
            </Dialog.Content>
        </Dialog.Positioner>
    </Dialog.Root>
}