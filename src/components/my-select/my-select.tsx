"use client"
import React, { useState, useEffect, useMemo, useRef, useContext } from 'react';
import { ButtonHorizontalMode, MySelectListMode, MySelectObjectItem } from '../../types/my-select';
import MySelectList from './my-select-list';
import { CommonSize } from '../../types/common';
import "./my-select.css"

interface MySelectProps {
    pageContainer?: React.RefObject<HTMLElement>;
    list: MySelectObjectItem[];
    listHeight?: number;
    listMode?: MySelectListMode;
    buttonHorizontalMode?: ButtonHorizontalMode;
    modelValue: string | number;
    width?: number | string;
    size?: CommonSize;
    prop?: {
        label: string;
        value: string;
    };
    onChange?: (value: string | number, item: MySelectObjectItem) => void; // 修复这里
    onUpdateModelValue?: (value: string | number) => void;
    onButtonClick?: () => void;
}

const FormSizeContext = React.createContext<string>("middle");

const MySelect = ({
                          pageContainer,
                          list,
                          listHeight,
                          listMode,
                          buttonHorizontalMode,
                          modelValue,
                          width,
                          size,
                          prop,
                          onChange,
                          onUpdateModelValue,
                          onButtonClick
                      }: MySelectProps) => {
    const [selectMode, setSelectMode] = useState<MySelectListMode>();
    const [listIsShow, setListIsShow] = useState(false);
    const [currentInfo, setCurrentInfo] = useState<MySelectObjectItem | null>(null); // 修复类型
    const [isClient, setIsClient] = useState(false);
    const id = useMemo(() => `my-select-container-${Math.random().toString(36).slice(2)}`, []);

    const containerRef = useRef<HTMLDivElement | null>(null);
    const formSize = useContext(FormSizeContext);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // 计算 renderProp
    const renderProp = useMemo(() => {
        if (!prop) {
            return {
                label: "label",
                value: "value"
            };
        }
        return {
            label: prop.label || "label",
            value: prop.value || "value"
        };
    }, [prop]);

    // 计算 selectWidth
    const selectWidth = useMemo(() => {
        if (!width) {
            return "120px";
        }
        return typeof width === "number" ? `${width}px` : width;
    }, [width]);

    // 计算 selectSize
    const selectSize = useMemo(() => {
        return size || formSize;
    }, [size, formSize]);

    // 高度值映射
    const heightValues = {
        large: 83,
        middle: 53,
        small: 30,
    };

    // 监听 list 变化
    useEffect(() => {
        setListIsShow(false);
    }, [list]);

    // 监听 modelValue 和 list 变化，更新 currentInfo
    useEffect(() => {
        if (!Array.isArray(list)) {
            return;
        }

        const foundItem = list.find(item => {
            // 安全的属性访问
            if (typeof item === 'object' && item !== null) {
                return (item as Record<string, unknown>)[renderProp.value] === modelValue;
            }
            return item === modelValue;
        }) || null;

        setCurrentInfo(foundItem);
    }, [list, modelValue, renderProp.value]);

    // 处理点击外部区域
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            const selectContainer = document.getElementById(id);

            if (selectContainer && !selectContainer.contains(target)) {
                setListIsShow(false);
            }
        };

        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [id]);

    // 获取列表位置模式
    const getListPositionMode = (): MySelectListMode => {
        if (listMode) {
            return listMode;
        }
        if (!pageContainer) {
            return "down";
        }
        const positionInfo = pageContainer.current?.getBoundingClientRect();
        const pageClientHeight = document.body.clientHeight;
        const optionsHeight = (list?.length || 0) * 30;
        const optionHeight = optionsHeight + 70;
        return positionInfo?.bottom && positionInfo.bottom + optionHeight > pageClientHeight ? "up" : "down";
    };

    // 按钮点击处理
    const buttonClick = () => {
        setSelectMode(getListPositionMode());
        setListIsShow(!listIsShow);
        onButtonClick?.();
    };

    // 选择选项处理 - 修复类型问题
    const chooseOption = (item: MySelectObjectItem) => {
        const value = item[renderProp.value || "value"] as string | number
        onUpdateModelValue?.(value)
        onChange?.(value, item);
        setListIsShow(false);
    };

    // 获取当前显示的标签
    const getCurrentLabel = (): string => {
        if (!currentInfo) return "";


        if (currentInfo) {
            return String((currentInfo as Record<string, unknown>)[renderProp.label] || "");
        }

        return String(currentInfo);
    };

    // 获取当前值
    const getCurrentValue = (): string | number => {
        if (!currentInfo) return "";

        return currentInfo[renderProp.value] as string | number
    };

    // 服务端渲染时返回简单的占位符
    if (!isClient) {
        return (
            <div
                className={`my-select-container flex justify-center items-center select-${selectSize}`}
                style={{
                    width: selectWidth,
                    height: `${heightValues[selectSize as keyof typeof heightValues]}px`
                }}
            >
                <div className="select-current-label-container flex items-center justify-between">
                    <span className="select-current-label">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div
            id={id}
            ref={containerRef}
            className={`my-select-container flex justify-center items-center select-${selectSize}`}
            style={{ width: selectWidth, height: `${heightValues[selectSize as keyof typeof heightValues]}px` }}
            onClick={buttonClick}
        >
            <div
                className={`select-current-label-container flex ${
                    listIsShow ? 'select-current-label-container-list-show' : ''
                } items-center justify-${buttonHorizontalMode || 'between'}`}
            >
                <span className="select-current-label">{getCurrentLabel()}</span>
            </div>
            <MySelectList
                list={list || []}
                listHeight={listHeight}
                selectMode={selectMode}
                currentValue={getCurrentValue()}
                listIsShow={listIsShow}
                prop={renderProp}
                onChooseOption={chooseOption}
                onLeave={() => setListIsShow(false)}
            />
        </div>
    );
};

export default MySelect;
export { FormSizeContext };