import { useEffect, useRef, useState } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import { useRoute } from './context/RouterContext';
import { NAV_ITEMS } from './navigation';
import OverviewPage from './pages/OverviewPage';
import DepartmentsPage from './pages/DepartmentsPage';
import LabsPage from './pages/LabsPage';
import FacultyPage from './pages/FacultyPage';
import SectionsPage from './pages/SectionsPage';
import StudentsPage from './pages/StudentsPage';
import TeamsPage from './pages/TeamsPage';
import MarksPage from './pages/MarksPage';

const PAGES = {
  overview: OverviewPage,
  departments: DepartmentsPage,
  labs: LabsPage,
  faculty: FacultyPage,
  sections: SectionsPage,
  students: StudentsPage,
  teams: TeamsPage,
  marks: MarksPage,
};

export default function App() {
  const { route } = useRoute();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const mainRef = useRef(null);
  const Page = PAGES[route] || OverviewPage;

  useEffect(() => {
    mainRef.current?.scrollTo(0, 0);
    const label = NAV_ITEMS.find((n) => n.key === route)?.label;
    document.title = `${label} | Lab Evaluation System`;
  }, [route]);

  return (
    <div className="flex h-full overflow-hidden bg-slate-50">
      <a
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          mainRef.current?.focus();
        }}
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-[70] focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:text-sm">
        Skip to content
      </a>
      <Sidebar collapsed={collapsed} mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          sidebarCollapsed={collapsed}
          onToggleSidebar={() => setCollapsed((c) => !c)}
          onOpenMobile={() => setMobileOpen(true)}
        />
        <main id="main" ref={mainRef} tabIndex={-1} className="flex-1 overflow-y-auto outline-none">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <Page key={route} />
          </div>
        </main>
      </div>
    </div>
  );
}
