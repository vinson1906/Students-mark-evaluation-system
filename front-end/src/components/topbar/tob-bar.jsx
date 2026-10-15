"use client";

import { Bell, ChevronRight, Menu } from "lucide-react";


export default function Topbar({ title, onMenuClick }) {
    return (
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 shadow-sm sm:px-6">
            {/* Left: hamburger + title / breadcrumb */}
            <div className="flex min-w-0 items-center gap-3">
                <button
                    type="button"
                    onClick={onMenuClick}
                    aria-label="Open menu"
                    className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 lg:hidden"
                >
                    <Menu className="h-5 w-5" />
                </button>

                <div className="min-w-0 leading-tight">
                    <h1 className="truncate text-base font-semibold text-[#111D36] sm:text-lg">
                        {title}
                    </h1>
                    <nav aria-label="Breadcrumb">
                        <ol className="flex items-center gap-1 text-xs text-slate-500">
                            <li>Workspace</li>
                            <li aria-hidden="true">
                                <ChevronRight className="h-3 w-3" />
                            </li>
                            <li className="truncate font-medium text-slate-600">{title}</li>
                        </ol>
                    </nav>
                </div>
            </div>

            {/* Right: notifications + user */}
            <div className="flex shrink-0 items-center gap-2 sm:gap-4">
                <button
                    type="button"
                    aria-label="Notifications"
                    className="relative rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                    <Bell className="h-5 w-5" />
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                </button>

                <div className="hidden h-8 w-px bg-slate-200 sm:block" />

                <div className="flex items-center gap-3">
                    <div
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2563EB] text-sm font-semibold text-white"
                        aria-hidden="true"
                    >
                        SMES
                    </div>
                    <div className="hidden text-left leading-tight sm:block">
                        <p className="text-sm font-semibold text-[#111D36]">Admin</p>
                        <p className="text-xs text-slate-500">Administrator</p>
                    </div>
                </div>
            </div>
        </header>
    );
}