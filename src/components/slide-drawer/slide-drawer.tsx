import { Dialog } from "@ark-ui/react";
import { ReactNode, useState, useEffect } from "react";
import "./slide-drawer.css";
import IconPlus from "../icons/icon-plus";

interface SlideDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    children: ReactNode;
    width?: string;
}

export default function SlideDrawer({
                                        open,
                                        onOpenChange,
                                        title,
                                        children,
                                        width = "400px"
                                    }: SlideDrawerProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (open) {
            setIsVisible(true);
        }
    }, [open]);

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
                className={`drawer-backdrop ${isVisible ? 'drawer-open' : 'drawer-close'}`}
                onClick={handleBackdropClick}
            />
            <Dialog.Positioner className="drawer-positioner">
                <Dialog.Content
                    className={`drawer-content ${isVisible ? 'drawer-open' : 'drawer-close'}`}
                    style={{ width }}
                >
                    {/* 标题栏 */}
                    {title && (
                        <Dialog.Title className="drawer-title">
                            {title}
                        </Dialog.Title>
                    )}

                    {/* 内容区域 */}
                    <div className="drawer-body">
                        {children}
                    </div>

                    {/* 关闭按钮 */}
                    <Dialog.CloseTrigger
                        className="drawer-close-btn"
                        onClick={handleClose}
                    >
                        <span className="rotate-45">
                            <IconPlus/>
                        </span>
                    </Dialog.CloseTrigger>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    );
}