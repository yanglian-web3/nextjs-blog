import IconLoading from "../icons/icon-loading";
import React from "react";
import "./page-loading.css"

export default function PageLoading({children, loading}: { children: React.ReactNode, loading: boolean }) {

    return <div className={"page-loading-container relative"}>
     <div className={`page-loading-icon-container page-loading-icon-container-${loading ? "show" : "hide"} w-full h-full justify-center items-center absolute position-center`}>
          <IconLoading width={50} height={50}/>
     </div>
        {children}
    </div>
}