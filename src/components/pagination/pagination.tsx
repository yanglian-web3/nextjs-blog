"use client"
import React, { useState, useEffect, useRef, useMemo } from 'react';
import './pagination.css'; // 改为导入转换后的CSS文件
import { PaginationOptions } from '../../types/pagination';
import { MySelectItem } from '../../types/my-select';
import MySelect, { FormSizeContext } from '../my-select/my-select';

interface PaginationProps {
    options: Partial<PaginationOptions>;
    onChange?: (options: PaginationOptions) => void;
}

const defaultPaginationOptions: PaginationOptions = {
    current: 1,
    pageSize: 10,
    pageCount: 5,
    total: 0,
    showQuickJumper: true,
    showSizeChanger: true,
    pageSizeOptions: [10, 20, 30, 40]
};

const Pagination: React.FC<PaginationProps> = ({ options, onChange }) => {
    const [renderOptions, setRenderOptions] = useState<PaginationOptions>({ ...defaultPaginationOptions });
    const [inputValue, setInputValue] = useState<string>('');
    const paginationContainer = useRef<HTMLDivElement | null>(null);

    // 更新选项
    useEffect(() => {
        const newPaginationOptions = { ...defaultPaginationOptions, ...options };
        // console.log("use effect new_Pagination_Options=", newPaginationOptions)
        setRenderOptions(newPaginationOptions);
    }, []);

    // 计算总页数
    const pageNum = useMemo(() => {
        if (!renderOptions.pageSize) {
            return 0;
        }
        return Math.ceil(renderOptions.total / renderOptions.pageSize);
    }, [renderOptions.pageSize, renderOptions.total]);

    // 显示总数文本
    const totalText = useMemo(() => {
        const { showTotal, total, pageSize, current } = renderOptions;
        if (!showTotal) {
            return "";
        }
        const endRange = Math.min(total, current * pageSize);
        const currentPageSize = endRange === total ? total % pageSize : pageSize;
        return showTotal(total, [endRange - currentPageSize + 1, endRange]);
    }, [renderOptions]);

    // 页码选项列表
    const pageOptionList = useMemo(() => {
        if (!renderOptions.pageSizeOptions) {
            return [];
        }
        return renderOptions.pageSizeOptions.map(current => ({
            label: `${current}条/页`,
            value: current
        })) as MySelectItem[];
    }, [renderOptions.pageSizeOptions]);

    // 获取可见页码范围
    const getBetween = () => {
        const { pageCount = 0, current = 0 } = renderOptions;
        const halfCount = Math.floor(pageCount / 2);
        let min = current - halfCount;
        let max = current + halfCount;

        if (min < 1) {
            max += 1 - min;
            min = 1;
        }

        if (max > pageNum) {
            min -= max - pageNum;
            max = pageNum;
        }

        if (min < 1) {
            min = 1;
        }
        return { min, max };
    };

    // 获取可见页码数组
    const visiblePages = useMemo(() => {
        const { min, max } = getBetween();
        return Array.from({ length: max - min + 1 }, (_, i) => min + i);
    }, [renderOptions.current, pageNum]);

    // 分页按钮点击处理
    const handlePageButtonClick = (index: number) => {
        if (index < 1) index = 1;
        if (index > pageNum) index = pageNum;

        const newOptions = { ...renderOptions, current: index };
        setRenderOptions(newOptions);

        // 更新输入框的值
        if (renderOptions.showQuickJumper) {
            setInputValue(index.toString());
        }
        console.log("newOptions=", newOptions)
        // 触发回调
        onChange?.(newOptions);
    };

    // 跳转输入框处理
    const handleJumperInputChange = () => {
        const toNumberValue = parseInt(inputValue);

        if (isNaN(toNumberValue)) {
            setInputValue(renderOptions.current.toString());
            return;
        }

        let targetValue = toNumberValue;
        if (targetValue < 1) targetValue = 1;
        if (targetValue > pageNum) targetValue = pageNum;

        setInputValue(targetValue.toString());
        handlePageButtonClick(targetValue);
    };

    // 选择每页条数
    const handleChooseOption = (value: number) => {
        // console.log("_handle_choose_option value=", value)
        const newOptions = {
            ...renderOptions,
            pageSize: value,
            current: 1 // 重置为第一页
        };
        setRenderOptions(newOptions);
        onChange?.(newOptions);
    };

    // 渲染页码按钮
    const renderPageButtons = () => {
        return visiblePages.map(i => (
            <li
                key={i}
                className={`page-value-button page-button flex justify-center items-center ${
                    i === renderOptions.current ? 'active-button' : ''
                }`}
                onClick={() => handlePageButtonClick(i)}
            >
                {i}
            </li>
        ));
    };

    return (
        <div className="pagination-container flex items-center" ref={paginationContainer}>
            {typeof renderOptions.showTotal === 'function' && (
                <div className="flex items-center total-text page-block-item">{totalText}</div>
            )}

            <ul className="page-block-item pages flex justify-center items-center">
                <li
                    className={`page-prev page-button flex justify-center items-center ${
                        renderOptions.current <= 1 ? 'page-button-disabled' : ''
                    }`}
                    onClick={() => handlePageButtonClick(renderOptions.current - 1)}
                />

                {renderPageButtons()}

                <li
                    className={`page-next page-button flex justify-center items-center ${
                        renderOptions.current >= pageNum ? 'page-button-disabled' : ''
                    }`}
                    onClick={() => handlePageButtonClick(renderOptions.current + 1)}
                />
            </ul>

            {/* 注意：MySelect 组件需要另外实现或替换为现有的 React 组件 */}
            {renderOptions.showSizeChanger && (
                <div className="page-block-item">
                    {/* 模拟vue的provide reject */}
                    <FormSizeContext.Provider value="small">
                        <MySelect list={pageOptionList}
                                  modelValue={renderOptions.pageSize}
                                  pageContainer={paginationContainer}
                                  onChange={(value) => handleChooseOption(Number(value))} />
                    </FormSizeContext.Provider>

                </div>
            )}

            {renderOptions.showQuickJumper && (
                <div className="jumper page-block-item flex justify-center items-center">
                    <span>跳至</span>
                    <input
                        value={inputValue}
                        type="number"
                        min="1"
                        max={pageNum.toString()}
                        onChange={(e) => setInputValue(e.target.value)}
                        onBlur={handleJumperInputChange}
                        onKeyDown={(e) => e.key === 'Enter' && handleJumperInputChange()}
                    />
                    <span>页</span>
                </div>
            )}
        </div>
    );
};

export default Pagination;
