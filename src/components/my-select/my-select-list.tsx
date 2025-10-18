"use client"
import React, { useContext, useMemo } from 'react';
import ListShowAnimation from '../list-show-animation/list-show-animation';
import { MySelectListMode, MySelectObjectItem } from '../../types/my-select';
import './my-select-list.css';

interface MySelectListProps {
  list: MySelectObjectItem[]; // 列表数据
  selectMode?: MySelectListMode; // 列表渲染模式，默认向下拉
  listIsShow?: boolean; // 是否显示列表
  prop?: {
    label: string;
    value: string;
  };
  currentValue?: string | number; // 当前选中的值
  zIndex?: number;
  colorMode?: "lightGreen" | "yellow" | { [k: string]: { [k: string]: string } }; // 颜色模式
  listHeight?: number; // 列表高度
  onChooseOption?: (item: MySelectObjectItem) => void;
  onLeave?: () => void;
}

// 创建 Context 替代 Vue 的 inject
const FormSelectIndexContext = React.createContext<string>("1");
const FormColorModeContext = React.createContext<string>("yellow");

const MySelectList: React.FC<MySelectListProps> = ({
                                                     list,
                                                     selectMode,
                                                     listIsShow,
                                                     prop = { label: 'label', value: 'value' },
                                                     currentValue,
                                                     zIndex,
                                                     colorMode,
                                                     listHeight,
                                                     onChooseOption,
                                                     onLeave
                                                   }) => {
  // 模拟 Vue 的 inject
  const formSelectIndex = useContext(FormSelectIndexContext);
  const formColorMode = useContext(FormColorModeContext);

  // 计算 listIndex
  const listIndex = useMemo(() => {
    return zIndex || formSelectIndex;
  }, [zIndex, formSelectIndex]);

  // 计算 listColorMode
  const listColorMode = useMemo(() => {
    console.log("colorMode=", colorMode);
    console.log("formColorMode=", formColorMode);
    return colorMode || formColorMode;
  }, [colorMode, formColorMode]);

  // 选中下拉框选项
  const chooseOption = (item: MySelectObjectItem) => {
    onChooseOption?.(item);
  };

  // 动画结束
  const leave = () => {
    onLeave?.();
  };

  // 检查是否选中
  const isSelected = (item: MySelectObjectItem) => {
    return ['string', 'number'].includes(typeof currentValue) &&
        currentValue &&
        item[prop.value!] === currentValue;
  };

  if (!listIsShow) {
    return null;
  }

  return (
      <ListShowAnimation onLeave={leave} maxHeight={listHeight}>
        <ul
            className={`select-list-container select-list-container-${selectMode} select-list-container-${listColorMode}`}
            style={{
              zIndex: listIndex,
              overflow: listHeight ? 'auto' : 'hidden'
            }}
            onClick={(e) => e.stopPropagation()}
        >
          {list.map((item, index) => (
              <li
                  key={index}
                  className={`select-item row-center ${isSelected(item) ? 'selected' : ''}`}
                  onClick={() => chooseOption(item)}
              >
                <span className="label">{item[prop.label]}</span>
              </li>
          ))}
        </ul>
      </ListShowAnimation>
  );
};

export default MySelectList;
export { FormSelectIndexContext, FormColorModeContext };
