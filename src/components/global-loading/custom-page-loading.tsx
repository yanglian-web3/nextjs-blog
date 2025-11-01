'use client'
import React from "react";
import GlobalLoadingComponent from "./global-loading-component";

export default function CustomPageLoading({children, loading}: { children: React.ReactNode, loading: boolean }) {

    return <div>
        {children}
        <div className={`${loading ? 'block' : 'hidden'} w-full h-full`}>
            <GlobalLoadingComponent/>
        </div>
    </div>
}