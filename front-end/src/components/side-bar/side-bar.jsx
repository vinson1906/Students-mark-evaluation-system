

import { useEffect } from "react";
import { LayoutGrid, X } from "lucide-react";



export default function Sidebar({
    items,
    activeId,
    onSelect,
    isOpen,
    onClose,
}) {

    useEffect(() => {
        if (!isOpen) return;

        const onKeyDown = (event) => {
            if (event.key === "Escape") onClose();
        };

        document.addEventListener("keydown", onKeyDown);
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = previousOverflow;
        };
    }, [isOpen, onClose]);

    return (
        <>

            <div
                aria-hidden="true"
                onClick={onClose}
                className={`fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"
                    }`}
            />

            <aside
                aria-label="Primary"
                className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#111D36] text-slate-300 shadow-xl transition-transform duration-300 ease-out lg:translate-x-0 lg:shadow-none ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                {/* Brand */}
                <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2563EB] text-white shadow-lg shadow-blue-900/40">
                            <LayoutGrid className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <div className="leading-tight">
                            <p className="text-[15px] font-semibold tracking-tight text-white">
                                Student Mark Evaluvation System
                            </p>
                            <p className="text-[11px] text-slate-400">
                                Academic Administration
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close menu"
                        className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 lg:hidden"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto px-3 py-5">
                    <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Menu
                    </p>
                    <ul className="space-y-1">
                        {items.map(({ id, label, icon: Icon }) => {
                            const isActive = id === activeId;
                            return (
                                <li key={id}>
                                    <button
                                        type="button"
                                        onClick={() => onSelect(id)}
                                        aria-current={isActive ? "page" : undefined}
                                        className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${isActive
                                            ? "bg-[#2563EB] text-white shadow-md shadow-blue-900/30"
                                            : "text-slate-300 hover:bg-white/[0.07] hover:text-white"
                                            }`}
                                    >
                                        <Icon
                                            className={`h-[18px] w-[18px] shrink-0 transition-colors ${isActive
                                                ? "text-white"
                                                : "text-slate-400 group-hover:text-white"
                                                }`}
                                            aria-hidden="true"
                                        />
                                        <span className="truncate">{label}</span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* System status */}
                <div className="shrink-0 border-t border-white/10 p-4">
                    <div className="rounded-lg bg-white/[0.05] px-3 py-3">
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                            </span>
                            <p className="text-xs font-medium text-white">
                                All systems operational
                            </p>
                        </div>
                        <p className="mt-1 pl-4 text-[11px] text-slate-400">
                            Version 1.0.0
                        </p>
                    </div>
                </div>
            </aside>
        </>
    );
}