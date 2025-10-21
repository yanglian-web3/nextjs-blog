import { Dialog } from "@ark-ui/react";
import { ReactNode, useState, useEffect } from "react";
import "./slide-drawer.css";
import IconPlus from "../icons/icon-plus";

interface SlideDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string | ReactNode;
    children: ReactNode;
    width?: string;
}

export default function SlideDrawer({
                                        open,
                                        onOpenChange,
                                        title,
                                        children,
                                        width = "600px"
                                    }: SlideDrawerProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (open) {
            setIsVisible(true);
        }
    }, [open]);

    /**
     * 关闭
     */
    const handleClose = () => {
        setIsVisible(false);
        // 等待动画完成后再真正关闭
        setTimeout(() => {
            onOpenChange(false);
        }, 300); // 与 CSS 动画持续时间一致
    };

    const handleBackdropClick = (e: any) => {
        if (e.target.classList.contains('drawer-backdrop')) {
            handleClose();
        }
    };

    return (
        <Dialog.Root open={open} onOpenChange={(e) => !e.open && handleClose()}>
            <Dialog.Backdrop
                className={`drawer-backdrop fixed ${isVisible ? 'drawer-open' : 'drawer-close'}`}
                onClick={handleBackdropClick}
            />
            <Dialog.Positioner className="drawer-positioner fixed flex justify-end">
                <Dialog.Content
                    className={`drawer-content relative h-screen bg-white flex flex-col ${isVisible ? 'drawer-content-open' : 'drawer-content-close'}`}
                    style={{ width }}
                >
                    {/* 标题栏 */}
                    {title && (
                        <Dialog.Title className="drawer-title p-5 text-xl font-semibold">
                            {title}
                        </Dialog.Title>
                    )}

                    {/* 内容区域 */}
                    <div className="drawer-body flex-1 p-5 overflow-auto">
                        {children}
                    </div>

                    {/* 关闭按钮 */}
                    <Dialog.CloseTrigger
                        className="drawer-close-btn absolute top-5 right-5 w-8 h-8"
                        onClick={handleClose}
                    >
                        <span className="rotate-45 text-sm cursor-pointer flex items-center justify-center">
                            <IconPlus color={"#999999"} width={20} height={20}/>
                        </span>
                    </Dialog.CloseTrigger>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    );
}