import { Code2, LayoutDashboard, BookOpen, Plus } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';

const menus = [
  { to: '/', label: '대시보드', icon: LayoutDashboard },
  { to: '/solutions', label: '풀이 기록', icon: BookOpen },
  { to: '/solutions/new', label: '새 풀이 작성', icon: Plus },
];

function AppLayout() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 md:flex">
      {/* 공통 사이드바 */}
      <aside className="border-b border-zinc-200 bg-white md:sticky md:top-0 md:h-screen md:w-60 md:shrink-0 md:border-r md:border-b-0">
        <div className="flex h-16 items-center gap-2 border-b border-zinc-200 px-6">
          <Code2 size={22} className="text-blue-600" />
          <span className="font-semibold">풀이 기록장</span>
        </div>

        <nav aria-label="주 메뉴" className="flex gap-2 p-3 md:flex-col">
          {menus.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                }`
              }
            >
              <Icon size={18} aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* 주소에 맞는 페이지가 표시되는 영역 */}
      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
  );
}

export default AppLayout;