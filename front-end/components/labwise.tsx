'use client'

import { useMemo, useState } from 'react'
import Overview from './overview'
import { Icon } from './icon'
import FormModal from './form-model'
import DataPage from './data-page'
import {
    cloneData,
    footer,
    navItems,
    navIconNames,
    pageDescription,
    pageToKey,
    repository,
    type DataKey,
    type DataState,
    type PageName,
} from './util/util'


export const Button = ({ children, onClick, secondary = false, danger = false }: any) => <button type="button" onClick={onClick} className={`rounded-lg px-3.5 py-2 text-sm font-semibold transition ${danger ? 'text-red-600 hover:bg-red-50' : secondary ? 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50' : 'bg-blue-600 text-white shadow-sm hover:bg-blue-700'}`}>{children}</button>



export default function LabwiseDashboard() {
    const [active, setActive] = useState<PageName>("Overview");

    const [data, setData] = useState<DataState>(cloneData);

    const [modal, setModal] = useState<{
        key: DataKey;
        item?: any;
    } | null>(null);

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const key = pageToKey[active] as DataKey | undefined;

    const save = (item: any) => {
        if (!modal) return;

        setData((current) => ({
            ...current,
            [modal.key]: modal.item
                ? repository.update(current[modal.key], item)
                : repository.create(current[modal.key], item),
        }));

        setModal(null);
    };

    const remove = (item: any) => {
        if (
            !key ||
            !window.confirm(
                `Delete ${item.name || item.student}?`
            )
        ) {
            return;
        }

        setData((current) => ({
            ...current,
            [key]: repository.remove(current[key], item.id),
        }));
    };

    const navigate = (page: PageName) => {
        setActive(page);
        setSidebarOpen(false);
    };

    return (
        <div className="min-h-screen bg-[#f7f9fc] text-slate-900">

            <aside
                className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-[#111d36] text-slate-300 transition-transform lg:translate-x-0 ${sidebarOpen
                        ? "translate-x-0"
                        : "-translate-x-full"
                    }`}
            >

                <div className="flex h-20 items-center gap-3 px-6">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">
                        LW
                    </span>

                    <div>
                        <p className="font-bold tracking-tight text-white">
                            Labwise
                        </p>

                        <p className="text-[11px] text-slate-400">
                            Academic systems
                        </p>
                    </div>
                </div>
                <nav className="flex-1 space-y-1 px-3 py-5">
                    {navItems.map((item, index) => (
                        <button
                            type="button"
                            key={item}
                            onClick={() => navigate(item)}
                            className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm transition ${active === item
                                    ? "bg-blue-600 font-semibold text-white shadow-lg shadow-blue-950/20"
                                    : "hover:bg-white/10 hover:text-white"
                                }`}
                        >
                            <Icon
                                name={navIconNames[index]}
                                size={17}
                            />

                            {item}
                        </button>
                    ))}
                </nav>

                <div className="border-t border-white/10 p-4">
                    <div className="rounded-lg bg-white/5 p-3">
                        <p className="text-xs font-semibold text-white">
                            System status
                        </p>

                        <p className="mt-1 text-xs text-emerald-300">
                            ● All systems operational
                        </p>
                    </div>

                    <p className="mt-4 text-[11px] text-slate-500">
                        {footer}
                    </p>
                </div>
            </aside>

            {sidebarOpen && (
                <button
                    type="button"
                    aria-label="Close navigation"
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 z-30 bg-slate-950/30 lg:hidden"
                />
            )}

            <div className="lg:pl-64">

                <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-8">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            aria-label="Open navigation"
                            onClick={() => setSidebarOpen(true)}
                            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
                        >
                            ☰
                        </button>

                        <div>
                            <div className="hidden items-center gap-2 text-xs text-slate-400 sm:flex">
                                <span>Workspace</span>
                                <span>/</span>

                                <span className="text-slate-600">
                                    {active}
                                </span>
                            </div>

                            <h1 className="text-lg font-bold text-slate-900 sm:text-xl">
                                {active}
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            aria-label="Notifications"
                            className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                        >
                            ♧

                            <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-blue-600" />
                        </button>

                        <div className="hidden h-7 w-px bg-slate-200 sm:block" />

                        <div className="flex items-center gap-2">
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                                JVS
                            </span>

                            <div className="hidden sm:block">
                                <p className="text-sm font-semibold text-slate-800">
                                    Joseph Vinson Samuel
                                </p>

                                <p className="text-[11px] text-slate-500">
                                    Administrator
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="mx-auto max-w-[1500px] p-4 sm:p-8">
                    <div className="mb-7">
                        <p className="text-sm text-slate-500">
                            Good morning, Joseph. Here's what's happening today.
                        </p>

                        <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                            {active === "Overview"
                                ? "Dashboard overview"
                                : active}
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            {pageDescription(active)}
                        </p>
                    </div>

                    {active === "Overview" ? (
                        <Overview
                            data={data}
                            onNavigate={navigate}
                        />
                    ) : (
                        <DataPage
                            page={active}
                            data={data}
                            onAdd={() =>
                                setModal({ key: key! })
                            }
                            onEdit={(item: any) =>
                                setModal({
                                    key: key!,
                                    item,
                                })
                            }
                            onDelete={remove}
                        />
                    )}
                </main>
            </div>

            {modal && (
                <FormModal      
                    keyName={modal.key}
                    item={modal.item}
                    onClose={() => setModal(null)}
                    onSave={save}
                />
            )}
        </div>
    );
}

export { Icon }

