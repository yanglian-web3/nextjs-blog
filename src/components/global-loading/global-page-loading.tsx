'use client'
import React from "react";

import { useLoading } from '../../context/loading-context'
import GlobalLoadingComponent from "./global-loading-component";

export default function GlobalPageLoading() {
    const { isLoading } = useLoading()

    if (!isLoading) return null

    return <GlobalLoadingComponent classNames={"fixed z-index-2000"}/>
}