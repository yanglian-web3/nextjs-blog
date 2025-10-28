'use client'
import React from "react";
import GlobalLoadingComponent from "./global-loading-component";

export default function CustomPageLoading({children, loading}: { children: React.ReactNode, loading: boolean }) {

    return <GlobalLoadingComponent>
        {children}
    </GlobalLoadingComponent>
}