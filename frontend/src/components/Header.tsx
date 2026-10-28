import { NavLink, useLocation } from 'react-router-dom';
import {
  Search,
  UserRoundCheck,
  ShoppingBag,
  GraduationCap,
  Kanban,
  Users,
  Wallet,
} from 'lucide-react';
import { useState } from 'react';

import { useAppStore } from '@/store/AppContext';

const NAV_ITEMS = [
  { path: '/', label: '选导师', icon: UserRoundCheck },
  { path: '/courses', label: '课程商城', icon: ShoppingBag },
  { path: '/learning', label: '我的学习', icon: GraduationCap },
  { path: '/platform', label: '实战平台', icon: Kanban },
  { path: '/community', label: '学员社群', icon: Users },
];

export default function Header() {
  const { pathname } = useLocation();
  const { state } = useAppStore();
  const [keyword, setKeyword] = useState('');

  return (
    <header className="sticky top-0 z-50 w-full bg-[rgb(30_58_95)] border-b border-white/10">
      <div className="w-full px-4 md:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-6">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2 shrink-0">
            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-accent" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">
              Agent<span className="text-accent">Tutor</span>
            </span>
          </NavLink>

          {/* 导航 */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = item.path === '/' ? pathname === '/' : pathname.startsWith(item.path);
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${
                    isActive
                      ? 'text-white bg-white/10'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="size-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          {/* 余额 + 搜索 + 头像 */}
          <div className="flex-1 flex items-center justify-end gap-3 md:gap-4">
            <NavLink
              to="/wallet"
              className="shrink-0 h-9 px-3.5 rounded-full bg-white/10 border border-white/10 inline-flex items-center gap-1.5 text-sm font-medium text-white hover:bg-white/15 transition-colors"
              title="进入钱包"
            >
              <Wallet className="size-4 text-accent" />
              ¥{state.balance}
            </NavLink>
            <div className="relative w-full max-w-xs hidden lg:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/50" />
              <input
                type="search"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="搜索课程、任务与学员"
                className="w-full h-9 bg-white/10 border border-white/10 rounded-full pl-9 pr-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
            </div>
            <div className="shrink-0">
              <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-white font-semibold text-sm cursor-pointer hover:opacity-90 transition-opacity">
                林
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 移动端底部导航 */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[rgb(30_58_95)] border-t border-white/10 z-50">
        <div className="flex items-center justify-around py-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.path === '/' ? pathname === '/' : pathname.startsWith(item.path);
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={`flex flex-col items-center gap-0.5 px-2 py-1.5 ${
                  isActive ? 'text-accent' : 'text-white/60'
                }`}
              >
                <Icon className="size-5" />
                <span className="text-[11px]">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
