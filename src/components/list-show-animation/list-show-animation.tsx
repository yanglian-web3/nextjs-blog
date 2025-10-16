
"use client"
import React, { useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import './list-show-animation.css';

interface ListShowAnimationProps {
    maxHeight?: number;
    children: React.ReactNode;
    onLeave?: () => void;
}

const ListShowAnimation: React.FC<ListShowAnimationProps> = ({
                                                                 maxHeight,
                                                                 children,
                                                                 onLeave
                                                             }) => {
    const nodeRef = useRef<HTMLDivElement | null>(null);

    const beforeEnter = () => {
        if (nodeRef.current) {
            nodeRef.current.style.maxHeight = "0px";
        }
    };

    const enter = () => {
        if (nodeRef.current) {
            const actualMaxHeight = Math.max(maxHeight || 0, nodeRef.current.scrollHeight);
            nodeRef.current.style.maxHeight = `${actualMaxHeight}px`;
        }
    };

    const leave = () => {
        if (nodeRef.current) {
            nodeRef.current.style.maxHeight = "0px";
        }
        onLeave?.();
    };

    return (
        <CSSTransition
            nodeRef={nodeRef}
            classNames="list-show"
            timeout={300}
            onEnter={beforeEnter}
            onEntering={enter}
            onExit={leave}
        >
            <div ref={nodeRef}>
                {children}
            </div>
        </CSSTransition>
    );
};

export default ListShowAnimation;
