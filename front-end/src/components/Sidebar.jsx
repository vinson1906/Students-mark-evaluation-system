import Icon from './Icon';
import { NAV_ITEMS } from '../navigation';
import { useRoute } from '../context/RouterContext';
import { useAppData } from '../context/AppDataContext';

function SidebarContent({ collapsed, onNavigate }) {
  const { route } = useRoute();
  const { labs } = useAppData();
  const years = [...new Set(labs.map((l) => l.academicYear))].sort();
  const academicYear = years[years.length - 1];

  return (
    <div className="flex h-full flex-col bg-navy-900 text-slate-300">
      <div className={`flex h-16 items-center gap-3 border-b border-white/10 ${collapsed ? 'justify-center px-2' : 'px-5'}`}>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
          <Icon name="flask" size={20} />
        </span>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">Lab Evaluation</p>
            <p className="truncate text-xs text-navy-300">College administration</p>
          </div>
        )}
      </div>

      <nav aria-label="Main" className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const active = route === item.key;
          return (
            <a
              key={item.key}
              href={`#/${item.key}`}
              onClick={onNavigate}
              aria-current={active ? 'page' : undefined}
              title={collapsed ? item.label : undefined}
              className={`group relative flex items-center gap-3 rounded-lg py-2.5 text-sm font-medium transition-colors ${collapsed ? 'justify-center px-2' : 'px-3'
                } ${active ? 'bg-white/10 text-white' : 'hover:bg-white/5 hover:text-white'}`}
            >
              {active && <span className="absolute inset-y-2 left-0 w-1 rounded-r bg-blue-400" aria-hidden="true" />}
              <Icon name={item.icon} size={20} className={active ? 'text-blue-300' : 'text-navy-300 group-hover:text-white'} />
              {collapsed ? <span className="sr-only">{item.label}</span> : <span className="truncate">{item.label}</span>}
            </a>
          );
        })}
      </nav>

      {!collapsed && academicYear && (
        <div className="m-3 rounded-lg bg-white/5 px-3 py-2.5">
          <p className="text-xs text-navy-300">Academic year</p>
          <p className="text-sm font-medium tabular-nums text-white">{academicYear}</p>
        </div>
      )}
    </div>
  );
}

export default function Sidebar({ collapsed, mobileOpen, onCloseMobile }) {
  return (
    <>
      <aside className={`hidden shrink-0 transition-[width] duration-200 lg:block ${collapsed ? 'w-[72px]' : 'w-64'}`}>
        <SidebarContent collapsed={collapsed} onNavigate={undefined} />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 animate-fade-in bg-slate-900/60" onClick={onCloseMobile} aria-hidden="true" />
          <aside className="relative h-full w-72 max-w-[85vw] animate-slide-in-left shadow-xl" aria-label="Navigation menu">
            <SidebarContent collapsed={false} onNavigate={onCloseMobile} />
            <button
              type="button"
              onClick={onCloseMobile}
              aria-label="Close menu"
              className="absolute right-3 top-4 rounded-md p-1.5 text-navy-300 hover:bg-white/10 hover:text-white"
            >
              <Icon name="x" size={18} />
            </button>
          </aside>
        </div>
      )}
    </>
  );
}
