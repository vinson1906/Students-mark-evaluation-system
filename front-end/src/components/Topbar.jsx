import Icon from './Icon';
import GlobalSearch from './GlobalSearch';
import NotificationMenu from './NotificationMenu';
import { NAV_ITEMS } from '../navigation';
import { useRoute } from '../context/RouterContext';
import { mockProfile } from '../data';
import { initials } from '../utils/helpers';

export default function Topbar({ onToggleSidebar, onOpenMobile, sidebarCollapsed }) {
  const { route } = useRoute();
  const current = NAV_ITEMS.find((n) => n.key === route);

  return (
    <header className="z-30 shrink-0 border-b border-slate-200 bg-white">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3 sm:px-6">
        <button
          type="button"
          onClick={onOpenMobile}
          aria-label="Open navigation menu"
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
        >
          <Icon name="menu" size={20} />
        </button>
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-pressed={sidebarCollapsed}
          className="hidden rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:block"
        >
          <Icon name="panel" size={20} />
        </button>

        <nav aria-label="Breadcrumb" className="min-w-0 flex-1 md:flex-none">
          <ol className="flex items-center gap-1.5 text-sm">
            <li className="hidden text-slate-500 md:block">
              <a href="#/overview" className="hover:text-slate-800">Home</a>
            </li>
            {route !== 'overview' && (
              <li className="hidden text-slate-300 md:block" aria-hidden="true">/</li>
            )}
            <li className="truncate font-medium text-slate-900" aria-current="page">{current?.label}</li>
          </ol>
        </nav>

        <div className="order-last w-full md:order-none md:mx-auto md:w-auto md:max-w-md md:flex-1">
          <GlobalSearch />
        </div>

        <div className="flex items-center gap-1 md:ml-0">
          <NotificationMenu />
          <div className="ml-1 flex items-center gap-2.5 pl-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-800 text-sm font-medium text-white" aria-hidden="true">
              {initials(mockProfile.name)}
            </span>
            <div className="hidden text-left xl:block">
              <p className="text-sm font-medium leading-tight text-slate-900">{mockProfile.name}</p>
              <p className="text-xs text-slate-500">{mockProfile.role}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
