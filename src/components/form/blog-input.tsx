import { Field } from "@ark-ui/react";
import { InputHTMLAttributes } from "react";
import IconClear from "../icons/icon-clear";

interface BlogInputProps extends InputHTMLAttributes<HTMLInputElement> {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClear?: () => void;
}

export default function BlogInput({
                                      value,
                                      onChange,
                                      onClear,
                                      className = "",
                                      ...props
                                  }: BlogInputProps) {
    return (
        <div className="relative">
            <Field.Input
                value={value}
                onChange={onChange}
                className={`${className} pr-8`} // 为清除按钮留出空间
                {...props}
            />
            {value &&  <button
                type="button"
                onClick={() => {
                    if (onClear) onClear();
                }}
                className="absolute right-2 top-1/2 cursor-pointer"
                style={{ transform: "translateY(-50%)" }}
            >
                <IconClear width={20} height={20} color={"#666666"} onClick={() => {
                    if (onClear) onClear();
                }}/>
            </button>}
        </div>
    );
}
