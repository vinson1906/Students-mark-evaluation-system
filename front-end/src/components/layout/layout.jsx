import { useCallback, useState } from "react";
import Sidebar from "../side-bar/side-bar";
import Topbar from "../topbar/tob-bar";
import { NAV_ITEMS } from "../../lib/navigation";

export default function DashboardLayout({ pages = [] }) {
    const [activeId, setActiveId] = useState(
        NAV_ITEMS[0].id
    );

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const closeSidebar = useCallback(
        () => setIsSidebarOpen(false),
        []
    );

    const openSidebar = useCallback(
        () => setIsSidebarOpen(true),
        []
    );

    const handleSelect = useCallback((id) => {
        setActiveId(id);
        setIsSidebarOpen(false);
    }, []);

    const activeItem =
        NAV_ITEMS.find((item) => item.id === activeId) ??
        NAV_ITEMS[0];

    const activePage = pages.find(
        (page) => page.id === activeId
    );

    return (
        <div className="min-h-screen bg-[#F7F9FC]">
            <Sidebar
                items={NAV_ITEMS}
                activeId={activeId}
                onSelect={handleSelect}
                isOpen={isSidebarOpen}
                onClose={closeSidebar}
            />

            <div className="flex min-h-screen min-w-0 flex-col lg:pl-64">
                <Topbar
                    title={activeItem.label}
                    onMenuClick={openSidebar}
                />

                <main className="min-w-0 flex-1 bg-[#F7F9FC] p-4 sm:p-6 lg:p-8">
                    {activePage ? (
                        activePage.element
                    ) : (
                        <h1 className="text-xl font-semibold">
                            Page not found
                        </h1>
                    )}
                </main>
            </div>
        </div>
    );
}