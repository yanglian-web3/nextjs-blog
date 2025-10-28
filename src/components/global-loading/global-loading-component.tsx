import IconLoading from "../icons/icon-loading";
import React from "react";
import "./global-loading.css"

export default function GlobalLoadingComponent({classNames}: {classNames?: string}) {

    return <div className={`global-loading-icon-container global-loading-icon-container-show w-full h-full justify-center items-center absolute position-center ${classNames}`}>
        <IconLoading width={50} height={50}/>
    </div>
}