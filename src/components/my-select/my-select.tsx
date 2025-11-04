"use client"
import React, { useState, useEffect, useMemo, useRef, useContext } from 'react';
import { ButtonHorizontalMode, MySelectListMode, MySelectObjectItem } from '../../types/my-select';
import MySelectList from './my-select-list';
import { CommonSize } from '../../types/common';
import "./my-select.css"

interface MySelectProps<T> {
    pageContainer?: HTMLElement; // 页面容器按钮
    list: T[]; // 列表数据
    listHeight?: number; // 列表高度
    listMode?: MySelectListMode; // 列表渲染模式，默认向下拉
    buttonHorizontalMode?: ButtonHorizontalMode; // 按钮是否水平居中
    labelIsValue?: boolean; // 显示标签是否显示为值
    modelValue: string | number;
    width?: number | string;
    size?: CommonSize;
    prop?: {
        label: string;
        value: string;
    };
    onChange?: <T>(value: string | number, item: T) => void;
    onUpdateModelValue?: (value: string | number) => void;
    onButtonClick?: () => void;
}

// 创建 Context 替代 Vue 的 inject
const FormSizeContext = React.createContext<string>("middle");

const MySelect = <T,>({
                                               pageContainer,
                                               list,
                                               listHeight,
                                               listMode,
                                               buttonHorizontalMode,
                                               labelIsValue,
                                               modelValue,
                                               width,
                                               size,
                                               prop,
                                               onChange,
                                               onUpdateModelValue,
                                               onButtonClick
                                           }: MySelectProps<T>) => {
    const [selectMode, setSelectMode] = useState<MySelectListMode>();
    const [listIsShow, setListIsShow] = useState(false);
    const [currentInfo, setCurrentInfo] = useState<T>({});
    const [isClient, setIsClient] = useState(false);
    const id = useMemo(() => `my-select-container-${Math.random().toString(36).split(".")[1]}`, []);

    const containerRef = useRef<HTMLDivElement | null>(null);

    // 模拟 Vue 的 inject
    const formSize = useContext(FormSizeContext);
// 在 useEffect 中设置客户端标志
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
            if (labelIsValue) {
                return item === modelValue;
            }
            return (item as MySelectObjectItem)[renderProp.value] === modelValue;
        }) || "";

        setCurrentInfo(foundItem);
        console.log("currentInfo.value =", foundItem);
    }, [list, modelValue, labelIsValue, renderProp.value]);

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
        console.log("listMode=", listMode)
        if (listMode) {
            return listMode;
        }
        if (!pageContainer) {
            return "down";
        }
        console.log("pageContainer=",pageContainer)
        const positionInfo = pageContainer.current?.getBoundingClientRect();
        const pageClientHeight = document.body.clientHeight;
        const optionsHeight = (list?.length || 0) * 30;
        const optionHeight = optionsHeight + 70;
        console.log("positionInfo=", positionInfo)
        console.log("pageClientHeight=", pageClientHeight)
        console.log("optionsHeight=", optionsHeight)
        console.log("optionHeight=", optionHeight)
        return positionInfo.bottom + optionHeight > pageClientHeight ? "up" : "down";
    };

    // 按钮点击处理
    const buttonClick = () => {
        setSelectMode(getListPositionMode());
        setListIsShow(!listIsShow);
        onButtonClick?.();
    };

    // 选择选项处理
    const chooseOption = (item: T) => {
        const value = labelIsValue ? item : item[renderProp.value || "value"];
        onUpdateModelValue?.(value);
        onChange && onChange(value, item);
        setListIsShow(false);
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
    return <div
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
            <span className="select-current-label">{currentInfo[renderProp.label]}</span>
        </div>
        <MySelectList
            list={list || []}
            listHeight={listHeight}
            selectMode={selectMode}
            currentValue={currentInfo[renderProp.value]}
            listIsShow={listIsShow}
            prop={renderProp}
            onChooseOption={chooseOption}
            onLeave={() => setListIsShow(false)}
        />
    </div>
};

export default MySelect;
export { FormSizeContext };
